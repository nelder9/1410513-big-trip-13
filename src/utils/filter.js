import {
  FilterType
} from "../const";
import {isEventPast, isEventFuture} from "./event";

export const FILTERS = {
  [FilterType.EVERYTHING]: (events) => events,
  [FilterType.FUTURE]: (events) => events.filter((event) => isEventFuture(event.dateFrom)),
  [FilterType.PAST]: (events) => events.filter((event) => isEventPast(event.dateTo)),
};
