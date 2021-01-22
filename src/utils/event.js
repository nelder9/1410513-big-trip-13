import dayjs from "dayjs";

export const isEventPast = (date) => {
  return date && dayjs().isAfter(date, `MMM D`);
};

export const isEventFuture = (date) => {
  return date && dayjs().isBefore(date, `MMM D`);
};

export const sortEventByDays = (eventA, eventB) => {

  return dayjs(eventA.date).diff(dayjs(eventB.date));
};

export const sortEventByPrice = (eventA, eventB) => {

  return dayjs(eventB.price).diff(dayjs(eventA.price));
};

export const sortEventByTime = (eventA, eventB) => {
  return dayjs(dayjs(eventA.dateFrom).diff(dayjs(eventA.dateTo))).diff(dayjs(dayjs(eventB.dateFrom).diff(dayjs(eventB.dateTo))));
};

export const humanizeEditEventTime = (dueDate) => {
  return dayjs(dueDate).format(`DD/MM/YYYY HH:mm`);
};

