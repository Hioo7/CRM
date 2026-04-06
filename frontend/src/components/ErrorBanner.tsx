interface ErrorBannerProps {
  message: string | null;
}

export function ErrorBanner({ message }: ErrorBannerProps) {
  if (!message) return null;

  return (
    <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800 shadow-sm">
      <span>{message}</span>
    </div>
  );
}
