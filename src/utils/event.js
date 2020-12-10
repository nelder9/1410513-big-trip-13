import dayjs from "dayjs";

export const sortEventByDays = (eventA, eventB) => {

  return dayjs(eventA.date).diff(dayjs(eventB.date));
};

export const sortEventByPrice = (eventA, eventB) => {

  return dayjs(eventB.price).diff(dayjs(eventA.price));
};

export const sortEventByTime = (eventA, eventB) => {
  return dayjs(eventB.time).diff(dayjs(eventA.time));
};
