import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Optimized Supabase client with connection pooling
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Disable session persistence for better performance
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-application-name': 'geegees-salon',
    },
  },
});

// Helper function for retry logic with exponential backoff
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.error(`[Retry ${attempt}/${maxRetries}] Operation failed:`, error);

      if (attempt < maxRetries) {
        // Exponential backoff: delay * attempt
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }

  throw lastError || new Error('Operation failed after retries');
}

/**
 * Upload an image to Supabase Storage
 * @param file - The file to upload
 * @param bucket - The storage bucket name (default: 'salon-images')
 * @param folder - Optional folder path within the bucket
 * @returns The public URL of the uploaded image
 */
export async function uploadImage(
  file: File,
  bucket: string = 'salon-images',
  folder?: string
): Promise<string> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      throw error;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
}

/**
 * Delete an image from Supabase Storage
 * @param imageUrl - The full URL of the image to delete
 * @param bucket - The storage bucket name (default: 'salon-images')
 */
export async function deleteImage(
  imageUrl: string,
  bucket: string = 'salon-images'
): Promise<void> {
  try {
    // Extract file path from URL
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split(`/${bucket}/`);
    if (pathParts.length < 2) {
      throw new Error('Invalid image URL');
    }
    const filePath = pathParts[1];

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    throw new Error('Failed to delete image');
  }
}

/**
 * List all images in a folder
 * @param bucket - The storage bucket name
 * @param folder - Optional folder path
 */
export async function listImages(
  bucket: string = 'salon-images',
  folder?: string
): Promise<string[]> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folder || '', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) throw error;

    return data.map(file => {
      const path = folder ? `${folder}/${file.name}` : file.name;
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);
      return urlData.publicUrl;
    });
  } catch (error) {
    console.error('Error listing images:', error);
    return [];
  }
}
