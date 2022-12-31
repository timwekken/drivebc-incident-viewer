import { Dayjs } from "dayjs";

export interface MajorEvent {
  id: string;
  long: number;
  lat: number;
  name: string;
  time: Dayjs;
  description: string;
  bbox?: number[];
  line?: string;
  scrollToListItem?: boolean;
  fromURL?: boolean;
}
