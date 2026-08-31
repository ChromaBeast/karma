/**
 * ImageKit CDN Helper for Karma
 * Account Endpoint: https://ik.imagekit.io/karmaimgs/
 */

export const IMAGEKIT_ENDPOINT =
  process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/karmaimgs/';

export interface ImageKitTransformOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'avif' | 'png' | 'jpg';
  blur?: number;
  crop?: 'maintain_ratio' | 'force' | 'at_least';
}

/**
 * Builds an optimized ImageKit CDN URL with responsive image transformation parameters.
 */
export function getIKUrl(pathOrUrl: string, opts?: ImageKitTransformOptions): string {
  if (!pathOrUrl) return '';

  const cleanEndpoint = IMAGEKIT_ENDPOINT.replace(/\/+$/, '');

  // If already an absolute URL not on ImageKit, return as is
  if (pathOrUrl.startsWith('http://') || (pathOrUrl.startsWith('https://') && !pathOrUrl.includes('imagekit.io'))) {
    return pathOrUrl;
  }

  // Extract relative path
  let relativePath = pathOrUrl;
  if (pathOrUrl.startsWith(cleanEndpoint)) {
    relativePath = pathOrUrl.replace(cleanEndpoint, '');
  }
  relativePath = relativePath.replace(/^\/+/, '');

  if (!opts) {
    return `${cleanEndpoint}/${relativePath}`;
  }

  const transformParts: string[] = [];
  if (opts.width) transformParts.push(`w-${opts.width}`);
  if (opts.height) transformParts.push(`h-${opts.height}`);
  if (opts.quality) transformParts.push(`q-${opts.quality}`);
  if (opts.format) transformParts.push(`f-${opts.format}`);
  else transformParts.push('f-auto');
  if (opts.blur) transformParts.push(`bl-${opts.blur}`);
  if (opts.crop) transformParts.push(`c-${opts.crop}`);

  const transformStr = `tr:${transformParts.join(',')}`;
  return `${cleanEndpoint}/${transformStr}/${relativePath}`;
}

export const DEFAULT_AVATAR = getIKUrl('default-avatar.png', { width: 120, height: 120, format: 'auto' });
export const DEFAULT_MOCKUP_PREVIEW = getIKUrl('sample-terminal.png', { width: 1200, format: 'auto' });
