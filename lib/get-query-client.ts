import {
  isServer,
  QueryClient,
  defaultShouldDehydrateQuery,
} from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1분 (기존 설정 유지)
        refetchOnWindowFocus: false,
      },
      dehydrate: {
        // pending query도 dehydrate하여 streaming 지원
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
        // Next.js가 서버 에러를 감지할 수 있도록 redact하지 않음
        shouldRedactErrors: () => false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (isServer) {
    // 서버: 요청마다 새로운 QueryClient 생성 (격리)
    return makeQueryClient();
  } else {
    // 브라우저: 싱글톤 패턴 사용
    // React suspend 시 재생성 방지
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}
