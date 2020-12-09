import dayjs from "dayjs";

import {getRandomInteger} from "../utils/common.js";

const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

const generateType = () => {
  const types = [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`, `Check-in`, `Sightseeing`, `Restaurant`];
  const randomIndex = getRandomInteger(0, types.length - 1);

  return types[randomIndex];
};

const generateOffer = () => {


  const offers = [{
    title: `Add luggage`,
    price: 30},
  {
    title: `Switch to comfort class`,
    price: 100,
  },
  {
    title: `Add meal`,
    price: 15
  },
  {
    title: `Choose seats`,
    price: 5
  },
  {
    title: `Travel by train`,
    price: 40,
  },
  {
    title: `Order Uber`,
    price: 20,
  }
  ];

  const randomIndex = getRandomInteger(0, offers.length - 1);

  return offers[randomIndex];

};

const generatePicture = () => {

  return `http://picsum.photos/248/152?r=${Math.random()}`;

};

const generateDestination = () => {
  const cities = [
    `Moscow`,
    `London`,
    `Samara`,
    `Barselona`,
    `Milan`,
    `Berlin`,
  ];

  const randomIndex = getRandomInteger(0, cities.length - 1);

  return cities[randomIndex];

};

const generatePrice = () => {

  return getRandomInteger(10, 200);
};

const generateText = () => {
  return `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;
};

export const generateEvent = () => {
  const generateDate = () => {
    const maxDaysGap = 7;
    const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);
    return dayjs(dayjs().add(daysGap, `day`).toDate()).format(`MMM D`);
  };

  return {
    id: generateId(),
    date: generateDate(),
    type: generateType(),
    offer: generateOffer(),
    price: generatePrice(),
    picture: generatePicture(),
    destination: generateDestination(),
    text: generateText(),
    isFavorite: Boolean(getRandomInteger(0, 1))
  };
};
