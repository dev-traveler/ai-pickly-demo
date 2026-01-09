import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen bg-black text-white">
      <div className="container px-4 py-12 md:py-16 flex justify-center">
        <div className="flex flex-col gap-4">
          <p className="font-black text-6xl md:text-8xl tracking-[0.3em] text-white/60">
            404
          </p>
          <h1 className="text-2xl md:text-4xl font-bold">
            찾을 수 없는 페이지입니다
          </h1>
          <p className="text-white/70 max-w-2xl text-sm md:text-base">
            요청하신 주소가 변경되었거나 삭제되었습니다. AI Pickly의 다른
            콘텐츠는 홈에서 계속 탐색할 수 있어요.
          </p>
          <div className="flex flex-col md:flex-row gap-3 pt-2">
            <Button asChild className="bg-white text-black hover:bg-white/90">
              <Link href="/">홈으로 돌아가기</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
