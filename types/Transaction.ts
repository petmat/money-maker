export interface Transaction {
  date: Date;
  payee: string;
  amount: number;
  balance?: number;
}
