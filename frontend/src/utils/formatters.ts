/**
 * Utilitaires de formatage pour l'application
 */

/**
 * Nettoie un code de crypto-monnaie en retirant les underscores
 * @param code Le code de la crypto-monnaie à nettoyer
 * @returns Le code nettoyé sans underscores
 */
export const cleanCryptoCode = (code: string | undefined): string => {
  if (!code) return '';
  return code.replace(/_/g, '');
};

/**
 * Formate un nombre en devise avec le symbole $ et 2 décimales
 * @param value La valeur à formater
 * @returns La valeur formatée en devise
 */
export const formatCurrency = (value: number | undefined): string => {
  if (typeof value !== 'number') return '$0.00';
  return '$' + value.toLocaleString('en-US', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
};

/**
 * Formate un pourcentage avec 2 décimales et le symbole %
 * @param value La valeur à formater (1 = 100%)
 * @returns La valeur formatée en pourcentage
 */
export const formatPercentage = (value: number | undefined): string => {
  if (typeof value !== 'number') return '0.00%';
  return ((value - 1) * 100).toFixed(2) + '%';
}; 