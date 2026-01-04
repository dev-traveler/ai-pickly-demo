export default async function MarketingPage() {
  return (
    <div>
      {/* Header section - NewsletterBanner와 유사한 높이 유지 */}
      <div className="flex justify-center bg-black text-white p-8 md:p-12">
        <div className="container px-4 flex flex-col gap-2">
          <h1 className="text-2xl md:text-3xl font-bold">광고성 정보 수신</h1>
          <p className="text-gray-300 text-sm md:text-base">
            AI Pickly 뉴스레터의 광고성 정보 수신에 관한 안내
          </p>
        </div>
      </div>

      {/* Main content - Home 페이지와 동일한 container 구조 */}
      <div className="container mx-auto px-4 py-16 md:py-32">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* 서론 */}
          <section className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              미디어 사이트 AI Pickly(이하 &quot;에이아이 피클리&quot;)는 AI
              콘텐츠 뉴스레터 발송 시 서비스 소식, 이벤트, 프로모션 등 광고성
              정보를 포함할 수 있습니다.
            </p>
          </section>

          {/* 광고 표기 */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">광고 표기</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700">
                광고성 정보가 포함된 AI 콘텐츠 뉴스레터에는 제목에{" "}
                <strong>(광고)</strong>라고 표기하여 발송합니다.
              </p>
            </div>
          </section>

          {/* 수신 동의 및 거부 */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">수신 동의 및 거부</h2>
            <div className="border-l-4 border-black pl-4 space-y-3">
              <p className="text-gray-700 leading-relaxed">
                만약 광고성 정보 수신 동의를 하지 않을 경우 AI 콘텐츠 뉴스레터
                서비스 이용이 제한될 수 있습니다.
              </p>
              <p className="text-gray-700 leading-relaxed">
                더불어 AI 콘텐츠 뉴스레터 구독 중 광고성 정보 수신이 불편한
                경우, AI 콘텐츠 뉴스레터 하단의 &apos;수신거부&apos; 버튼을 눌러
                서비스 이용을 취소할 수 있습니다.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
