import Head from "next/head";
import IncidentViewer from "../components/IncidentViewer";
import AboutBlurb from "../components/AboutBlurb";
import Link from "next/link";

export default function Dec24DemoViewer() {
  return (
    <>
      <Head>
        <title>
          EasyDriveBC - DriveBC Incident Viewer | Dec 24th 2022 Demo
        </title>
      </Head>
      <div className="h-full flex flex-col">
        <AboutBlurb>
          <p>
            These were all the DriveBC incidents on Christmas Eve 2022. Yikes!{" "}
            <Link href="/">Click here</Link> to see current advisories on this
            easy-to-use, mobile-friendly map.
          </p>
        </AboutBlurb>
        <div className="flex-1 overflow-hidden">
          <IncidentViewer showDemo />
        </div>
      </div>
    </>
  );
}
