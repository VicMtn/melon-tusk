import React, { useEffect, useState } from 'react';
import { CoinCard } from '../components/CoinCard';
import { ArticleCard } from '../components/ArticleCard';
import UserWalletCard from '../components/UserWalletCard';
import newsService, { NewsArticle } from '../services/newsService';
import marketService from '../services/marketService';
import { MarketData } from '../types/crypto';
import CryptoFearGreedIndex from '../components/CryptoFearGreedIndex';

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
        setArticles(response.data);
        setError(null);
      } catch (err) {
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
    
    // Trier par rang
    const sortedByRank = [...coins].sort((a, b) => (a.rank || 0) - (b.rank || 0));
    
    // Obtenir le top 2 par rang
    const topRanked = sortedByRank.slice(0, 2);
    
    // Trier par performance sur 24h
    const sortedByPerformance = [...coins].sort((a, b) => 
      (b.delta?.day || 0) - (a.delta?.day || 0)
    );
    
    // Obtenir le top 2 par performance
    const topPerformers = sortedByPerformance.slice(0, 2);
    
    // Combiner et dédupliquer
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
    <>
      <div className="flex flex-col gap-4">
        <div className="text-xl font-medium">Dashboard</div>
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
        <div className="flex justify-between items-center">
          <div className="text-m font-medium">Latest News</div>
          {error && (
            <div className="text-sm text-error">
              {error}
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex gap-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="skeleton w-full h-48"></div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4 overflow-x-auto pb-2">
            {Array.isArray(articles) && articles.map(article => (
              <ArticleCard 
                key={article.articleId} 
                article={{
                  ID: article.articleId,
                  IMAGE_URL: article.imageUrl,
                  TITLE: article.title,
                  URL: article.url,
                  SOURCE_DATA: {
                    NAME: article.source.name,
                    IMAGE_URL: article.source.imageUrl,
                    LANG: 'EN'
                  },
                  BODY: article.body,
                  PUBLISHED_ON: new Date(article.publishedOn).getTime() / 1000,
                  TYPE: '',
                  GUID: '',
                  KEYWORDS: '',
                  LANG: 'EN',
                  SENTIMENT: article.sentiment,
                  CATEGORY_DATA: article.categories.map(cat => ({ NAME: cat, CATEGORY: cat }))
                }}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default HomePage;
