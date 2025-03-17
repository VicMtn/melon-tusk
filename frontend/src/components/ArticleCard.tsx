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
  CATEGORY_DATA?: Array<{
    NAME: string;
    CATEGORY: string;
  }>;
}

interface ArticleCardProps {
  article: ArticleData;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const formatDate = (timestamp: number) => {
    try {
      return new Date(timestamp * 1000).toLocaleDateString(
        article.LANG?.toLowerCase() || 'en',
        {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      );
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date unavailable";
    }
  };

  return (
    <>
      <div 
        className="card sm:card-side flex-1 bg-white hover:bg-base-100 transition-colors"
      >
        <figure className="sm:w-48 sm:min-w-48 h-48 sm:h-full">
          <img
            src={article.IMAGE_URL || "https://placehold.co/600x400?text=No+Image"}
            alt={article.TITLE}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "https://placehold.co/600x400?text=No+Image";
            }}
          />
        </figure>
        <div className="card-body p-4">
          <h5 className="card-title text-lg line-clamp-2 mb-2">
            {article.TITLE}
          </h5>
          <p className="text-base-content/70 text-sm line-clamp-3 mb-2">
            {article.BODY}
          </p>
          <div className="flex items-center gap-2 text-xs text-base-content/50">
            {article.SOURCE_DATA?.IMAGE_URL && (
              <img
                src={article.SOURCE_DATA.IMAGE_URL}
                alt={article.SOURCE_DATA.NAME || "Source"}
                className="w-4 h-4 rounded-full"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
            {article.SOURCE_DATA?.NAME && <span>{article.SOURCE_DATA.NAME}</span>}
            {article.SOURCE_DATA?.NAME && article.PUBLISHED_ON && <span>•</span>}
            {article.PUBLISHED_ON && <span>{formatDate(article.PUBLISHED_ON)}</span>}
            {article.SENTIMENT && (
              <>
                <span>•</span>
                <span
                  className={`capitalize ${
                    article.SENTIMENT === "POSITIVE"
                      ? "badge badge-success"
                      : article.SENTIMENT === "NEGATIVE"
                      ? "badge badge-error"
                      : "badge badge-warning"
                  }`}
                >
                  {article.SENTIMENT.toLowerCase()}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
