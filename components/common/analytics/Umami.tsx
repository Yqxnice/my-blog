"use client";

import Script from "next/script";
import { siteConfig } from "@/lib/config";

const Umami = () => {
  const { baseUrl, websiteId } = siteConfig.analytics.umami || {};

  if (!baseUrl || !websiteId) {
    return null;
  }
  console.log("Umami", baseUrl, websiteId, "11111111111111");
  return (
    <Script
      src={`${baseUrl}/script.js`}
      strategy="afterInteractive"
      defer
      data-website-id={websiteId}
    />
  );
};

export default Umami;
