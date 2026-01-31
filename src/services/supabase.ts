// services/supabase.ts - Supabase client and database operations

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { nanoid } from "nanoid";
import axios from "axios";
import {
  ContentPackage,
  Difficulty,
  Language
} from "../types/index.js";
import {
  STORAGE_BUCKET_THUMBNAILS,
  STORAGE_BUCKET_AI_TOOL_LOGOS,
  AI_TOOL_LOGOS,
  AI_TOOL_DISPLAY_NAMES
} from "../constants.js";

let supabaseClient: SupabaseClient | null = null;

export function initializeSupabase(url: string, key: string): SupabaseClient {
  if (!url || !key) {
    throw new Error("Supabase URL and Key are required. Set SUPABASE_URL and SUPABASE_KEY environment variables.");
  }
  
  supabaseClient = createClient(url, key);
  return supabaseClient;
}

export function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    throw new Error("Supabase client not initialized. Call initializeSupabase() first.");
  }
  return supabaseClient;
}

// Generate CONTENTS-XXXXX format ID
function generateContentId(): string {
  const randomNum = Math.floor(Math.random() * 100000);
  return `CONTENTS-${randomNum.toString().padStart(5, '0')}`;
}

// Generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Upload image to Supabase Storage from URL
async function uploadImageFromUrl(
  imageUrl: string,
  bucketName: string,
  fileName: string
): Promise<string | null> {
  const client = getSupabaseClient();
  
  try {
    // Download image
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 10000
    });
    
    const buffer = Buffer.from(response.data);
    const contentType = response.headers['content-type'] || 'image/png';
    
    // Upload to Supabase Storage
    const { error } = await client
      .storage
      .from(bucketName)
      .upload(fileName, buffer, {
        contentType,
        upsert: true
      });

    if (error) {
      console.error(`Failed to upload image to ${bucketName}:`, error);
      return null;
    }
    
    // Get public URL
    const { data: publicUrlData } = client
      .storage
      .from(bucketName)
      .getPublicUrl(fileName);
    
    return publicUrlData.publicUrl;
    
  } catch (error) {
    console.error(`Failed to download/upload image:`, error);
    return null;
  }
}

// Upload thumbnail to Storage and return public URL
export async function uploadThumbnail(
  thumbnailUrl: string,
  contentId: string
): Promise<string | null> {
  if (!thumbnailUrl) return null;
  
  // Extract file extension from URL
  const urlObj = new URL(thumbnailUrl);
  const pathname = urlObj.pathname;
  const ext = pathname.split('.').pop() || 'jpg';
  
  const fileName = `content-${contentId}-${Date.now()}.${ext}`;
  
  return await uploadImageFromUrl(
    thumbnailUrl,
    STORAGE_BUCKET_THUMBNAILS,
    fileName
  );
}

// Upload AI Tool logo to Storage and return public URL
export async function uploadAIToolLogo(
  toolName: string,
  toolId: string
): Promise<string | null> {
  // Try to get logo URL from constants
  const logoUrl = AI_TOOL_LOGOS[toolName];
  
  if (!logoUrl) {
    console.warn(`No logo URL found for AI tool: ${toolName}`);
    return null;
  }
  
  const fileName = `${generateSlug(toolName)}-${toolId}.png`;
  
  return await uploadImageFromUrl(
    logoUrl,
    STORAGE_BUCKET_AI_TOOL_LOGOS,
    fileName
  );
}

// Check if content already exists by sourceUrl
export async function checkDuplicateContent(sourceUrl: string): Promise<boolean> {
  const client = getSupabaseClient();
  
  const { data, error } = await client
    .from("Content")
    .select("id")
    .eq("sourceUrl", sourceUrl)
    .limit(1);
  
  if (error) {
    throw new Error(`Failed to check duplicate: ${error.message}`);
  }
  
  return (data && data.length > 0);
}

// Get all categories from database
export async function getAllCategories(): Promise<Array<{ id: string; name: string; slug: string }>> {
  const client = getSupabaseClient();
  
  const { data, error } = await client
    .from("Category")
    .select("id, name, slug")
    .order("name");
  
  if (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }
  
  return data || [];
}

