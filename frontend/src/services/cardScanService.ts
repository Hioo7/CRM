import { CARD_SCAN_API_URL } from '@/config/constants';

export interface CardScanContact {
  name: string | null;
  job_title: string | null;
  company: string | null;
  emails: string[];
  phones: string[];
  websites: string[];
  address: string | null;
  raw_text: string[];
}

export interface CardScanResponse {
  success: boolean;
  contact: CardScanContact;
  confidence: number;
  message: string | null;
}

export const cardScanService = {
  async scan(imageBlob: Blob): Promise<CardScanResponse> {
    const formData = new FormData();
    formData.append('file', imageBlob, 'card.jpg');
    const response = await fetch(CARD_SCAN_API_URL, { method: 'POST', body: formData });
    if (!response.ok) {
      const body = await response.json().catch(() => null) as { detail?: string } | null;
      throw new Error(body?.detail ?? 'Card scan failed. Please try again.');
    }
    return response.json() as Promise<CardScanResponse>;
  },
};
