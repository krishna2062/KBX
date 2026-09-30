import {
  fetchLiveContentFromDatabase,
  submitContactMessageToDb,
  submitProjectInquiryToDb
} from './db';

export interface PublicInquiryPayload {
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  projectType: string;
  timeline: string;
  budgetRange: string;
  description: string;
  targetUsers?: string;
  preferredTech?: string;
  referenceUrl?: string;
  additionalMessage?: string;
  attachmentName?: string;
}

export interface PublicMessagePayload {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export async function fetchPublicContent() {
  return fetchLiveContentFromDatabase();
}

export async function submitProjectInquiry(payload: PublicInquiryPayload) {
  return submitProjectInquiryToDb(payload);
}

export async function submitContactMessage(payload: PublicMessagePayload) {
  return submitContactMessageToDb(payload);
}

export async function trackVisit() {
  try {
    await fetch('/api/track-visit', { method: 'POST' });
  } catch {
    // Non-blocking
  }
}
