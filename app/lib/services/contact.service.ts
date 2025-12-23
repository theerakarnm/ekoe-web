import { apiClient, type SuccessResponseWrapper } from '~/lib/api-client';

export interface CreateContactDto {
  name: string;
  email: string;
  topic: string;
  message: string;
}

export interface ContactResponse {
  id: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  status: 'unread' | 'read' | 'responded';
  createdAt: string;
  updatedAt: string;
  readAt: string | null;
}

/**
 * Submit a contact form
 */
export async function submitContactForm(data: CreateContactDto): Promise<ContactResponse> {
  const response = await apiClient.post<SuccessResponseWrapper<ContactResponse>>(
    '/api/contacts',
    { ...data }
  );
  return response.data.data;
}
