import type { DailyHistoryGroup, HistoryViewMode } from '../types/history.types';

// Mock data based on the Stitch UI
const mockDailyHistory: DailyHistoryGroup[] = [
  {
    dateHeader: 'Tuesday, Oct 24, 2023',
    totalAmount: -158.50,
    expenses: [
      {
        id: '1',
        category: 'Dining',
        icon: 'restaurant',
        amount: -42.00,
        time: '12:45 PM',
        date: '2023-10-24'
      },
      {
        id: '2',
        category: 'Transport',
        icon: 'directions_car',
        amount: -18.50,
        time: '09:15 AM',
        date: '2023-10-24'
      },
      {
        id: '3',
        category: 'Shopping',
        icon: 'shopping_bag',
        amount: -98.00,
        time: '08:30 AM',
        date: '2023-10-24'
      }
    ]
  },
  {
    dateHeader: 'Monday, Oct 23, 2023',
    totalAmount: -12.00,
    expenses: [
      {
        id: '4',
        category: 'Groceries',
        icon: 'coffee',
        amount: -12.00,
        time: '04:20 PM',
        date: '2023-10-23'
      }
    ]
  }
];

export const getExpenseHistory = async (mode: HistoryViewMode, date: string): Promise<DailyHistoryGroup[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (mode === 'daily') {
    return mockDailyHistory;
  }
  
  // Return empty for monthly to show empty state if needed, or we could mock monthly data
  return [];
};
