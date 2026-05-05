/**
 * Optimizes an image URL using images.weserv.nl proxy.
 * Converts to WebP/Avif (based on browser support) and resizes.
 * 
 * @param {string} url The original image URL
 * @param {object} options Optimization options (w: width, q: quality, etc.)
 * @returns {string} The optimized image URL
 */
export const optimizeImage = (url, { w, h, q = 80, fit = 'cover', a = 'center' } = {}) => {
  if (!url) return '';
  
  // If it's already an optimized URL or a data URL, return it
  if (url.includes('images.weserv.nl') || url.startsWith('data:')) return url;
  
  // Strip protocol for weserv
  const cleanUrl = url.replace(/^https?:\/\//, '');
  
  let params = `url=${cleanUrl}&q=${q}&output=webp`;
  if (w) params += `&w=${w}`;
  if (h) params += `&h=${h}`;
  if (fit) params += `&fit=${fit}`;
  if (a) params += `&a=${a}`;
  
  return `https://images.weserv.nl/?${params}`;
};
