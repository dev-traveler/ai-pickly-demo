import { LinkableFullLogo } from "./LinkableFullLogo";
import { TrackedLink } from "../../../components/TrackedLink";

export function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-gray-400 border-t border-gray-800">
      {/* Main footer content */}
      <div className="container mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row justify-between">
          <LinkableFullLogo section="footer" />

          {/* 
          <div className="flex justify-between gap-16 text-xs text-gray-500">
            <div>
              <h3 className="text-white font-semibold mb-6 text-sm">서비스</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/"
                    className="hover:text-white transition-colors inline-block"
                  >
                    AI 콘텐츠 큐레이션
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="hover:text-white transition-colors inline-block"
                  >
                    뉴스레터
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-6 text-sm">정책</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/policy/privacy"
                    className="hover:text-white transition-colors inline-block"
                  >
                    개인정보처리방침
                  </Link>
                </li>
                <li>
                  <Link
                    href="/policy/marketing"
                    className="hover:text-white transition-colors inline-block"
                  >
                    광고성 정보수신
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-6 text-sm">
                지원 및 소개
              </h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/"
                    className="hover:text-white transition-colors inline-block"
                  >
                    헬프 센터
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="hover:text-white transition-colors inline-block"
                  >
                    서비스 피드백
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="hover:text-white transition-colors inline-block"
                  >
                    서비스 소개
                  </Link>
                </li>
                <li>
                  <Link
                    href="/newsletter/unsubscribe"
                    className="hover:text-white transition-colors inline-block"
                  >
                    구독 취소
                  </Link>
                </li>
              </ul>
            </div>
          </div> */}
        </div>
      </div>

      {/* Bottom section */}
      <div className="border-t border-gray-800/50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 text-xs text-gray-500">
            <div className="space-y-1.5">
              <p className="leading-relaxed">
                AI Pickly |{" "}
                <TrackedLink
                  href="/policy/privacy"
                  className="hover:text-gray-300 transition-colors"
                  pageName="home"
                  objectSection="footer"
                  objectId="개인정보처리방침"
                  objectName="개인정보처리방침"
                >
                  개인정보처리방침
                </TrackedLink>{" "}
                |{" "}
                <TrackedLink
                  href="/policy/marketing"
                  className="hover:text-gray-300 transition-colors"
                  pageName="home"
                  objectSection="footer"
                  objectId="광고성 정보수신"
                  objectName="광고성 정보수신"
                >
                  광고성 정보수신
                </TrackedLink>{" "}
                |{" "}
                <TrackedLink
                  href="https://docs.google.com/forms/d/e/1FAIpQLSc1HVgUEMl4qME6rjHPgYQhDkXmQyTBAs9t4I-hgVF9QUmedA/viewform"
                  className="hover:text-gray-300 transition-colors"
                  pageName="home"
                  objectSection="footer"
                  objectId="문의하기"
                  objectName="문의하기"
                >
                  문의하기
                </TrackedLink>
              </p>
              <p className="leading-relaxed">
                서울특별시 동작구 노량진로 10 스페이스살림 2층
              </p>
            </div>
            <div className="md:text-right">
              <p>© 2026 AI Pickly. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
