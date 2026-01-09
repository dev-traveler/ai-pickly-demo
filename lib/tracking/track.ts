import { Mixpanel } from "@/lib/mixpanel";
import * as Events from "./events";
import type * as Types from "./types";
import { getFilterParams, getReferrer } from "./helpers";

// ============ 온보딩 이벤트 ============

export function trackOnboardingModalImpression() {
  Mixpanel.track(Events.ONBOARDING_EVENTS.MODAL_IMPRESSION);
}

export function trackOnboardingStepImpression(
  props: Types.OnboardingStepImpressionProps
) {
  Mixpanel.track(Events.ONBOARDING_EVENTS.STEP_IMPRESSION, props);
}

export function trackOnboardingNavigation(
  props: Types.OnboardingNavigationClickProps
) {
  Mixpanel.track(Events.ONBOARDING_EVENTS.NAVIGATION_CLICK, props);
}

export function trackOnboardingPaginationClick(
  props: Types.OnboardingPaginationClickProps
) {
  Mixpanel.track(Events.ONBOARDING_EVENTS.PAGINATION_CLICK, props);
}

export function trackOnboardingStartClick() {
  Mixpanel.track(Events.ONBOARDING_EVENTS.START_CLICK);
}

export function trackOnboardingClose(props: Types.OnboardingCloseClickProps) {
  Mixpanel.track(Events.ONBOARDING_EVENTS.CLOSE_CLICK, props);
}

// ============ 홈페이지 이벤트 ============

export function trackPageView() {
  Mixpanel.track(Events.HOME_EVENTS.PAGEVIEW, {
    referrer: getReferrer(),
  });
}

export function trackLogoClick(location: "header" | "footer") {
  const filterParams = getFilterParams();
  Mixpanel.track(Events.HOME_EVENTS.LOGO_CLICK, {
    ...filterParams,
    location,
  });
}

export function trackSearch(keyword: string) {
  const filterParams = getFilterParams();
  Mixpanel.track(Events.HOME_EVENTS.SEARCH, {
    ...filterParams,
    keyword,
  });
}

export function trackNewsletterHeaderClick() {
  Mixpanel.track(Events.HOME_EVENTS.NEWSLETTER_HEADER);
}

export function trackNewsletterBannerClick() {
  Mixpanel.track(Events.HOME_EVENTS.NEWSLETTER_BANNER);
}

// ============ 필터 이벤트 ============

export function trackCategoryClick(
  props: Omit<Types.CategoryClickProps, keyof Types.FilterParams>
) {
  const filterParams = getFilterParams();
  Mixpanel.track(Events.FILTER_EVENTS.CATEGORY_CLICK, {
    ...filterParams,
    ...props,
  });
}

export function trackFilterChipRemove(
  props: Omit<Types.FilterChipRemoveProps, keyof Types.FilterParams>
) {
  const filterParams = getFilterParams();
  Mixpanel.track(Events.FILTER_EVENTS.CHIP_REMOVE, {
    ...filterParams,
    ...props,
  });
}

export function trackFilterButtonClick() {
  Mixpanel.track(Events.FILTER_EVENTS.BUTTON_CLICK);
}

export function trackFilterSheetOpen(props: Types.FilterSheetOpenProps) {
  Mixpanel.track(Events.FILTER_EVENTS.SHEET_OPEN, props);
}

export function trackFilterOptionClick(
  props: Omit<Types.FilterOptionClickProps, keyof Types.FilterParams>
) {
  const filterParams = getFilterParams();
  Mixpanel.track(Events.FILTER_EVENTS.OPTION_CLICK, {
    ...filterParams,
    ...props,
  });
}

export function trackFilterReset() {
  const filterParams = getFilterParams();
  Mixpanel.track(Events.FILTER_EVENTS.RESET_CLICK, filterParams);
}

// ============ 콘텐츠 이벤트 ============

export function trackContentCardImpression(
  props: Types.ContentCardImpressionProps
) {
  Mixpanel.track(Events.CONTENT_EVENTS.CARD_IMPRESSION, props);
}

export function trackContentCardClick(props: Types.ContentCardClickProps) {
  Mixpanel.track(Events.CONTENT_EVENTS.CARD_CLICK, props);
}

// ============ 뉴스레터 모달 이벤트 ============

export function trackNewsletterModalOpen(props: Types.NewsletterModalOpenProps) {
  Mixpanel.track(Events.NEWSLETTER_EVENTS.MODAL_OPEN, props);
}

export function trackNewsletterEmailInput() {
  Mixpanel.track(Events.NEWSLETTER_EVENTS.EMAIL_INPUT);
}

export function trackNewsletterSubmitClick() {
  Mixpanel.track(Events.NEWSLETTER_EVENTS.SUBMIT_CLICK);
}

export function trackNewsletterSuccessImpression() {
  Mixpanel.track(Events.NEWSLETTER_EVENTS.SUCCESS_IMPRESSION);
}

export function trackNewsletterPolicyLinkClick(
  props: Types.NewsletterPolicyLinkClickProps
) {
  Mixpanel.track(Events.NEWSLETTER_EVENTS.POLICY_LINK_CLICK, props);
}

// ============ 푸터 이벤트 ============

export function trackFooterLogoClick() {
  const filterParams = getFilterParams();
  Mixpanel.track(Events.FOOTER_EVENTS.LOGO_CLICK, filterParams);
}

export function trackFooterLinkClick(props: Types.FooterLinkClickProps) {
  Mixpanel.track(Events.FOOTER_EVENTS.LINK_CLICK, props);
}
