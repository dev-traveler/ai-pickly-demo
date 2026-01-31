// tools/collector.ts - Main content collection tools

import {
  SearchAndCollectInput,
  ScrapeUrlInput,
  AnalyzeContentInput,
  SaveToSupabaseInput,
  ListContentInput
} from "../schemas/index.js";
import { ResponseFormat, ContentPackage } from "../types/index.js";
import { searchContent } from "../services/search.js";
import { scrapeUrl } from "../services/scraper.js";
import { analyzeContent } from "../services/analyzer.js";
import {
  checkDuplicateContent,
  saveContentToSupabase,
  listContent
} from "../services/supabase.js";

// Search and collect AI content automatically
export async function searchAndCollect(params: SearchAndCollectInput) {
  const results: any[] = [];
  const errors: string[] = [];
  
  try {
    // 1. Search for content
    const searchResults = await searchContent(params.query, params.source, params.limit);
    
    if (searchResults.length === 0) {
      return {
        content: [{
          type: "text" as const,
          text: `No results found for query: "${params.query}"`
        }]
      };
    }
    
    // 2. Process each search result
    for (const searchResult of searchResults) {
      try {
        // Check for duplicates
        const isDuplicate = await checkDuplicateContent(searchResult.url);
        
        if (isDuplicate) {
          errors.push(`Duplicate content skipped: ${searchResult.title}`);
          continue;
        }
        
        // Scrape content
        const scrapedContent = await scrapeUrl(searchResult.url);
        
        // Analyze content
        const analysis = await analyzeContent(
          scrapedContent.title,
          scrapedContent.content,
          scrapedContent.url,
          scrapedContent.duration,
          scrapedContent.wordCount
        );
        
        // Prepare content package
        const contentPackage: ContentPackage = {
          content: {
            id: "", // Will be generated in saveContentToSupabase
            title: scrapedContent.title,
            description: analysis.description,
            author: scrapedContent.author || "Unknown",
            sourceUrl: scrapedContent.url,
            publishedAt: scrapedContent.publishedAt || new Date().toISOString(),
            language: analysis.language,
            thumbnailUrl: scrapedContent.thumbnailUrl,
            difficulty: analysis.difficulty,
            viewCount: 0,
            scrapCount: 0,
            updatedAt: new Date().toISOString()
          },
          categories: [analysis.category],
          aiTools: analysis.aiTools,
          tags: analysis.tags,
          estimatedTime: analysis.estimatedTime ? {
            id: "", // Will be generated
            contentId: "", // Will be set
            type: analysis.estimatedTime.type,
            value: analysis.estimatedTime.value,
            displayMinutes: analysis.estimatedTime.value
          } : undefined,
          resultPreviews: analysis.resultPreviews?.map((preview, index) => ({
            id: "", // Will be generated
            contentId: "", // Will be set
            order: index,
            type: preview.type,
            contentData: preview.contentData
          }))
        };
        
        // Save to Supabase if auto_save is enabled
        let savedId: string | undefined;
        if (params.auto_save) {
          const saveResult = await saveContentToSupabase(contentPackage);
          savedId = saveResult.contentId;
        }
        
        results.push({
          title: scrapedContent.title,
          url: scrapedContent.url,
          category: analysis.category,
          difficulty: analysis.difficulty,
          aiTools: analysis.aiTools,
          tags: analysis.tags,
          saved: params.auto_save,
          contentId: savedId
        });
        
      } catch (error) {
        errors.push(`Failed to process ${searchResult.title}: ${error instanceof Error ? error.message : String(error)}`);
        console.error(`Error processing ${searchResult.url}:`, error);
      }
    }
    
    // Format response
    if (params.response_format === ResponseFormat.JSON) {
      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            query: params.query,
            total_found: searchResults.length,
            successfully_processed: results.length,
            results: results,
            errors: errors.length > 0 ? errors : undefined
          }, null, 2)
        }]
      };
    } else {
      let markdown = `# Content Collection Results\n\n`;
      markdown += `**Query:** ${params.query}\n`;
      markdown += `**Source:** ${params.source}\n`;
      markdown += `**Found:** ${searchResults.length} items\n`;
      markdown += `**Successfully Processed:** ${results.length} items\n`;
      markdown += `**Auto-saved to Database:** ${params.auto_save ? "Yes" : "No"}\n\n`;
      
      if (results.length > 0) {
        markdown += `## Collected Content\n\n`;
        results.forEach((result, index) => {
          markdown += `### ${index + 1}. ${result.title}\n\n`;
          markdown += `- **URL:** ${result.url}\n`;
          markdown += `- **Category:** ${result.category}\n`;
          markdown += `- **Difficulty:** ${result.difficulty}\n`;
          markdown += `- **AI Tools:** ${result.aiTools.join(", ") || "None"}\n`;
          markdown += `- **Tags:** ${result.tags.join(", ")}\n`;
          if (result.saved && result.contentId) {
            markdown += `- **Saved:** ✅ (ID: ${result.contentId})\n`;
          }
          markdown += `\n`;
        });
      }
      
      if (errors.length > 0) {
        markdown += `## Errors\n\n`;
        errors.forEach(error => {
          markdown += `- ${error}\n`;
        });
      }
      
      return {
        content: [{
          type: "text" as const,
          text: markdown
        }]
      };
    }
    
  } catch (error) {
    return {
      isError: true,
      content: [{
        type: "text" as const,
        text: `Error in search and collect: ${error instanceof Error ? error.message : String(error)}`
      }]
    };
  }
}

