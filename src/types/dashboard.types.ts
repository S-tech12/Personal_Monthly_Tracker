export interface SummaryMetric {
  title: string;
  amount: number;
  trend: 'up' | 'down' | 'neutral';
  trendPercentage: number;
  trendText: string;
}

export interface Expense {
  id: string;
  category: string;
  categoryIcon: string;
  categoryColorClass: string;
  amount: number;
  date: string;
  time: string;
  currency: string;
}

export interface CategoryData {
  name: string;
  percentage: number;
  colorClass: string;
}

export interface ChartData {
  totalAmount: number;
  categories: CategoryData[];
}

export interface DashboardData {
  todaySpending: SummaryMetric;
  monthSpending: SummaryMetric;
  budgetRemaining: SummaryMetric;
  chartData: ChartData;
  recentExpenses: Expense[];
}
