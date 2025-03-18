import React, { useEffect, useState } from 'react';
import { CoinCard } from '../components/CoinCard';
import { ArticleCard } from '../components/ArticleCard';
import UserWalletCard from '../components/UserWalletCard';
import newsService from '../services/newsService';
import marketService from '../services/marketService';
import { MarketData } from '../types/crypto';
import { NewsArticle } from '../types/articles';
import { transformArticleData } from '../middleware/articleMiddleware';

const HomePage: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [coins, setCoins] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [marketLoading, setMarketLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await newsService.getLatestNews();
        setArticles(response.Data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch news');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const data = await marketService.getAllMarket();
        setCoins(data);
      } catch (err) {
        console.error('Error fetching market data:', err);
      } finally {
        setMarketLoading(false);
      }
    };

    fetchMarketData();
  }, []);

  // Fonction pour convertir MarketData en CoinData
  // Les données sont déjà nettoyées par le middleware
  const mapToCoinData = (coin: MarketData): MarketData => coin;

  // Obtenir les coins les plus importants
  const getTopCoins = () => {
    if (!coins || !Array.isArray(coins) || coins.length === 0) return [];
    
    const sortedByRank = [...coins].sort((a, b) => (a.rank || 0) - (b.rank || 0));
    const topRanked = sortedByRank.slice(0, 2);
    const sortedByPerformance = [...coins].sort((a, b) => 
      (b.delta?.day || 0) - (a.delta?.day || 0)
    );
    const topPerformers = sortedByPerformance.slice(0, 2);
    const combined = [...topRanked];
    
    for (const performer of topPerformers) {
      if (!combined.some(coin => coin.code === performer.code)) {
        combined.push(performer);
      }
      if (combined.length >= 4) break;
    }
    
    return combined.slice(0, 4);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col gap-6">
        <div className="text-2xl font-semibold">Dashboard</div>
        <div className="divider m-0 h-1"></div>
        <div className="flex flex-col sm:flex-row gap-4">
          <UserWalletCard />
        </div>
        <div className="divider m-0 h-1"></div>
        <div className="flex flex-col gap-4">
          <div className="text-2xl font-semibold">Market</div>
          <div className="w-full">
            {marketLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="skeleton h-48 w-full"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {getTopCoins().map((coin, index) => {
                  const coinData = mapToCoinData(coin);
                  let title = "Cryptocurrency";
                  
                  if (index === 0) title = "Top Ranked";
                  else if (index === 1) title = `Rank #${coin.rank}`;
                  else if (coin.delta?.day && (coin.delta.day > 1)) title = "Top Performer";
                  else title = `Rank #${coin.rank}`;
                  
                  return (
                    <div key={coin.code} className="w-full">
                      <CoinCard 
                        title={title}
                        coin={coinData}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="divider m-0 h-1"></div>
        
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-semibold">Latest News</div>
            {error && (
              <div className="text-sm text-error">
                {error}
              </div>
            )}
          </div>
          <div className="w-full">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="skeleton h-48 w-full"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.isArray(articles) && articles.length > 0 ? (
                  articles.map(article => {
                    const articleData = transformArticleData(article);
                    return (
                      <div key={article.ID} className="w-full">
                        <ArticleCard 
                          article={articleData}
                        />
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-2 text-center text-base-content/70">
                    No articles available at this time
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
