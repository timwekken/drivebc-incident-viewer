## EasyDriveBC (drivebc-incident-viewer)

### About

EasyDriveBC is a project that aims to enhance the accessibility of DriveBC’s alerts and warnings, providing a more user-friendly interface for quickly grasping the current road conditions and closures across BC. DriveBC serves as a platform offering information on various factors such as road closures and driving conditions. However, the current website's interface can be cumbersome and challenging to navigate at times. I encountered this issue notably last Christmas Eve (2022) when planning a trip from Vancouver to the Interior. To address this, I developed a more intuitive, mobile-friendly interface to offer a streamlined view of the ongoing travel conditions. 

The revamped app not only facilitates easier access to all alerts and warnings but also highlights the affected roads without the need to individually select each event. It maintains its data feed directly from DriveBC, ensuring real-time updates. Additional event details, typically accessible via individual clicks, are now retrieved and stored in a separate database for swift display.

This project is currently hosted at https://www.easydrivebc.ca.


### Running Locally

1. Setup a MongoDB database. Then set the following environment variables:
- `MONGODB_CONNECTION`
- `DB_NAME`

2. Create a Mapbox account and create two tokens, one for the main map and one for generating static map images used when sharing. Set the following environement variables:
- `NEXT_PUBLIC_APP_MAPBOX_TOKEN`
- `NEXT_PUBLIC_STATIC_APP_MAPBOX_TOKEN`

3. (Optional) If you want Sentry error tracking, ensure the `NEXT_PUBLIC_SENTRY_DSN` env variable is also set.

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

