import * as R from "ramda";

import { ReactNode, useEffect, useState } from "react";

import Amount from "../components/Amount";
import Button from "../components/Button";
import Link from "next/link";
import { Transaction } from "../types/Transaction";
import TransactionList from "../components/TransactionList";
import { monthNumberToName } from "../utils/months";

interface AccountMonthInfo {
  initialBalance: number | null;
}

interface CardProps {
  title?: string;
  className?: string;
  children?: ReactNode;
}

const Card = ({ title, children, className }: CardProps) => {
  return (
    <div className={`bg-gray-700 m-4 p-4 ${className}`}>
      {title && (
        <h2 className="w-full text-center text-2xl text-gray-300">{title}</h2>
      )}
      {children}
    </div>
  );
};

interface RouteParams {
  year?: string;
  month?: string;
}

const getTransactions = async (year: number, month: number) => {
  const response = await fetch(
    `http://localhost:5000/api/transactions/${year}/${month}`
  );
  const data: Transaction[] = await response.json();
  return data;
};

const getInitialBalance = async (year: number, month: number) => {
  const response = await fetch(
    `http://localhost:5000/api/initial-balance/${year}/${month}`
  );
  const { initialBalance }: AccountMonthInfo = await response.json();
  return initialBalance;
};

const Home = () => {
  const [startBalance, setStartBalance] = useState<number>();
  const [endBalance, setEndBalance] = useState<number>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;

  useEffect(() => {
    const fetchTransactions = async () => {
      if (year && month) {
        const serverTransactions = await getTransactions(year, month);

        setTransactions(serverTransactions);
        setEndBalance(
          R.head(
            serverTransactions
              .map((t) => t.balance)
              .filter((b): b is number => !!b)
          ) ?? undefined
        );

        const serverStartBalance = await getInitialBalance(year, month);
        setStartBalance(serverStartBalance || undefined);
      }
    };
    fetchTransactions().catch(console.error);
  }, [year, month]);

  const difference =
    endBalance && startBalance ? endBalance - startBalance : undefined;

  const topWithdrawals = R.take(10, R.sortBy(R.prop("amount"), transactions));

  const [previousMonth, previousMonthYear] =
    month && year ? (month === 1 ? [12, year - 1] : [month - 1, year]) : [];

  const [nextMonth, nextMonthYear] =
    month && year ? (month === 12 ? [1, year + 1] : [month + 1, year]) : [];

  return (
    <>
      <div className="flex flex-wrap justify-center">
        <div className="w-192 flex justify-center">
          <h1 className="text-8xl">
            {month && monthNumberToName(month)} {year}
          </h1>
        </div>
        <div className="w-192 flex justify-between px-4 pt-4">
          {previousMonth && (
            <Link
              href={`/month/${previousMonthYear}/${monthNumberToName(
                previousMonth
              )}`}
            >
              <a className="text-gray-400">{"<"} Previous</a>
            </Link>
          )}
          {nextMonth && (
            <Link
              href={`/month/${nextMonthYear}/${monthNumberToName(nextMonth)}`}
            >
              <a className="text-gray-400">Next {">"}</a>
            </Link>
          )}
        </div>
        <div className="grid grid-cols-3 w-192 mt-4">
          <Card title="Starting balance" className="">
            <p className="w-full text-center text-4xl py-4">
              <Amount amount={startBalance} />
            </p>
          </Card>
          <Card title="End balance" className="">
            <p className="w-full text-center text-4xl py-4">
              <Amount amount={endBalance} />
            </p>
          </Card>
          <Card title="Difference">
            <p className="w-full text-center text-4xl py-4">
              <Amount amount={difference} />
            </p>
          </Card>
          <Card className="col-span-3 bg-gray-800 relative">
            <Button
              className="absolute top-3 right-3"
              onClick={() => setShowAllTransactions(!showAllTransactions)}
            >
              {showAllTransactions ? "Show largest" : "Show all"}
            </Button>
            {showAllTransactions ? (
              <TransactionList transactions={transactions} />
            ) : (
              <div>
                <h3 className="text-xl text-gray-400">Largest withdrawals</h3>
                <div className={`grid grid-cols-withdrawalTable mt-4`}>
                  {topWithdrawals.map(({ payee, amount }, index) => (
                    <>
                      <div className="p-2">{index + 1}.</div>
                      <div className="p-2">{payee}</div>
                      <div className="p-2 text-right">
                        <Amount amount={amount} />
                      </div>
                    </>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  );
};

export default Home;
