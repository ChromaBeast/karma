/**
 * ImageKit CDN & Direct Upload Helper for Karma
 * Account Endpoint: https://ik.imagekit.io/karmaimgs/
 */

export const IMAGEKIT_ENDPOINT =
  process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/karmaimgs/';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/v1';

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

  if (pathOrUrl.startsWith('http://') || (pathOrUrl.startsWith('https://') && !pathOrUrl.includes('imagekit.io')) || pathOrUrl.startsWith('data:')) {
    return pathOrUrl;
  }

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

export interface UploadResult {
  url: string;
  fileId?: string;
  name: string;
  size: number;
}

/**
 * Direct Client-Side Image Upload to ImageKit
 */
export async function uploadToImageKit(
  file: File,
  folder: string = 'proof_mockups'
): Promise<UploadResult> {
  try {
    // 1. Fetch upload auth parameters from Go API Gateway
    const authRes = await fetch(`${API_BASE}/storage/imagekit-auth`);
    if (!authRes.ok) {
      throw new Error('Failed to retrieve upload signature');
    }
    const authData = await authRes.json();

    // 2. Prepare FormData for ImageKit
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', `${Date.now()}_${file.name.replace(/\s+/g, '_')}`);
    formData.append('publicKey', authData.publicKey);
    formData.append('signature', authData.signature);
    formData.append('expire', String(authData.expire));
    formData.append('token', authData.token);
    formData.append('folder', `/${folder}`);
    formData.append('useUniqueFileName', 'true');

    // 3. Post directly to ImageKit Upload API
    const uploadRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      body: formData,
    });

    if (uploadRes.ok) {
      const result = await uploadRes.json();
      return {
        url: result.url || `${IMAGEKIT_ENDPOINT.replace(/\/+$/, '')}/${result.filePath.replace(/^\/+/, '')}`,
        fileId: result.fileId,
        name: result.name || file.name,
        size: result.size || file.size,
      };
    }
  } catch (err) {
    console.warn('ImageKit direct upload fallback to local data URI:', err);
  }

  // 4. Local fast fallback if offline or no keys configured yet
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve({
        url: e.target?.result as string,
        name: file.name,
        size: file.size,
      });
    };
    reader.readAsDataURL(file);
  });
}
