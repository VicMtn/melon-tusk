import React, { useEffect, useState } from "react";
import CryptoTable, { TableColumn } from "../components/CryptoTable";
import transactionService from "../services/transactionService";
import { Transaction } from "../types/transaction";

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await transactionService.getHistory();
        setTransactions(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch transactions.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const columns: TableColumn<Transaction>[] = [
    {
      key: "date",
      header: "Date",
      render: (item) => (
        <span className="text-gray-600">{new Date(item.createdAt!).toLocaleString()}</span>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (item) => (
        <span
          className={`px-2 py-1 rounded-full text-sm ${
            item.type === "buy"
              ? "bg-success/20 text-success"
              : item.type === "sell"
              ? "bg-error/20 text-error"
              : "bg-info/20 text-info"
          }`}
        >
          {item.type === "deposit" || item.type === "withdraw"
            ? item.type.toUpperCase()
            : item.type.toUpperCase()}
        </span>
      ),
    },
    {
      key: "crypto",
      header: "Asset",
      render: (item) => {
        if (item.type === "deposit" || item.type === "withdraw") {
          return (
            <div className="flex items-center gap-3">
              <span className="icon-[tabler--wallet] size-8 text-info"></span>
              <div>
                <div className="font-medium">Wallet</div>
                <div className="text-sm text-gray-500">
                  {item.type === "deposit" ? "Deposit" : "Withdraw"}
                </div>
              </div>
            </div>
          );
        }
        return (
          <div className="flex items-center gap-3">
            {item.png64 && (
              <img
                src={item.png64}
                alt={item.name}
                className="w-8 h-8 rounded-full"
              />
            )}
            <div>
              <div className="font-medium">{item.code}</div>
              <div className="text-sm text-gray-500">{item.name}</div>
            </div>
          </div>
        );
      },
    },
    {
      key: "amount",
      header: "Amount",
      render: (item) => (
        <span>
          {item.type === "deposit" || item.type === "withdraw"
            ? `$${item.amount.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}`
            : `${item.amount} ${item.code}`}
        </span>
      ),
    },
    {
      key: "rate",
      header: "Rate",
      render: (item) =>
        item.type === "deposit" || item.type === "withdraw" ? (
          <span>-</span>
        ) : (
          <span>
            ${item.rate?.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
        ),
    },
    {
      key: "total",
      header: "Total",
      render: (item) => (
        <span className="font-medium">
          ${item.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </span>
      ),
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <CryptoTable<Transaction>
      data={transactions}
      columns={columns}
      title="Transaction History"
      showSearch={true}
      emptyMessage="No transactions found"
    />
  );
};

export default Transactions;