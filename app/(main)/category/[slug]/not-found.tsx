import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CategoryNotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="container px-4 py-12 md:py-16 flex justify-center">
        <div className="flex flex-col gap-4 text-center">
          <p className="font-black text-6xl md:text-8xl tracking-[0.3em] text-muted-foreground">
            404
          </p>
          <h1 className="text-2xl md:text-4xl font-bold">
            존재하지 않는 카테고리입니다
          </h1>
          <p className="text-muted-foreground max-w-2xl text-sm md:text-base">
            요청하신 카테고리를 찾을 수 없습니다. 다른 카테고리를 선택해주세요.
          </p>
          <div className="flex flex-col md:flex-row gap-3 pt-2 justify-center">
            <Button asChild>
              <Link href="/search">콘텐츠 검색하기</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">홈으로 돌아가기</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
