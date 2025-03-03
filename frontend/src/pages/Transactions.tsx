const Transactions = () => {
  /*const user = getUser();



  */

  return (
    <div className="flex flex-col gap-4">
        <div className="text-xl font-medium">
          Your transactions
        </div>
        <div className="divider m-0 h-1"></div>
    <div className="overflow-x-auto">
  <table className="table table-xs">
    <thead>
      <tr>
        <th></th>
        <th>Date</th>
        <th>Type</th>
        <th>Coin</th>
        <th>Amount</th>
        <th>Price</th>
        <th>Status</th>

      </tr>
    </thead>
    <tbody>
      <tr>
        <th>1</th>
        <td>2025-03-03</td>
        <td>Selling</td>
        <td>BTC</td>
        <td>0.0001</td>
        <td>10000</td>
        <td>Success</td>
      </tr>
    </tbody>
  </table>
</div>
</div>
  );
};

export default Transactions;