import mixpanel from 'mixpanel-browser';

// 믹스패널 초기화
const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

if (token) {
  mixpanel.init(token, {
    debug: process.env.NODE_ENV === 'development',
    track_pageview: true,
    persistence: 'localStorage',
  });
}

// 믹스패널 헬퍼 함수들
export const Mixpanel = {
  // 이벤트 추적
  track: (eventName: string, properties?: Record<string, any>) => {
    if (token) {
      mixpanel.track(eventName, properties);
    }
  },

  // 사용자 식별
  identify: (userId: string) => {
    if (token) {
      mixpanel.identify(userId);
    }
  },

  // 사용자 속성 설정
  people: {
    set: (properties: Record<string, any>) => {
      if (token) {
        mixpanel.people.set(properties);
      }
    },
  },

  // 페이지뷰 추적
  trackPageView: (pageName: string) => {
    if (token) {
      mixpanel.track('Page View', { page: pageName });
    }
  },

  // 초기화 여부 확인
  isInitialized: () => !!token,
};

export default Mixpanel;