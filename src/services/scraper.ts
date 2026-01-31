// services/scraper.ts - Web scraping service using Jina.ai Reader and YouTube oEmbed

import axios from "axios";
import { JINA_READER_URL, YOUTUBE_OEMBED_URL } from "../constants.js";
import { ScrapedContent, YouTubeVideoData } from "../types/index.js";

// Check if URL is a YouTube video
function isYouTubeUrl(url: string): boolean {
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  return youtubeRegex.test(url);
}

// Extract YouTube video ID from URL
function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return match ? match[1] : null;
}


// Scrape YouTube video metadata using oEmbed
export async function scrapeYouTube(url: string): Promise<YouTubeVideoData> {
  const videoId = extractYouTubeId(url);
  if (!videoId) {
    throw new Error("Invalid YouTube URL");
  }
  
  try {
    // Use oEmbed for basic info
    const oEmbedResponse = await axios.get(YOUTUBE_OEMBED_URL, {
      params: {
        url,
        format: "json"
      },
      timeout: 10000
    });
    
    const oEmbedData = oEmbedResponse.data;
    
    // Use Jina Reader to get full page content including description
    const jinaUrl = `${JINA_READER_URL}/${url}`;
    const jinaResponse = await axios.get(jinaUrl, {
      headers: {
        "Accept": "application/json"
      },
      timeout: 30000 // Increased timeout to 30 seconds
    });
    
    const jinaData = jinaResponse.data;
    
    // Extract description from Jina content
    const content = jinaData.data?.content || "";
    const descriptionMatch = content.match(/Description[:\n]+([^\n]+(?:\n(?!Published|Views|Likes)[^\n]+)*)/i);
    const description = descriptionMatch ? descriptionMatch[1].trim() : "";
    
    // Extract published date
    const publishedMatch = content.match(/Published[:\s]+(.+?)(?:\n|$)/i);
    const publishedAt = publishedMatch ? publishedMatch[1].trim() : new Date().toISOString();
    
    // Extract duration if available
    const durationMatch = content.match(/Duration[:\s]+(\d+):(\d+)(?::(\d+))?/i);
    let duration = 0;
    if (durationMatch) {
      const hours = durationMatch[3] ? parseInt(durationMatch[1], 10) : 0;
      const minutes = durationMatch[3] ? parseInt(durationMatch[2], 10) : parseInt(durationMatch[1], 10);
      const seconds = durationMatch[3] ? parseInt(durationMatch[3], 10) : parseInt(durationMatch[2], 10);
      duration = hours * 3600 + minutes * 60 + seconds;
    }
    
    // Extract view count
    const viewMatch = content.match(/(\d[\d,]+)\s+views?/i);
    const viewCount = viewMatch ? parseInt(viewMatch[1].replace(/,/g, ''), 10) : 0;
    
    return {
      title: oEmbedData.title || jinaData.data?.title || "Untitled Video",
      description: description || oEmbedData.title || "",
      author: oEmbedData.author_name || "Unknown",
      publishedAt: publishedAt,
      thumbnailUrl: oEmbedData.thumbnail_url || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      duration: duration,
      viewCount: viewCount,
      url: url
    };
    
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to scrape YouTube video: ${error.message}`);
    }
    throw error;
  }
}

// Scrape blog/website content using Jina.ai Reader
export async function scrapeBlog(url: string): Promise<ScrapedContent> {
  try {
    const jinaUrl = `${JINA_READER_URL}/${url}`;
    const response = await axios.get(jinaUrl, {
      headers: {
        "Accept": "application/json"
      },
      timeout: 30000 // Increased timeout to 30 seconds
    });
    
    const data = response.data.data;
    
    if (!data || !data.content) {
      throw new Error("Failed to extract content from URL");
    }
    
    // Extract metadata from content
    const content = data.content;
    const title = data.title || "Untitled Article";
    
    // Try to extract author
    const authorMatch = content.match(/(?:By|Author)[:\s]+([^\n]+)/i);
    const author = authorMatch ? authorMatch[1].trim() : "Unknown";
    
    // Try to extract published date
    const dateMatch = content.match(/(?:Published|Posted|Date)[:\s]+([^\n]+)/i);
    const publishedAt = dateMatch ? dateMatch[1].trim() : new Date().toISOString();
    
    // Calculate word count (for Korean and English)
    const koreanChars = (content.match(/[가-힣]/g) || []).length;
    const englishWords = content.split(/\s+/).filter((word: string) => /[a-zA-Z]/.test(word)).length;
    const wordCount = koreanChars > 0 ? koreanChars : englishWords;
    
    // Try to extract description from first paragraph
    const paragraphs = content.split('\n\n').filter((p: string) => p.trim().length > 0);
    const description = paragraphs[0]?.substring(0, 300) || content.substring(0, 300);
    
    return {
      title,
      description,
      author,
      publishedAt,
      thumbnailUrl: data.image,
      content,
      url,
      wordCount
    };
    
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to scrape blog: ${error.message}`);
    }
    throw error;
  }
}

// Main scraper function that detects URL type
export async function scrapeUrl(url: string): Promise<ScrapedContent> {
  if (isYouTubeUrl(url)) {
    const youtubeData = await scrapeYouTube(url);
    return {
      title: youtubeData.title,
      description: youtubeData.description,
      author: youtubeData.author,
      publishedAt: youtubeData.publishedAt,
      thumbnailUrl: youtubeData.thumbnailUrl,
      content: youtubeData.description,
      url: youtubeData.url,
      duration: youtubeData.duration
    };
  } else {
    return await scrapeBlog(url);
  }
}
