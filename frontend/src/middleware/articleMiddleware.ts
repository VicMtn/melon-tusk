import { NewsArticle } from '../types/articles';
import { ArticleData } from '../components/ArticleCard';

export const transformArticleData = (article: NewsArticle): ArticleData => ({
  ID: article.ID,
  IMAGE_URL: article.IMAGE_URL,
  TITLE: article.TITLE,
  URL: article.URL,
  SOURCE_DATA: {
    NAME: article.SOURCE_DATA?.NAME || '',
    IMAGE_URL: article.SOURCE_DATA?.IMAGE_URL || '',
    LANG: article.SOURCE_DATA?.LANG || 'EN'
  },
  BODY: article.BODY,
  PUBLISHED_ON: article.PUBLISHED_ON,
  TYPE: article.TYPE,
  GUID: article.GUID,
  KEYWORDS: article.KEYWORDS,
  LANG: article.LANG,
  SENTIMENT: article.SENTIMENT,
  CATEGORY_DATA: article.CATEGORY_DATA || []
}); 