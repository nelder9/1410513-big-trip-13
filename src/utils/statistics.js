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
      let date1 = dayjs(event.dateFrom);
      let date2 = dayjs(event.dateTo);
      num += date1.diff(date2, `d`);
    }
  }
  return Math.abs(num);
};
