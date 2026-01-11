import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 최신 이미지 포맷 자동 변환 (WebP, AVIF)
    formats: ["image/avif", "image/webp"],

    // 모바일 우선 디바이스 크기
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // 허용된 외부 이미지 도메인
    remotePatterns: [
      // Supabase Storage CDN (public & signed URLs)
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/sign/**",
      },

      // MVP 임시 이미지 (Unsplash)
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },

      // 외부 AI 도구 스크린샷 도메인
      {
        protocol: "https",
        hostname: "cdn.openai.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.midjourney.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
        pathname: "/attachments/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/vi/**",
      },

      // 소셜 미디어 CDN
      {
        protocol: "https",
        hostname: "*.cdninstagram.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "scontent-*.cdninstagram.com",
        pathname: "/**",
      },

      // Google 이미지 CDN
      {
        protocol: "https",
        hostname: "*.gstatic.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn*.gstatic.com",
        pathname: "/**",
      },

      // 한국 블로그 플랫폼 (외부 링크용)
      {
        protocol: "https",
        hostname: "*.tistory.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.kakaocdn.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.daumcdn.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.pstatic.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.spartaclub.kr",
        pathname: "/**",
      },
    ],

    // 이미지 캐시 기간 (7일)
    minimumCacheTTL: 60 * 60 * 24 * 7,
  },
};

export default nextConfig;
