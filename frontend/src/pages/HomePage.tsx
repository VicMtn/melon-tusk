import { CoinCardContainer } from '../components/CoinCard';

const HomePage: React.FC = () => {
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="text-xl font-medium">Dashboard</div>
        <div className="divider m-0 h-1"></div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="card bg-orange-400/60 glass w-full sm:w-1/3">
            <div className="card-body">
              <div className="text-base-content/50 mb-3">My total assets</div>
              <div className="text-4xl mb-4">3538.45$</div>
              <div className="card-actions">
                <a href="/assets" className="link link-primary no-underline">
                  Go to assets
                </a>
              </div>
            </div>
          </div>
          <div className="w-full sm:w-2/3">
            <CoinCardContainer />
          </div>
        </div>
        <div className="divider m-0 h-1"></div>
        <div className="text-m font-medium">Top News</div>
        <div className="flex gap-4">
          <div className="card sm:card-side flex-1 bg-white">
            <figure className="sm:w-48 sm:min-w-48">
              <img
                src="https://cdn.flyonui.com/fy-assets/components/card/image-7.png"
                alt="headphone"
                className="w-full h-full object-cover"
              />
            </figure>
            <div className="card-body">
              <h5 className="card-title mb-2.5">Airpods Max</h5>
              <p className="mb-3">
                This is a wider card with supporting text below as a natural
                lead-in to additional content.
              </p>
              <div className="card-actions">
                <button className="btn btn-primary">Buy Now</button>
                <button className="btn btn-secondary btn-soft">
                  Add to cart
                </button>
              </div>
            </div>
          </div>
          <div className="card sm:card-side flex-1 bg-white">
            <figure className="sm:w-48 sm:min-w-48">
              <img
                src="https://cdn.flyonui.com/fy-assets/components/card/image-7.png"
                alt="headphone"
                className="w-full h-full object-cover"
              />
            </figure>
            <div className="card-body">
              <h5 className="card-title mb-2.5">Airpods Max</h5>
              <p className="mb-3">
                This is a wider card with supporting text below as a natural
                lead-in to additional content.
              </p>
              <div className="card-actions">
                <button className="btn btn-primary">Buy Now</button>
                <button className="btn btn-secondary btn-soft">
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