// Scrape a single URL
export async function scrapeSingleUrl(params: ScrapeUrlInput) {
  try {
    const scrapedContent = await scrapeUrl(params.url);
    
    if (params.response_format === ResponseFormat.JSON) {
      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify(scrapedContent, null, 2)
        }]
      };
    } else {
      let markdown = `# Scraped Content\n\n`;
      markdown += `**Title:** ${scrapedContent.title}\n`;
      markdown += `**URL:** ${scrapedContent.url}\n`;
      markdown += `**Author:** ${scrapedContent.author || "Unknown"}\n`;
      markdown += `**Published:** ${scrapedContent.publishedAt || "Unknown"}\n`;
      
      if (scrapedContent.duration) {
        markdown += `**Duration:** ${Math.floor(scrapedContent.duration / 60)}:${(scrapedContent.duration % 60).toString().padStart(2, '0')}\n`;
      }
      
      if (scrapedContent.wordCount) {
        markdown += `**Word Count:** ${scrapedContent.wordCount}\n`;
      }
      
      markdown += `\n## Content Preview\n\n`;
      markdown += scrapedContent.content.substring(0, 500) + "...\n";
      
      return {
        content: [{
          type: "text" as const,
          text: markdown
        }]
      };
    }
    
  } catch (error) {
    return {
      isError: true,
      content: [{
        type: "text" as const,
        text: `Error scraping URL: ${error instanceof Error ? error.message : String(error)}`
      }]
    };
  }
}

// Analyze content with AI
export async function analyzeWithAI(params: AnalyzeContentInput) {
  try {
    const analysis = await analyzeContent(params.title, params.content, params.url);
    
    if (params.response_format === ResponseFormat.JSON) {
      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify(analysis, null, 2)
        }]
      };
    } else {
      let markdown = `# AI Analysis Results\n\n`;
      markdown += `**Title:** ${params.title}\n`;
      markdown += `**Category:** ${analysis.category}\n`;
      markdown += `**Difficulty:** ${analysis.difficulty}\n`;
      markdown += `**Language:** ${analysis.language}\n\n`;
      
      markdown += `## Description\n${analysis.description}\n\n`;
      
      if (analysis.aiTools.length > 0) {
        markdown += `## AI Tools\n${analysis.aiTools.map(tool => `- ${tool}`).join('\n')}\n\n`;
      }
      
      if (analysis.tags.length > 0) {
        markdown += `## Tags\n${analysis.tags.join(', ')}\n\n`;
      }
      
      if (analysis.estimatedTime) {
        markdown += `## Estimated Time\n${analysis.estimatedTime.value} minutes (${analysis.estimatedTime.type})\n`;
      }
      
      return {
        content: [{
          type: "text" as const,
          text: markdown
        }]
      };
    }
    
  } catch (error) {
    return {
      isError: true,
      content: [{
        type: "text" as const,
        text: `Error analyzing content: ${error instanceof Error ? error.message : String(error)}`
      }]
    };
  }
}

