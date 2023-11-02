import { Dayjs } from "dayjs";

export interface Event {
  id: string;
  type: string;
  long: number;
  lat: number;
  name: string;
  time: Dayjs;
  description: string;
  severity: string;
  bbox?: number[];
  line?: string;
  scrollToListItem?: boolean;
  fromURL?: boolean;
}

export type DriveBCRawEvent = [
  string, // type_caps
  number, // lat
  number, // long
  string, // area
  string, // name
  string, // direction
  string, // type
  string, // severity
  string, // time
  string, // description
  string // eventCode
];