// Get or create category - PRD Version 2.0: ID must match name exactly
async function upsertCategory(name: string): Promise<string> {
  const client = getSupabaseClient();
  const slug = generateSlug(name);

  // PRD: Category ID must be exactly the category name (text, image, video, code)
  const id = name;

  // First, try to find existing category
  const { data: existing } = await client
    .from("Category")
    .select("id")
    .eq("id", id)
    .single();

  if (existing) {
    return existing.id;
  }

  // Create new category if not exists
  const { data, error } = await client
    .from("Category")
    .insert({ id, name, slug })
    .select("id")
    .single();

  if (error) {
    // If duplicate error, try to fetch again
    if (error.code === '23505') {
      const { data: retry } = await client
        .from("Category")
        .select("id")
        .eq("id", id)
        .single();
      if (retry) return retry.id;
    }
    throw new Error(`Failed to create category: ${error.message}`);
  }

  return data.id;
}

// Get or create AI tool with logo upload
async function upsertAITool(name: string): Promise<string> {
  const client = getSupabaseClient();

  // Normalize to lowercase without spaces for slug matching (PRD requirement for Gemini output)
  const normalizedName = name.toLowerCase().replace(/\s+/g, '');
  const slug = generateSlug(normalizedName);
  const id = `tool-${nanoid(10)}`;

  // Get proper display name (e.g., "chatgpt" -> "ChatGPT", "githubcopilot" -> "GitHub Copilot")
  const displayName = AI_TOOL_DISPLAY_NAMES[normalizedName] || name;

  console.log(`[DEBUG] Upserting AI tool: "${name}" -> normalized: "${normalizedName}" -> display: "${displayName}" -> slug: "${slug}"`);

  // Check if AI tool already exists by slug
  const { data: existingTool, error: selectError } = await client
    .from("AITool")
    .select("id, logoUrl")
    .eq("slug", slug)
    .single();

  if (selectError && selectError.code !== 'PGRST116') {
    // PGRST116 = no rows returned, which is expected for new tools
    console.error(`[DEBUG] Error selecting AI tool "${normalizedName}":`, selectError);
  }

  // If exists, return existing ID
  if (existingTool) {
    console.log(`[DEBUG] AI tool "${displayName}" already exists with ID: ${existingTool.id}`);
    return existingTool.id;
  }

  console.log(`[DEBUG] Creating new AI tool "${displayName}" with ID: ${id}`);

  // Upload logo to Storage (uses normalized name to match logo URLs)
  const logoUrl = await uploadAIToolLogo(normalizedName, id);
  console.log(`[DEBUG] Logo URL for "${displayName}":`, logoUrl || 'none');

  // Create new AI tool with proper display name
  const { data, error } = await client
    .from("AITool")
    .insert({
      id,
      name: displayName, // Use display name (e.g., "ChatGPT", "GitHub Copilot")
      slug,
      logoUrl: logoUrl || undefined
    })
    .select("id")
    .single();

  if (error) {
    // If duplicate error, try to fetch existing tool
    if (error.code === '23505') {
      console.log(`[DEBUG] Duplicate slug detected for "${displayName}", fetching existing tool`);
      const { data: retry } = await client
        .from("AITool")
        .select("id")
        .eq("slug", slug)
        .single();

      if (retry) {
        console.log(`[DEBUG] Found existing AI tool "${displayName}" with ID: ${retry.id}`);
        return retry.id;
      }
    }

    console.error(`[DEBUG] Error creating AI tool "${displayName}":`, error);
    throw new Error(`Failed to create AI tool: ${error.message}`);
  }

  console.log(`[DEBUG] Successfully created AI tool "${displayName}" with ID: ${data.id}`);

  return data.id;
}

