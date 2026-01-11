import { PageViewTracker } from "@/components/PageViewTracker";
import { UnsubscribeForm } from "./unsubscribe-form";

export default function UnsubscribePage() {
  return (
    <>
      <div>
        {/* Header section - NewsletterBanner와 유사한 높이 유지 */}
        <div className="flex justify-center bg-black text-white p-8 md:p-12">
          <div className="container px-4 flex flex-col gap-2">
            <h1 className="text-2xl md:text-3xl font-bold">
              뉴스레터 구독 취소
            </h1>
            <p className="text-gray-300 text-sm md:text-base">
              더 이상 뉴스레터를 받고 싶지 않으신가요? 언제든지 다시 구독하실 수
              있습니다.
            </p>
          </div>
        </div>

        {/* Main content - Home 페이지와 동일한 container 구조 */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">
                이메일 주소를 입력해주세요
              </h2>
              <p className="text-sm text-gray-600">
                구독을 취소하실 이메일 주소를 입력해주시면 더 이상 뉴스레터를
                보내드리지 않습니다.
              </p>
            </div>

            <UnsubscribeForm />

            <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600 space-y-2">
              <p className="font-semibold">안내사항</p>
              <ul className="list-disc list-inside space-y-1">
                <li>구독 취소 처리는 즉시 완료됩니다.</li>
                <li>
                  이미 발송된 이메일은 받으실 수 있으며, 다음 발송부터
                  제외됩니다.
                </li>
                <li>언제든지 다시 구독하실 수 있습니다.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <PageViewTracker pageName="policy_privacy" />
    </>
  );
}
