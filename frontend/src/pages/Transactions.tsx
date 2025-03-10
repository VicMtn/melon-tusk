import CryptoTable, { TableColumn } from "../components/CryptoTable";

interface TransactionData {
  code?: string;
  name?: string;
  rate?: number;
  png64?: string;
  type: 'buy' | 'sell' | 'deposit';
  amount: number;
  total: number;
  date: string;
  currency?: string;
}

const Transactions = () => {
  // Mock data for transactions
  const mockTransactions: TransactionData[] = [
    {
      type: "deposit",
      amount: 5000,
      total: 5000,
      date: "2024-03-16 10:00",
      currency: "USD"
    },
    {
      code: "BTC",
      name: "Bitcoin",
      rate: 65420.50,
      png64: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
      type: "buy",
      amount: 0.5,
      total: 32710.25,
      date: "2024-03-15 14:30"
    },
    {
      type: "deposit",
      amount: 10000,
      total: 10000,
      date: "2024-03-15 09:00",
      currency: "USD"
    },
    {
      code: "ETH",
      name: "Ethereum",
      rate: 3520.75,
      png64: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
      type: "sell",
      amount: 2.5,
      total: 8801.88,
      date: "2024-03-14 09:15"
    },
    {
      code: "SOL",
      name: "Solana",
      rate: 145.30,
      png64: "https://cryptologos.cc/logos/solana-sol-logo.png",
      type: "buy",
      amount: 15,
      total: 2179.50,
      date: "2024-03-13 16:45"
    },
    {
      code: "DOT",
      name: "Polkadot",
      rate: 28.45,
      png64: "https://cryptologos.cc/logos/polkadot-new-dot-logo.png",
      type: "sell",
      amount: 100,
      total: 2845.00,
      date: "2024-03-12 11:20"
    }
  ];

  const columns: TableColumn<TransactionData>[] = [
    {
      key: "date",
      header: "Date",
      render: (item) => (
        <span className="text-gray-600">{item.date}</span>
      )
    },
    {
      key: "type",
      header: "Type",
      render: (item) => (
        <span className={`px-2 py-1 rounded-full text-sm ${
          item.type === 'buy' ? 'bg-success/20 text-success' : 
          item.type === 'sell' ? 'bg-error/20 text-error' :
          'bg-info/20 text-info'
        }`}>
          {item.type === 'deposit' ? 'DEPOSIT' : item.type.toUpperCase()}
        </span>
      )
    },
    {
      key: "crypto",
      header: "Asset",
      render: (item) => {
        if (item.type === 'deposit') {
          return (
            <div className="flex items-center gap-3">
              <span className="icon-[tabler--wallet] size-8 text-info"></span>
              <div>
                <div className="font-medium">Wallet</div>
                <div className="text-sm text-gray-500">Deposit</div>
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
      }
    },
    {
      key: "amount",
      header: "Amount",
      render: (item) => (
        <span>
          {item.type === 'deposit' 
            ? `$${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}` 
            : `${item.amount} ${item.code}`
          }
        </span>
      )
    },
    {
      key: "rate",
      header: "Rate",
      render: (item) => (
        item.type === 'deposit' 
          ? <span>-</span>
          : <span>${item.rate?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
      )
    },
    {
      key: "total",
      header: "Total",
      render: (item) => (
        <span className="font-medium">${item.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
      )
    }
  ];

  return (
    <div className="p-6">
      <CryptoTable<TransactionData>
        data={mockTransactions}
        columns={columns}
        title="Transaction History"
        showSearch={true}
        emptyMessage="No transactions found"
      />
    </div>
  );
};

export default Transactions;