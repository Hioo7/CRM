import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineArrowLeft, HiOutlineCreditCard, HiOutlinePhoto } from 'react-icons/hi2';
import { useCustomers } from '@/hooks/useCustomers';
import { useModalState } from '@/hooks/useModalState';
import { cardScanService } from '@/services/cardScanService';
import { CreateCustomerModal } from '@/components/customers/CreateCustomerModal';
import { ERROR_DISPLAY_DURATION_MS } from '@/config/constants';
import type { CreateCustomerPayload } from '@/types/customer';

type ScanStatus = 'idle' | 'processing' | 'error';

function splitName(full: string | null): { firstName: string; lastName: string } {
  const parts = (full ?? '').trim().split(/\s+/);
  return { firstName: parts[0] ?? '', lastName: parts.slice(1).join(' ') };
}

export function CardScanPage() {
  const navigate = useNavigate();
  const { createCustomer } = useCustomers();
  const modal = useModalState();

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [status, setStatus] = useState<ScanStatus>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<Partial<CreateCustomerPayload> | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } },
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch {
        if (!cancelled) setCameraError('Camera access denied. Please allow camera permission and try again.');
      }
    }

    void startCamera();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const captureAndScan = (): void => {
    const video = videoRef.current;
    if (!video || status !== 'idle') return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) void processBlob(blob);
    }, 'image/jpeg', 0.92);
  };

  const processBlob = async (blob: Blob): Promise<void> => {
    setStatus('processing');
    setErrorMsg(null);
    try {
      const result = await cardScanService.scan(blob);
      if (result.success && result.contact) {
        const { contact } = result;
        const { firstName, lastName } = splitName(contact.name);
        setInitialValues({
          firstName,
          lastName,
          company: contact.company ?? '',
          email: contact.emails[0] ?? '',
          phone: contact.phones[0] ?? '',
        });
        modal.open();
      } else {
        setErrorMsg('No contact details detected. Please try again with a clearer image.');
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Scan failed. Please try again.';
      setErrorMsg(msg);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    } finally {
      setStatus((prev) => (prev === 'processing' ? 'idle' : prev));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    void processBlob(file);
  };

  const handleModalClose = (): void => {
    modal.close();
    setInitialValues(null);
  };

  const handleSubmit = async (payload: CreateCustomerPayload): Promise<void> => {
    await createCustomer(payload);
    modal.close();
    setInitialValues(null);
    setShowToast(true);
    setTimeout(() => setShowToast(false), ERROR_DISPLAY_DURATION_MS);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex flex-col bg-black">
        {/* Camera feed */}
        {!cameraError ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center px-8 text-center">
            <p className="text-sm text-white/70">{cameraError}</p>
          </div>
        )}

        {/* Dim overlay during processing */}
        {status === 'processing' && (
          <div className="absolute inset-0 bg-black/40" />
        )}

        {/* Card scan guide frame */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="h-44 w-72 rounded-2xl border-2 border-dashed border-white/60 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
          <p className="mt-3 text-center text-xs font-medium tracking-wide text-white/70">
            Align the business card within the frame
          </p>
        </div>

        {/* Back button */}
        <button
          className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/30"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <HiOutlineArrowLeft className="h-5 w-5" />
        </button>

        {/* Error message */}
        {status === 'error' && errorMsg && (
          <div className="absolute left-1/2 top-6 -translate-x-1/2 rounded-2xl bg-red-500/90 px-4 py-2 text-center text-sm font-medium text-white backdrop-blur-sm">
            {errorMsg}
          </div>
        )}

        {/* Bottom controls: 3-column grid keeps scan button centred */}
        <div className="absolute bottom-10 left-0 right-0 grid grid-cols-3 items-end px-8">
          {/* Left — empty spacer */}
          <div />

          {/* Centre — shutter button */}
          <div className="flex flex-col items-center gap-2">
            <button
              className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition active:scale-95 disabled:opacity-60"
              onClick={() => captureAndScan()}
              disabled={status !== 'idle' || !!cameraError}
              aria-label="Scan business card"
            >
              {status === 'processing' ? (
                <span className="loading loading-spinner loading-md text-emerald-600" />
              ) : (
                <HiOutlineCreditCard className="h-8 w-8 text-slate-800" />
              )}
            </button>
            <p className="text-xs font-medium tracking-wide text-white/60">
              {status === 'processing' ? 'Scanning…' : 'Scan Card'}
            </p>
          </div>

          {/* Right — upload button */}
          <div className="flex flex-col items-center gap-2">
            <button
              className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/30 active:scale-95 disabled:opacity-60"
              onClick={() => fileInputRef.current?.click()}
              disabled={status !== 'idle'}
              aria-label="Upload image from gallery"
            >
              <HiOutlinePhoto className="h-6 w-6" />
            </button>
            <p className="text-xs font-medium tracking-wide text-white/60">Upload</p>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Success toast */}
        {showToast && (
          <div className="absolute bottom-36 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(5,150,105,0.35)]">
            Customer created successfully
          </div>
        )}
      </div>

      {/* Modal rendered outside the overlay stack */}
      {initialValues && (
        <CreateCustomerModal
          isOpen={modal.isOpen}
          onClose={handleModalClose}
          onSubmit={handleSubmit}
          initialValues={initialValues}
        />
      )}
    </>
  );
}
