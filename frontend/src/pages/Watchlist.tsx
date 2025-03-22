const Watchlist: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="card bg-base-200/50 shadow-md">
        <div className="card-body">
          <div className="flex flex-col items-center gap-4 text-center">
            <span className="icon-[tabler--tools] size-12 text-primary"></span>
            <h2 className="text-2xl font-bold">Feature in Development</h2>
            <p className="text-base-content/70 max-w-md">
              The watchlist feature is currently under development. You'll be able to track your favorite cryptocurrencies here soon!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watchlist;