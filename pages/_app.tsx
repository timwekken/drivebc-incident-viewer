import type { AppProps } from "next/app";
import Head from "next/head";
import * as Sentry from "@sentry/nextjs";
import { Analytics } from "@vercel/analytics/react";
import "../styles/globals.css";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.2,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
