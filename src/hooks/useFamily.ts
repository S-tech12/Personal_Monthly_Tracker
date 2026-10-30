import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { familyService } from '../services/familyService';
import type { FamilyOverview, PendingInvite, SentInvite } from '../types/family.types';

export const useFamily = () => {
  const [overview, setOverview] = useState<FamilyOverview | null>(null);
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const [sentInvites, setSentInvites] = useState<SentInvite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingInvite, setIsSendingInvite] = useState(false);
  const [respondingToId, setRespondingToId] = useState<string | null>(null);

  const fetchFamilyData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [overviewRes, pendingRes, sentRes] = await Promise.all([
        familyService.getOverview().catch(() => null),
        familyService.getPendingInvites().catch(() => null),
        familyService.getSentInvites().catch(() => null)
      ]);

      if (overviewRes?.success) setOverview(overviewRes.data);
      if (pendingRes?.success) setPendingInvites(pendingRes.data.invites);
      if (sentRes?.success) setSentInvites(sentRes.data.invites);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch family data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFamilyData();
  }, [fetchFamilyData]);

  const handleSendInvite = async (email: string) => {
    if (!email) {
      toast.error('Email is required');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      setIsSendingInvite(true);
      const response = await familyService.sendInvite(email);
      if (response.success) {
        toast.success(response.message);
        await fetchFamilyData();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to send invite');
    } finally {
      setIsSendingInvite(false);
    }
  };

  const handleRespond = async (inviteId: string, action: 'accept' | 'reject') => {
    try {
      setRespondingToId(inviteId);
      const response = await familyService.respondToInvite(inviteId, action);
      if (response.success) {
        toast.success(response.message);
        await fetchFamilyData();
      }
    } catch (error: any) {
      toast.error(error.message || `Failed to ${action} invite`);
    } finally {
      setRespondingToId(null);
    }
  };

  return {
    overview,
    pendingInvites,
    sentInvites,
    isLoading,
    isSendingInvite,
    respondingToId,
    refetch: fetchFamilyData,
    handleSendInvite,
    handleRespond
  };
};
