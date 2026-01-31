// services/search.ts - Search service for YouTube and Google

import axios from "axios";

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source: "youtube" | "google";
}

// Search YouTube videos
export async function searchYouTube(query: string, maxResults: number = 5): Promise<SearchResult[]> {
  const youtubeApiKey = process.env.YOUTUBE_API_KEY;
  
  if (!youtubeApiKey) {
    throw new Error("YOUTUBE_API_KEY environment variable is required for YouTube search");
  }
  
  try {
    const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
      params: {
        part: "snippet",
        q: query,
        type: "video",
        maxResults: maxResults,
        key: youtubeApiKey,
        relevanceLanguage: "ko",
        regionCode: "KR",
        safeSearch: "none"
      },
      timeout: 10000
    });
    
    return response.data.items.map((item: any) => ({
      title: item.snippet.title,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      snippet: item.snippet.description,
      source: "youtube" as const
    }));
    
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`YouTube API error: ${error.response?.data?.error?.message || error.message}`);
    }
    throw error;
  }
}

// Search Google for blog posts and articles
export async function searchGoogle(query: string, maxResults: number = 5): Promise<SearchResult[]> {
  const googleApiKey = process.env.GOOGLE_API_KEY;
  const googleCseId = process.env.GOOGLE_CSE_ID;
  
  if (!googleApiKey || !googleCseId) {
    throw new Error("GOOGLE_API_KEY and GOOGLE_CSE_ID environment variables are required for Google search");
  }
  
  try {
    const response = await axios.get("https://www.googleapis.com/customsearch/v1", {
      params: {
        key: googleApiKey,
        cx: googleCseId,
        q: query,
        num: maxResults,
        lr: "lang_ko", // Korean content only
        hl: "ko", // Interface language Korean
        gl: "kr", // Results from Korea
        dateRestrict: "y1" // Content from last year
      },
      timeout: 10000
    });
    
    if (!response.data.items) {
      return [];
    }
    
    return response.data.items.map((item: any) => ({
      title: item.title,
      url: item.link,
      snippet: item.snippet,
      source: "google" as const
    }));
    
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Google API error: ${error.response?.data?.error?.message || error.message}`);
    }
    throw error;
  }
}

// Combined search function
export async function searchContent(
  query: string,
  source: "youtube" | "google" | "both",
  limit: number = 5
): Promise<SearchResult[]> {
  const results: SearchResult[] = [];
  
  if (source === "youtube" || source === "both") {
    try {
      const youtubeResults = await searchYouTube(query, source === "both" ? Math.ceil(limit / 2) : limit);
      results.push(...youtubeResults);
    } catch (error) {
      console.error("YouTube search failed:", error);
      // Continue with other sources even if YouTube fails
    }
  }
  
  if (source === "google" || source === "both") {
    try {
      const googleResults = await searchGoogle(query, source === "both" ? Math.ceil(limit / 2) : limit);
      results.push(...googleResults);
    } catch (error) {
      console.error("Google search failed:", error);
      // Continue even if Google search fails
    }
  }
  
  return results.slice(0, limit);
}
