import { CoinCardContainer } from '../components/CoinCard';
import { ArticleCard } from '../components/ArticleCard';
import articleData from '../../late_article_data.json';

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
          <ArticleCard article={articleData.Data[0]} />
          <ArticleCard article={articleData.Data[1]} />
        </div>
        </div>
    </>
  );
};

export default HomePage;