// Get or create tag - with retry logic for race conditions
async function upsertTag(name: string, retries: number = 3): Promise<string> {
  const client = getSupabaseClient();
  // Remove # symbol from tag name for storage
  const cleanName = name.replace(/^#/, '').trim();

  if (!cleanName) {
    throw new Error(`Invalid tag name: "${name}"`);
  }

  const slug = generateSlug(cleanName);

  console.log(`[DEBUG] Upserting tag: "${name}" -> cleaned: "${cleanName}" -> slug: "${slug}"`);

  for (let attempt = 0; attempt < retries; attempt++) {
    // First, try to find existing tag
    const { data: existing, error: selectError } = await client
      .from("Tag")
      .select("id")
      .eq("name", cleanName)
      .maybeSingle();

    if (selectError) {
      console.error(`[DEBUG] Error selecting tag "${cleanName}":`, selectError);
      throw new Error(`Failed to select tag "${cleanName}": ${selectError.message}`);
    }

    if (existing) {
      console.log(`[DEBUG] Tag "${cleanName}" already exists with ID: ${existing.id}`);
      return existing.id;
    }

    // Tag doesn't exist, try to create it
    const id = `tag-${nanoid(10)}`;
    console.log(`[DEBUG] Creating new tag "${cleanName}" with ID: ${id} (attempt ${attempt + 1}/${retries})`);

    const { data, error } = await client
      .from("Tag")
      .insert({ id, name: cleanName, slug })
      .select("id")
      .single();

    if (!error && data) {
      console.log(`[DEBUG] Successfully created tag "${cleanName}" with ID: ${data.id}`);
      return data.id;
    }

    // If duplicate error (race condition), retry
    if (error && error.code === '23505') {
      console.log(`[DEBUG] Duplicate detected for tag "${cleanName}", retrying (attempt ${attempt + 1}/${retries})`);
      // Small delay before retry
      await new Promise(resolve => setTimeout(resolve, 100));
      continue;
    }

    // Other error, throw
    if (error) {
      console.error(`[DEBUG] Error creating tag "${cleanName}":`, error);
      throw new Error(`Failed to create tag "${cleanName}": ${error.message}`);
    }
  }

  // If all retries failed, make one final attempt to fetch
  const { data: finalAttempt } = await client
    .from("Tag")
    .select("id")
    .eq("name", cleanName)
    .single();

  if (finalAttempt) {
    console.log(`[DEBUG] Found existing tag "${cleanName}" after retries with ID: ${finalAttempt.id}`);
    return finalAttempt.id;
  }

  throw new Error(`Failed to upsert tag "${cleanName}" after ${retries} retries`);
}

// Save complete content package to Supabase
export async function saveContentToSupabase(
  contentPackage: ContentPackage
): Promise<{ contentId: string; success: boolean }> {
  const client = getSupabaseClient();
  
  // Generate content ID
  const contentId = generateContentId();
  const now = new Date().toISOString();
  
  // Upload thumbnail to Storage if exists (fails silently, no fallback to original URL)
  let uploadedThumbnailUrl: string | undefined = undefined;
  if (contentPackage.content.thumbnailUrl) {
    const storageUrl = await uploadThumbnail(
      contentPackage.content.thumbnailUrl,
      contentId
    );
    // Only use storage URL, don't fallback to original URL
    uploadedThumbnailUrl = storageUrl || undefined;
  }
  
  // Prepare content data with uploaded thumbnail URL
  const contentData = {
    ...contentPackage.content,
    id: contentId,
    thumbnailUrl: uploadedThumbnailUrl,
    createdAt: now,
    updatedAt: now
  };
  
  try {
    // 1. Insert main content
    const { error: contentError } = await client
      .from("Content")
      .insert(contentData);
    
    if (contentError) {
      throw new Error(`Failed to insert content: ${contentError.message}`);
    }
    
    // 2. Handle categories
    if (contentPackage.categories.length > 0) {
      const categoryIds = await Promise.all(
        contentPackage.categories.map(name => upsertCategory(name))
      );
      
      const contentCategories = categoryIds.map(categoryId => ({
        contentId,
        categoryId
      }));
      
      const { error: categoryError } = await client
        .from("ContentCategory")
        .insert(contentCategories);
      
      if (categoryError) {
        throw new Error(`Failed to link categories: ${categoryError.message}`);
      }
    }
    
    // 3. Handle AI tools
    if (contentPackage.aiTools.length > 0) {
      console.log(`[DEBUG] Processing ${contentPackage.aiTools.length} AI tools:`, contentPackage.aiTools);

      const toolIds = await Promise.all(
        contentPackage.aiTools.map(name => upsertAITool(name))
      );

      console.log(`[DEBUG] Created/found AI tool IDs:`, toolIds);

      const contentTools = toolIds.map(toolId => ({
        contentId,
        toolId
      }));

      console.log(`[DEBUG] Inserting ContentAITool records:`, contentTools);

      const { error: toolError } = await client
        .from("ContentAITool")
        .insert(contentTools);

      if (toolError) {
        console.error(`[DEBUG] Failed to insert ContentAITool:`, toolError);
        throw new Error(`Failed to link AI tools: ${toolError.message}`);
      }

      console.log(`[DEBUG] Successfully linked ${toolIds.length} AI tools to content`);
    } else {
      console.log(`[DEBUG] No AI tools to process`);
    }
    
    // 4. Handle tags
    if (contentPackage.tags.length > 0) {
      console.log(`[DEBUG] Original tags from contentPackage:`, contentPackage.tags);

      // Remove duplicates from tags array
      const uniqueTags = [...new Set(contentPackage.tags)];
      console.log(`[DEBUG] Unique tags after deduplication:`, uniqueTags);

      // Process tags sequentially to avoid race conditions
      const tagIds: string[] = [];
      for (const tagName of uniqueTags) {
        const tagId = await upsertTag(tagName);
        tagIds.push(tagId);
      }

      const contentTags = tagIds.map((tagId: string) => ({
        contentId,
        tagId
      }));

      const { error: tagError } = await client
        .from("ContentTag")
        .insert(contentTags);
      
      if (tagError) {
        throw new Error(`Failed to link tags: ${tagError.message}`);
      }
    }
    
    // 5. Handle estimated time
    if (contentPackage.estimatedTime) {
      const estimatedTimeData = {
        ...contentPackage.estimatedTime,
        id: `time-${nanoid(10)}`,
        contentId
      };
      
      const { error: timeError } = await client
        .from("EstimatedTime")
        .insert(estimatedTimeData);
      
      if (timeError) {
        throw new Error(`Failed to insert estimated time: ${timeError.message}`);
      }
    }
    
    // 6. Handle result previews (PRD: should be exactly 4 items)
    if (contentPackage.resultPreviews && contentPackage.resultPreviews.length > 0) {
      console.log(`[DEBUG] Inserting ${contentPackage.resultPreviews.length} result previews for content ${contentId}`);

      const previews = contentPackage.resultPreviews.map(preview => ({
        ...preview,
        id: `preview-${nanoid(10)}`,
        contentId
      }));

      console.log(`[DEBUG] Result preview data:`, previews.map(p => ({ order: p.order, text: p.contentData?.substring(0, 30) + '...' })));

      const { error: previewError } = await client
        .from("ResultPreview")
        .insert(previews);

      if (previewError) {
        console.error(`[DEBUG] Failed to insert result previews:`, previewError);
        throw new Error(`Failed to insert result previews: ${previewError.message}`);
      }

      console.log(`[DEBUG] Successfully inserted ${previews.length} result previews`);
    } else {
      console.warn(`[WARNING] No result previews to insert for content ${contentId}`);
    }

    // Summary log
    console.log(`\n[SUMMARY] Content ${contentId} saved successfully:`);
    console.log(`  ✓ Content: ${contentPackage.content.title}`);
    console.log(`  ✓ Categories: ${contentPackage.categories.length} (${contentPackage.categories.join(', ')})`);
    console.log(`  ✓ AI Tools: ${contentPackage.aiTools.length} (${contentPackage.aiTools.join(', ')})`);
    console.log(`  ✓ Tags: ${contentPackage.tags.length} (${contentPackage.tags.slice(0, 3).join(', ')}...)`);
    console.log(`  ✓ Estimated Time: ${contentPackage.estimatedTime ? 'Yes' : 'No'}`);
    console.log(`  ✓ Result Previews: ${contentPackage.resultPreviews?.length || 0}`);

    return { contentId, success: true };
    
  } catch (error) {
    throw new Error(`Failed to save content package: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// List content with filters
export async function listContent(
  limit: number = 20,
  offset: number = 0,
  filters?: {
    category?: string;
    difficulty?: Difficulty;
    language?: Language;
  }
) {
  const client = getSupabaseClient();
  
  let query = client
    .from("Content")
    .select(`
      *,
      categories:ContentCategory(
        category:Category(name)
      ),
      aiTools:ContentAITool(
        aiTool:AITool(name)
      ),
      tags:ContentTag(
        tag:Tag(name)
      ),
      estimatedTime:EstimatedTime(*)
    `)
    .order("createdAt", { ascending: false })
    .range(offset, offset + limit - 1);
  
  if (filters?.difficulty) {
    query = query.eq("difficulty", filters.difficulty);
  }
  
  if (filters?.language) {
    query = query.eq("language", filters.language);
  }
  
  const { data, error, count } = await query;
  
  if (error) {
    throw new Error(`Failed to list content: ${error.message}`);
  }
  
  // Filter by category if specified (done in application layer since it's a join)
  let filteredData = data;
  if (filters?.category && data) {
    filteredData = data.filter(item => 
      item.categories?.some((cat: any) => cat.category?.name === filters.category)
    );
  }
  
  return {
    data: filteredData,
    total: count || 0,
    offset,
    limit,
    has_more: (count || 0) > offset + limit
  };
}
