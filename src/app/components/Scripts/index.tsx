import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";

export default function Scripts() {
  return (
    <>
      <GoogleAnalytics gaId="G-N6K5BYL4RQ" />

      <Script id="yandex-init" strategy="beforeInteractive">
        {`window.yaContextCb = window.yaContextCb || []`}
      </Script>
      <Script
        src="https://yandex.ru/ads/system/context.js"
        strategy="afterInteractive"
      />

      <Script id="caramel-init" strategy="afterInteractive">
        {`
          const nnlJS = document.createElement('script');
          nnlJS.src = "https://ads.caramel.am/nnl.js?ts=" + new Date().getTime();
          nnlJS.async = true;
          document.head.appendChild(nnlJS);
        `}
      </Script>
    </>
  );
}
