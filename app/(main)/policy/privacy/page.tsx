export default async function PrivacyPage() {
  return (
    <div>
      {/* Header section - NewsletterBanner와 유사한 높이 유지 */}
      <div className="bg-black text-white p-8">
        <div className="container mx-auto px-4 max-w-3xl flex flex-col gap-2">
          <h1 className="text-2xl md:text-3xl font-bold">개인정보처리방침</h1>
          <p className="text-gray-300 text-sm md:text-base">
            AI Pickly의 개인정보 수집 및 이용에 관한 안내
          </p>
        </div>
      </div>

      {/* Main content - Home 페이지와 동일한 container 구조 */}
      <div className="container mx-auto px-8 md:px-4 py-16 md:py-32 max-w-3xl">
        <div className="space-y-8">
          {/* 서론 */}
          <section className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              미디어 사이트 AI Pickly(이하 &quot;에이아이 피클리&quot;)는 AI
              콘텐츠 뉴스레터 서비스 이용 시 이용자로부터 아래와 같은 개인
              정보를 수집하고 있습니다.
            </p>
          </section>

          {/* 수집 정보 */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">수집하는 개인정보</h2>
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">수집 항목</h3>
                <p className="text-gray-700">이메일 주소</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  수집 및 이용 목적
                </h3>
                <p className="text-gray-700">
                  AI 콘텐츠 뉴스레터 및 서비스 관련 정보 제공
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  보유 및 이용 기간
                </h3>
                <p className="text-gray-700">
                  AI 콘텐츠 뉴스레터 구독 해지 시까지
                </p>
              </div>
            </div>
          </section>

          {/* 이용자 권리 */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">이용자의 권리</h2>
            <div className="border-l-4 border-black pl-4 space-y-3">
              <p className="text-gray-700 leading-relaxed">
                이용자는 본 개인정보 수집·이용 동의서에 따른 동의 시,
                &apos;필요한 최소한의 정보 외에 개인정보&apos; 수집·이용에
                동의하지 않을 권리가 있습니다.
              </p>
              <p className="text-gray-700 leading-relaxed">
                동의를 거부할 경우 AI 콘텐츠 뉴스레터 구독이 제한될 수
                있습니다.
              </p>
            </div>
          </section>

          {/* 문의 안내 */}
          <section className="bg-gray-50 p-6 rounded-lg">
            <p className="text-sm text-gray-600">
              개인정보처리방침에 대한 문의사항이 있으시면 언제든지 연락
              주시기 바랍니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
