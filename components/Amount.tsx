import React from "react";

interface AmountProps {
  amount?: number;
}

const Amount = ({ amount }: AmountProps) => {
  const formatter = new Intl.NumberFormat("fi-FI", {
    style: "currency",
    currency: "EUR",
  });
  return (
    <span
      className={
        amount != null ? (amount < 0 ? "text-red-400" : "text-green-400") : ""
      }
    >
      {amount != null ? formatter.format(amount) : "-"}
    </span>
  );
};

export default Amount;
