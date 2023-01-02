import Head from "next/head";
import App from "../components/IncidentViewer";

export default function Viewer() {
  return (
    <>
      <Head>
        <title>DriveBC Incident Viewer - Dec 24th 2022 Demo</title>
      </Head>
      <App showDemo />
    </>
  );
}
