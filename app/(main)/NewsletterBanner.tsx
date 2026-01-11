import { Button } from "@/components/ui/button";
import { SubscribeNewsletterDialog } from "@/app/(main)/SubscribeNewsletterDialog";

export function NewsletterBanner() {
  return (
    <div className="flex justify-center bg-black text-white p-8 md:p-12">
      <div className="container px-4 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* 텍스트 영역 */}
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold">
            AI로 일잘러가 되고 싶다면?
          </h2>
          <p className="text-gray-300 text-sm md:text-base">
            놓치면 안 되는 최신 AI 활용 콘텐츠, 이메일로 무료 배송!
          </p>
        </div>

        {/* CTA 버튼 */}
        <SubscribeNewsletterDialog
          triggerTracking={{
            event: "click@button",
            properties: {
              page_name: "home",
              object_section: "banner",
              object_id: "무료 AI 뉴스레터 배송받기",
              object_name: "무료 AI 뉴스레터 배송받기",
            },
          }}
          triggerComponent={
            <Button
              size="lg"
              className="bg-white text-black hover:bg-gray-100 font-semibold whitespace-nowrap"
            >
              무료 AI 뉴스레터 배송받기
            </Button>
          }
        />
      </div>
    </div>
  );
}
