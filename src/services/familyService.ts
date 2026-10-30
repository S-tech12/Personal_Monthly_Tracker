import type { FamilyOverview, PendingInvite, SentInvite } from '../types/family.types';

const API_URL = 'http://localhost:5000/api/family';

export const familyService = {
  getOverview: async (): Promise<{ success: boolean; data: FamilyOverview }> => {
    const response = await fetch(`${API_URL}/overview`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch family overview');
    }

    return data;
  },

  getPendingInvites: async (): Promise<{ success: boolean; data: { invites: PendingInvite[] } }> => {
    const response = await fetch(`${API_URL}/invites/pending`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch pending invites');
    }

    return data;
  },

  getSentInvites: async (): Promise<{ success: boolean; data: { invites: SentInvite[] } }> => {
    const response = await fetch(`${API_URL}/invites/sent`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch sent invites');
    }

    return data;
  },

  sendInvite: async (email: string): Promise<{ success: boolean; message: string }> => {
    const response = await fetch(`${API_URL}/invite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to send invite');
    }

    return data;
  },

  respondToInvite: async (inviteId: string, action: 'accept' | 'reject'): Promise<{ success: boolean; message: string }> => {
    const response = await fetch(`${API_URL}/respond`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ inviteId, action })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Failed to ${action} invite`);
    }

    return data;
  }
};
