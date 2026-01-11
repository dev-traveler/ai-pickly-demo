/**
 * 이미지 로딩 중 표시할 blur placeholder
 * 모든 썸네일에 공통 사용 (MVP)
 */
export const THUMBNAIL_BLUR_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10'%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='1'/%3E%3C/filter%3E%3Crect width='10' height='10' fill='%23f4f4f5' filter='url(%23b)'/%3E%3C/svg%3E";

/**
 * Next.js Image 컴포넌트에 최적화된 props 생성
 */
export function getOptimizedImageProps(options?: {
  priority?: boolean;
  sizes?: string;
  quality?: number;
}) {
  return {
    loading: options?.priority ? ("eager" as const) : ("lazy" as const),
    priority: options?.priority ?? false,
    sizes:
      options?.sizes ??
      "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    quality: options?.quality ?? 75,
    placeholder: "blur" as const,
    blurDataURL: THUMBNAIL_BLUR_PLACEHOLDER,
  };
}
