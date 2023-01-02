import Head from "next/head";
import App from "../components/IncidentViewer";

export default function Viewer() {
  return (
    <>
      <Head>
        <title>DriveBC Incident Viewer</title>
      </Head>
      <App />
    </>
  );
}
