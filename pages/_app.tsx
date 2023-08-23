import type { AppProps } from "next/app";
import * as Sentry from "@sentry/nextjs";
import { Analytics } from '@vercel/analytics/react';
import "../styles/globals.css";

Sentry.init({
  dsn: "https://fc43c5539aec4aae82044146938e102f@o4504442286243840.ingest.sentry.io/4504442287030272",
  tracesSampleRate: 0.2,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
