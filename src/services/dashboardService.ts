import type { DashboardData } from '../types/dashboard.types';

export const dashboardService = {
  getDashboardData: async (): Promise<DashboardData> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          todaySpending: {
            title: "Today's Spending",
            amount: 124.50,
            trend: 'down',
            trendPercentage: 12,
            trendText: 'vs yesterday'
          },
          monthSpending: {
            title: "This Month",
            amount: 3842.00,
            trend: 'up',
            trendPercentage: 5,
            trendText: 'vs last month'
          },
          budgetRemaining: {
            title: "Budget Remaining",
            amount: 1258.00,
            trend: 'neutral',
            trendPercentage: 72, // Using as percentage of bar filled
            trendText: ''
          },
          chartData: {
            totalAmount: 3800,
            categories: [
              { name: 'Lifestyle', percentage: 75, colorClass: 'bg-primary' },
              { name: 'Savings', percentage: 25, colorClass: 'bg-secondary' }
            ]
          },
          recentExpenses: [
            {
              id: '1',
              category: 'Dining',
              categoryIcon: 'restaurant',
              categoryColorClass: 'text-primary bg-primary-fixed',
              amount: -42.00,
              date: 'Oct 24, 2023',
              time: '12:45 PM',
              currency: 'USD'
            },
            {
              id: '2',
              category: 'Groceries',
              categoryIcon: 'shopping_cart',
              categoryColorClass: 'text-secondary bg-secondary-fixed',
              amount: -156.80,
              date: 'Oct 23, 2023',
              time: '06:12 PM',
              currency: 'USD'
            },
            {
              id: '3',
              category: 'Transport',
              categoryIcon: 'directions_car',
              categoryColorClass: 'text-tertiary bg-tertiary-fixed',
              amount: -25.00,
              date: 'Oct 23, 2023',
              time: '08:30 AM',
              currency: 'USD'
            }
          ]
        });
      }, 1000);
    });
  },

  sendMonthlyReport: async (): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1500);
    });
  }
};
