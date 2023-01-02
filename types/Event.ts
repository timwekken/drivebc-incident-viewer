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
