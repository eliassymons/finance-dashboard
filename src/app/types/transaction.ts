export interface Transaction {
  id: number;
  name: string;
  amount: number;
  category: string;
  date: string;
  type: string;
}
export interface BudgetEntry {
  id: string;
  category: string;
  budgetedAmount: number;
  spentAmount?: number;
}
