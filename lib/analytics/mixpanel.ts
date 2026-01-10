"use client";

import mixpanel, { Dict } from "mixpanel-browser";

// Mixpanel 초기화 여부
let isInitialized = false;

/**
 * Mixpanel 초기화
 */
export function initMixpanel() {
  if (isInitialized) {
    console.log("[Mixpanel] Already initialized");
    return;
  }

  const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

  if (!token) {
    console.warn("[Mixpanel] ⚠️  Token not found. Analytics will be disabled.");
    console.warn("[Mixpanel] Please set NEXT_PUBLIC_MIXPANEL_TOKEN in .env.local");
    return;
  }

  try {
    mixpanel.init(token, {
      debug: process.env.NODE_ENV === "development",
      track_pageview: false, // 수동으로 pageview 추적
      persistence: "localStorage",
    });

    isInitialized = true;
    console.log("[Mixpanel] ✅ Initialized successfully");
    console.log("[Mixpanel] Debug mode:", process.env.NODE_ENV === "development");
  } catch (error) {
    console.error("[Mixpanel] ❌ Initialization failed:", error);
  }
}

/**
 * 공통 이벤트 속성 타입
 */
export interface BaseEventProperties {
  page_name?: string;
  object_section?: string;
  object_type?: string;
  object_id?: string;
  object_name?: string;
  object_position?: number;
  [key: string]: any;
}

/**
 * Pageview 이벤트
 */
export function trackPageview(pageName: string, properties?: Dict) {
  if (!isInitialized) {
    console.warn("[Mixpanel] Not initialized. Skipping pageview event.");
    return;
  }

  const eventName = `pageview@${pageName}`;
  const eventData = {
    page_name: pageName,
    ...properties,
  };

  console.log(`[Mixpanel] 📄 Tracking: ${eventName}`, eventData);
  mixpanel.track(eventName, eventData);
}

/**
 * Click 이벤트
 */
export function trackClick(
  objectType: string,
  properties: BaseEventProperties
) {
  if (!isInitialized) {
    console.warn("[Mixpanel] Not initialized. Skipping click event.");
    return;
  }

  const eventName = `click@${objectType}`;
  const eventData = {
    ...properties,
    object_type: objectType,
  };

  console.log(`[Mixpanel] 🖱️  Tracking: ${eventName}`, eventData);
  mixpanel.track(eventName, eventData);
}

/**
 * Impression 이벤트
 */
export function trackImpression(
  objectType: string,
  properties: BaseEventProperties
) {
  if (!isInitialized) {
    console.warn("[Mixpanel] Not initialized. Skipping impression event.");
    return;
  }

  const eventName = `impression@${objectType}`;
  const eventData = {
    ...properties,
    object_type: objectType,
  };

  console.log(`[Mixpanel] 👁️  Tracking: ${eventName}`, eventData);
  mixpanel.track(eventName, eventData);
}

/**
 * Hover 이벤트
 */
export function trackHover(
  objectType: string,
  properties: BaseEventProperties
) {
  if (!isInitialized) {
    console.warn("[Mixpanel] Not initialized. Skipping hover event.");
    return;
  }

  const eventName = `hover@${objectType}`;
  const eventData = {
    ...properties,
    object_type: objectType,
  };

  console.log(`[Mixpanel] 🔍 Tracking: ${eventName}`, eventData);
  mixpanel.track(eventName, eventData);
}

/**
 * Close 이벤트
 */
export function trackClose(
  objectType: string,
  properties: BaseEventProperties & { closed_by?: string }
) {
  if (!isInitialized) {
    console.warn("[Mixpanel] Not initialized. Skipping close event.");
    return;
  }

  const eventName = `close@${objectType}`;
  const eventData = {
    ...properties,
    object_type: objectType,
  };

  console.log(`[Mixpanel] ❌ Tracking: ${eventName}`, eventData);
  mixpanel.track(eventName, eventData);
}

/**
 * Search 이벤트
 */
export function trackSearch(
  objectType: string,
  properties: BaseEventProperties
) {
  if (!isInitialized) {
    console.warn("[Mixpanel] Not initialized. Skipping search event.");
    return;
  }

  const eventName = `search@${objectType}`;
  const eventData = {
    ...properties,
    object_type: objectType,
  };

  console.log(`[Mixpanel] 🔎 Tracking: ${eventName}`, eventData);
  mixpanel.track(eventName, eventData);
}

/**
 * Input 이벤트
 */
export function trackInput(
  objectType: string,
  properties: BaseEventProperties
) {
  if (!isInitialized) {
    console.warn("[Mixpanel] Not initialized. Skipping input event.");
    return;
  }

  const eventName = `input@${objectType}`;
  const eventData = {
    ...properties,
    object_type: objectType,
  };

  console.log(`[Mixpanel] ⌨️  Tracking: ${eventName}`, eventData);
  mixpanel.track(eventName, eventData);
}

/**
 * User Properties 설정
 */
export function setUserProperties(properties: Dict) {
  if (!isInitialized) return;

  mixpanel.people.set(properties);
}

/**
 * User ID 식별
 */
export function identifyUser(userId: string) {
  if (!isInitialized) return;

  mixpanel.identify(userId);
}

/**
 * 일반 이벤트 추적 (커스텀)
 */
export function trackEvent(eventName: string, properties?: Dict) {
  if (!isInitialized) return;

  mixpanel.track(eventName, properties);
}
