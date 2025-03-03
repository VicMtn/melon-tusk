export interface ArticleData {
  TYPE: string;
  ID: number;
  GUID: string;
  PUBLISHED_ON: number;
  IMAGE_URL: string;
  TITLE: string;
  URL: string;
  BODY: string;
  KEYWORDS: string;
  LANG: string;
  SENTIMENT: string;
  SOURCE_DATA: {
    NAME: string;
    IMAGE_URL: string;
    LANG: string;
  };
  CATEGORY_DATA: Array<{
    NAME: string;
    CATEGORY: string;
  }>;
}

interface ArticleCardProps {
  article: ArticleData;
}

export function ArticleCard({ article }: ArticleCardProps) {
    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleDateString(article.LANG.toLowerCase(), {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="card sm:card-side flex-1 bg-white hover:bg-base-100 cursor-pointer transition-colors">
            <figure className="sm:w-48 sm:min-w-48 h-48 sm:h-full">
                <img
                    src={article.IMAGE_URL}
                    alt={article.TITLE}
                    className="w-full h-full object-cover"
                />
            </figure>
            <div className="card-body p-4">
                <h5 className="card-title text-lg line-clamp-2 mb-2">{article.TITLE}</h5>
                <p className="text-base-content/70 text-sm line-clamp-3 mb-2">
                    {article.BODY}
                </p>
                <div className="flex items-center gap-2 text-xs text-base-content/50">
                    <img 
                        src={article.SOURCE_DATA.IMAGE_URL} 
                        alt={article.SOURCE_DATA.NAME}
                        className="w-4 h-4 rounded-full"
                    />
                    <span>{article.SOURCE_DATA.NAME}</span>
                    <span>•</span>
                    <span>{formatDate(article.PUBLISHED_ON)}</span>
                    <span>•</span>
                    <span className={`capitalize ${
                        article.SENTIMENT === 'POSITIVE' ? 'badge badge-success' :
                        article.SENTIMENT === 'NEGATIVE' ? 'badge badge-error' :
                        'badge badge-warning'
                    }`}>
                        {article.SENTIMENT.toLowerCase()}
                    </span>
                </div>
            </div>
        </div>
    );
}