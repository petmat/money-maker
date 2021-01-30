import Amount from "./Amount";
import React from "react";
import { Transaction } from "../types/Transaction";
import { format } from "date-fns";

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList = ({ transactions }: TransactionListProps) => (
  <div>
    <h3 className="text-xl text-gray-400">All transactions</h3>
    <div className="grid grid-cols-allTransactionsTable mt-4">
      {transactions.map(({ date, payee, amount }) => (
        <>
          <div className="p-2">{format(new Date(date), "dd.MM.yyyy")}</div>
          <div className="p-2">{payee}</div>
          <div className="p-2 text-right">
            <Amount amount={amount} />
          </div>
        </>
      ))}
    </div>
  </div>
);
export default TransactionList;
