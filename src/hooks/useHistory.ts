import { useState, useEffect } from 'react';
import type { DailyHistoryGroup, HistoryViewMode } from '../types/history.types';
import { getExpenseHistory } from '../services/historyService';

export const useHistory = () => {
  const [historyGroups, setHistoryGroups] = useState<DailyHistoryGroup[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<HistoryViewMode>('daily');
  const [selectedDate, setSelectedDate] = useState<string>('October 24, 2023'); // Placeholder for now

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const data = await getExpenseHistory(viewMode, selectedDate);
        setHistoryGroups(data);
      } catch (error) {
        console.error('Failed to fetch history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [viewMode, selectedDate]);

  const handleViewModeChange = (mode: HistoryViewMode) => {
    setViewMode(mode);
  };

  return {
    historyGroups,
    isLoading,
    viewMode,
    selectedDate,
    handleViewModeChange
  };
};