// Save content to Supabase
export async function saveContent(params: SaveToSupabaseInput) {
  try {
    // Check for duplicates
    const isDuplicate = await checkDuplicateContent(params.content_data.sourceUrl);
    
    if (isDuplicate) {
      return {
        isError: true,
        content: [{
          type: "text" as const,
          text: `Content already exists in database: ${params.content_data.sourceUrl}`
        }]
      };
    }
    
    // Prepare content package
    const contentPackage: ContentPackage = {
      content: {
        id: "", // Will be generated
        ...params.content_data,
        updatedAt: new Date().toISOString()
      },
      categories: params.categories,
      aiTools: params.ai_tools,
      tags: params.tags,
      estimatedTime: params.estimated_time ? {
        id: "", // Will be generated
        contentId: "", // Will be set
        ...params.estimated_time,
        displayMinutes: params.estimated_time.value
      } : undefined,
      resultPreviews: params.result_previews?.map(preview => ({
        id: "", // Will be generated
        contentId: "", // Will be set
        ...preview
      }))
    };
    
    const result = await saveContentToSupabase(contentPackage);
    
    if (params.response_format === ResponseFormat.JSON) {
      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            success: true,
            contentId: result.contentId,
            message: "Content saved successfully"
          }, null, 2)
        }]
      };
    } else {
      return {
        content: [{
          type: "text" as const,
          text: `✅ Content saved successfully!\n\n**Content ID:** ${result.contentId}\n**Title:** ${params.content_data.title}`
        }]
      };
    }
    
  } catch (error) {
    return {
      isError: true,
      content: [{
        type: "text" as const,
        text: `Error saving content: ${error instanceof Error ? error.message : String(error)}`
      }]
    };
  }
}

// List content from database
export async function listContentFromDB(params: ListContentInput) {
  try {
    const result = await listContent(
      params.limit,
      params.offset,
      {
        category: params.category,
        difficulty: params.difficulty,
        language: params.language
      }
    );
    
    if (params.response_format === ResponseFormat.JSON) {
      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            total: result.total,
            offset: result.offset,
            limit: result.limit,
            has_more: result.has_more,
            items: result.data
          }, null, 2)
        }]
      };
    } else {
      let markdown = `# Content Database\n\n`;
      markdown += `**Total Items:** ${result.total}\n`;
      markdown += `**Showing:** ${result.offset + 1} - ${Math.min(result.offset + result.limit, result.total)}\n`;
      markdown += `**Has More:** ${result.has_more ? "Yes" : "No"}\n\n`;
      
      if (result.data && result.data.length > 0) {
        result.data.forEach((item: any, index: number) => {
          markdown += `## ${result.offset + index + 1}. ${item.title}\n\n`;
          markdown += `- **ID:** ${item.id}\n`;
          markdown += `- **URL:** ${item.sourceUrl}\n`;
          markdown += `- **Author:** ${item.author}\n`;
          markdown += `- **Difficulty:** ${item.difficulty}\n`;
          markdown += `- **Language:** ${item.language}\n`;
          
          const categories = item.categories?.map((c: any) => c.category?.name).filter(Boolean).join(", ");
          if (categories) {
            markdown += `- **Categories:** ${categories}\n`;
          }
          
          const tools = item.aiTools?.map((t: any) => t.aiTool?.name).filter(Boolean).join(", ");
          if (tools) {
            markdown += `- **AI Tools:** ${tools}\n`;
          }
          
          markdown += `\n`;
        });
      } else {
        markdown += `No content found.\n`;
      }
      
      return {
        content: [{
          type: "text" as const,
          text: markdown
        }]
      };
    }
    
  } catch (error) {
    return {
      isError: true,
      content: [{
        type: "text" as const,
        text: `Error listing content: ${error instanceof Error ? error.message : String(error)}`
      }]
    };
  }
}
