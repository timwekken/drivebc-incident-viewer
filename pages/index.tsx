import Head from "next/head";
import IncidentViewer from "../components/IncidentViewer";
import Link from "next/link";

export default function Viewer() {
  return (
    <>
      <Head>
        <title>EasyDriveBC - DriveBC Incident Viewer</title>
      </Head>
      <IncidentViewer
        aboutBlurb={
          <p>
            Do you find it a challenge to navigate DriveBC&apos;s website?
            Understanding incidents on routes relevant to me has always been a
            struggle, which inspired this new app! I hit my limit on{" "}
            <Link href="/dec24demo">Christmas Eve 2022</Link>, when I was
            planning my drive from Vancouver to the Interior. Identify travel
            advisories on this easy-to-use, mobile-friendly map to get there
            safely. All data is live from DriveBC.{" "}
            <a href="mailto:timwekken@gmail.com">Contact me</a>
          </p>
        }
      />
    </>
  );
}
