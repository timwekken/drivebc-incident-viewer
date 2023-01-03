import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          name="description"
          content="Do you find it a challenge to navigate DriveBC's website?
            Understanding incidents on routes relevant to me has always been a
            struggle, which inspired this new app! Identify travel
            advisories on this easy-to-use, mobile-friendly map to get there
            safely."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          property="og:title"
          content="EasyDriveBC - DriveBC Incident Viewer"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:description"
          content="Do you find it a challenge to navigate DriveBC's website?
            Understanding incidents on routes relevant to me has always been a
            struggle, which inspired this new app! Identify travel
            advisories on this easy-to-use, mobile-friendly map to get there
            safely."
        />
        <meta
          property="og:image"
          content={`https://api.mapbox.com/styles/v1/mapbox/navigation-day-v1/static/pin-l+f74e4e(-124.4,53)/-124.4,54.6,4.35,0,0/600x600?access_token=${process.env.NEXT_PUBLIC_STATIC_APP_MAPBOX_TOKEN}`}
        />
        <meta property="og:url" content="https://www.easydrivebc.ca" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@wekkent" />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.css"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
