import dayjs from "dayjs";

export const makeItemsUniq = (items) => [...new Set(items)];

export const countMoneyByTypes = (events, type) => {
  let num = 0;
  for (let event of events) {
    if (event.type === type) {
      num += event.price;
    }
  }
  return num;
};

export const countAmountByTypes = (events, type) => {
  let num = 0;
  for (let event of events) {
    if (event.type === type) {
      num += 1;
    }
  }
  return num;
};

export const countAmountByTimes = (events, type) => {

  let num = 0;
  for (let event of events) {
    if (event.type === type) {
      const date1 = dayjs(event.dateFrom);
      const date2 = dayjs(event.dateTo);
      num += Math.abs(date1.diff(date2, `d`, true));
    }
  }
  return Math.round(num);
};
