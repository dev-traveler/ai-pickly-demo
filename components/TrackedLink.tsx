"use client";

import Link from "next/link";
import mixpanel from "mixpanel-browser";

interface TrackedLinkProps {
  href: string;
  className?: string;
  pageName: string;
  objectSection: string;
  objectId: string;
  objectName: string;
  properties?: Record<string, string>;
  children: React.ReactNode;
}

export function TrackedLink({
  href,
  className,
  pageName,
  objectSection,
  objectId,
  objectName,
  properties,
  children,
}: TrackedLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => {
        mixpanel.track("click@link", {
          page_name: pageName,
          object_section: objectSection,
          object_id: objectId,
          object_name: objectName,
          ...properties,
        });
      }}
    >
      {children}
    </Link>
  );
}
