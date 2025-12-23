import { apiClient, type SuccessResponseWrapper } from '~/lib/api-client';

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

export interface ContactListResponse {
  contacts: ContactResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ContactListParams {
  page?: number;
  limit?: number;
  status?: 'unread' | 'read' | 'responded';
  search?: string;
}

/**
 * Get all contacts (admin only)
 */
export async function getContacts(
  params: ContactListParams = {},
  headers?: Headers
): Promise<ContactListResponse> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set('page', params.page.toString());
  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.status) searchParams.set('status', params.status);
  if (params.search) searchParams.set('search', params.search);

  const url = `/api/contacts/admin${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  const response = await apiClient.get<SuccessResponseWrapper<ContactListResponse>>(url, {
    headers: headers ? Object.fromEntries(headers) : undefined,
  });
  return response.data.data;
}

/**
 * Get a single contact by ID (admin only)
 */
export async function getContactById(
  id: string,
  headers?: Headers
): Promise<ContactResponse> {
  const response = await apiClient.get<SuccessResponseWrapper<ContactResponse>>(
    `/api/contacts/admin/${id}`,
    {
      headers: headers ? Object.fromEntries(headers) : undefined,
    }
  );
  return response.data.data;
}

/**
 * Update contact status (admin only)
 */
export async function updateContactStatus(
  id: string,
  status: 'unread' | 'read' | 'responded'
): Promise<ContactResponse> {
  const response = await apiClient.patch<SuccessResponseWrapper<ContactResponse>>(
    `/api/contacts/admin/${id}/status`,
    { status }
  );
  return response.data.data;
}

/**
 * Delete a contact (admin only)
 */
export async function deleteContact(id: string): Promise<void> {
  await apiClient.delete(`/api/contacts/admin/${id}`);
}

/**
 * Get unread contacts count (admin only)
 */
export async function getUnreadContactsCount(): Promise<number> {
  const response = await apiClient.get<SuccessResponseWrapper<{ count: number }>>(
    '/api/contacts/admin/unread-count'
  );
  return response.data.data.count;
}
