// 온보딩 이벤트
export const ONBOARDING_EVENTS = {
  MODAL_IMPRESSION: "impression@onboarding_modal",
  STEP_IMPRESSION: "impression@onboarding_step",
  NAVIGATION_CLICK: "click@onboarding_navigation",
  PAGINATION_CLICK: "click@onboarding_pagination",
  START_CLICK: "click@onboarding_start",
  CLOSE_CLICK: "click@onboarding_close",
} as const;

// 홈페이지 이벤트
export const HOME_EVENTS = {
  PAGEVIEW: "pageview@home",
  LOGO_CLICK: "click@logo",
  SEARCH: "search@keyword",
  NEWSLETTER_HEADER: "click@newsletter_header",
  NEWSLETTER_BANNER: "click@newsletter_banner",
} as const;

// 필터 이벤트
export const FILTER_EVENTS = {
  CATEGORY_CLICK: "click@category_filter",
  CHIP_REMOVE: "click@filter_chip_remove",
  BUTTON_CLICK: "click@filter_button",
  SHEET_OPEN: "open@filter_sheet",
  OPTION_CLICK: "click@filter_option",
  RESET_CLICK: "click@filter_reset",
} as const;

// 콘텐츠 이벤트
export const CONTENT_EVENTS = {
  CARD_IMPRESSION: "impression@content_card",
  CARD_CLICK: "click@content_card",
} as const;

// 뉴스레터 모달 이벤트
export const NEWSLETTER_EVENTS = {
  MODAL_OPEN: "open@newsletter_modal",
  EMAIL_INPUT: "blur@newsletter_email",
  SUBMIT_CLICK: "click@newsletter_submit",
  SUCCESS_IMPRESSION: "impression@newsletter_success",
  POLICY_LINK_CLICK: "click@newsletter_policy_link",
} as const;

// 푸터 이벤트
export const FOOTER_EVENTS = {
  LOGO_CLICK: "click@footer_logo",
  LINK_CLICK: "click@footer_link",
} as const;
