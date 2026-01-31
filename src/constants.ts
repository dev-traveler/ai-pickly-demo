// constants.ts - Shared constants

export const JINA_READER_URL = "https://r.jina.ai";

// Official 4 categories as per PRD
export const OFFICIAL_CATEGORIES = [
  "text",   // 텍스트 생성, 글쓰기, 문서 작성 관련
  "image",  // 이미지 생성, 디자인, 시각 콘텐츠 관련
  "video",  // 영상 생성, 편집, 동영상 콘텐츠 관련
  "code"    // 프로그래밍, 코딩, 개발 관련
] as const;

// AI Tools - lowercase without spaces as per PRD
export const AI_TOOLS_COMMON = [
  "chatgpt",
  "claude",
  "gemini",
  "cursor",
  "githubcopilot",
  "midjourney",
  "dalle",
  "stablediffusion",
  "runway",
  "elevenlabs",
  "perplexity",
  "notebooklm",
  "v0",
  "bolt",
  "lovable",
  "replit",
  "windsurf",
  "gpt4o",
  "claudeai",
  "perplexitylabs"
] as const;

// AI Tool Display Names - Map from lowercase slug to proper brand name
export const AI_TOOL_DISPLAY_NAMES: Record<string, string> = {
  "chatgpt": "ChatGPT",
  "claude": "Claude",
  "claudeai": "Claude AI",
  "gemini": "Gemini",
  "cursor": "Cursor",
  "githubcopilot": "GitHub Copilot",
  "midjourney": "Midjourney",
  "dalle": "DALL-E",
  "stablediffusion": "Stable Diffusion",
  "runway": "Runway",
  "elevenlabs": "ElevenLabs",
  "perplexity": "Perplexity",
  "perplexitylabs": "Perplexity Labs",
  "notebooklm": "NotebookLM",
  "v0": "v0",
  "bolt": "Bolt",
  "lovable": "Lovable",
  "replit": "Replit",
  "windsurf": "Windsurf",
  "gpt4o": "GPT-4o",
  "gpt4": "GPT-4",
  "gpt3": "GPT-3",
  "copilot": "Copilot",
  "canva": "Canva",
  "figma": "Figma",
  "notion": "Notion",
  "obsidian": "Obsidian",
  "grammarly": "Grammarly",
  "jasper": "Jasper",
  "writesonic": "Writesonic",
  "copy": "Copy.ai",
  "copyai": "Copy.ai",
  "synthesia": "Synthesia",
  "descript": "Descript",
  "pictory": "Pictory",
  "heygen": "HeyGen",
  "invideo": "InVideo",
  "luma": "Luma",
  "pika": "Pika",
  "sora": "Sora",
  "kling": "Kling",
  "veo": "Veo",
  "firefly": "Firefly",
  "leonardo": "Leonardo.ai",
  "ideogram": "Ideogram",
  "flux": "Flux",
  "craiyon": "Craiyon",
  "nightcafe": "NightCafe",
  "artbreeder": "Artbreeder",
  "starryai": "StarryAI",
  "deepai": "DeepAI",
  "huggingface": "Hugging Face",
  "cohere": "Cohere",
  "anthropic": "Anthropic",
  "openai": "OpenAI",
  "google": "Google",
  "meta": "Meta",
  "microsoft": "Microsoft",
  "amazon": "Amazon",
  "aws": "AWS",
  "azure": "Azure",
  "github": "GitHub",
  "gitlab": "GitLab",
  "vercel": "Vercel",
  "netlify": "Netlify",
  "supabase": "Supabase",
  "firebase": "Firebase",
  "mongodb": "MongoDB",
  "postgres": "PostgreSQL",
  "mysql": "MySQL",
  "redis": "Redis",
  "docker": "Docker",
  "kubernetes": "Kubernetes",
  "terraform": "Terraform",
  "ansible": "Ansible",
  "jenkins": "Jenkins",
  "circleci": "CircleCI",
  "travis": "Travis CI",
  "codepen": "CodePen",
  "codesandbox": "CodeSandbox",
  "stackblitz": "StackBlitz",
  "gitpod": "Gitpod",
  "codeium": "Codeium",
  "tabnine": "Tabnine",
  "kite": "Kite",
  "amazon q": "Amazon Q",
  "amazonq": "Amazon Q",
  "bard": "Bard",
  "bing": "Bing",
  "copilotx": "CopilotX",
  "duet": "Duet AI",
  "cody": "Cody",
  "sourcegraph": "Sourcegraph",
  "blackbox": "Blackbox AI",
  "phind": "Phind",
  "pieces": "Pieces",
  "aider": "Aider",
  "continue": "Continue",
  "gptpilot": "GPT Pilot"
};

// AI Tool logo URLs (fallback if we can't find from web) - lowercase keys as per PRD
export const AI_TOOL_LOGOS: Record<string, string> = {
  "chatgpt": "https://cdn.openai.com/chat-gpt/icon.png",
  "claude": "https://www.anthropic.com/images/icons/claude-icon.png",
  "claudeai": "https://www.anthropic.com/images/icons/claude-icon.png",
  "gemini": "https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg",
  "cursor": "https://cursor.sh/favicon.ico",
  "githubcopilot": "https://github.githubassets.com/images/modules/site/copilot/copilot.png",
  "midjourney": "https://cdn.midjourney.com/b07ba8e2-3b0f-4e3e-9b5f-9c5a5f5e5e5e/mj-logo.png",
  "dalle": "https://cdn.openai.com/dall-e/icon.png",
  "stablediffusion": "https://stability.ai/favicon.ico",
  "runway": "https://runwayml.com/favicon.ico",
  "elevenlabs": "https://elevenlabs.io/favicon.ico",
  "perplexity": "https://www.perplexity.ai/favicon.ico",
  "perplexitylabs": "https://www.perplexity.ai/favicon.ico",
  "notebooklm": "https://notebooklm.google.com/favicon.ico",
  "v0": "https://v0.dev/favicon.ico",
  "bolt": "https://bolt.new/favicon.ico",
  "lovable": "https://lovable.dev/favicon.ico",
  "replit": "https://replit.com/favicon.ico",
  "windsurf": "https://windsurf.ai/favicon.ico",
  "gpt4o": "https://cdn.openai.com/chat-gpt/icon.png",
  "amazonq": "https://aws.amazon.com/favicon.ico"
};

// Korean reading speed: approximately 400-450 characters per minute
export const KOREAN_CHARS_PER_MINUTE = 425;

// English reading speed: approximately 200-250 words per minute
export const ENGLISH_WORDS_PER_MINUTE = 225;

export const DEFAULT_PAGINATION_LIMIT = 20;
export const MAX_PAGINATION_LIMIT = 100;

export const YOUTUBE_OEMBED_URL = "https://www.youtube.com/oembed";

// Supabase Storage bucket names
export const STORAGE_BUCKET_THUMBNAILS = "contents_thumbnail";
export const STORAGE_BUCKET_AI_TOOL_LOGOS = "ai-tool-logos";
