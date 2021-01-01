import dayjs from "dayjs";

import {
  getRandomInteger
} from "../utils/common.js";


export const generateId = () => Date.now() + Math.ceil(Math.random() * 10000, 10);

const generateDestination = () => {

  const cities = [
    {
      name: `Geneva`,
      text: `Geneva is a city in Switzerland that lies at the southern tip of expansive Lac Léman (Lake Geneva). Surrounded by the Alps and Jura mountains, the city has views of dramatic Mont Blanc.`
    },
    {
      name: `Chamonix`,
      text: `Chamonix-Mont-Blanc (usually shortened to Chamonix) is a resort area near the junction of France, Switzerland and Italy. At the base of Mont Blanc, the highest summit in the Alps, it's renowned for its skiing.`
    },
    {
      name: `Amsterdam`,
      text: `Amsterdam, city and port, western Netherlands, located on the IJsselmeer and connected to the North Sea. It is the capital and the principal commercial and financial centre of the Netherlands.`
    }
  ];

  const randomIndex = getRandomInteger(0, cities.length - 1);

  return cities[randomIndex];
};

const generateType = () => {
  const types = [
    {
      name: `taxi`,
      offers: [{
        title: `Order Uber`,
        price: 20,
      }, {
        title: `Order Yandex.taxi`,
        price: 15,
      }]
    },
    {
      name: `bus`,
      offers: null
    },
    {
      name: `flight`,
      offers: [{
        title: `Choose seats`,
        price: 5
      }, {
        title: `VIP class`,
        price: 80,
      }]
    },
    {
      name: `train`,
      offers: null
    },
    {
      name: `ship`,
      offers: null
    },
    {
      name: `drive`,
      offers: null
    },
    {
      name: `drive`,
      offers: null
    },
    {
      name: `check-in`,
      offers: null
    },
    {
      name: `sightseeing`,
      offers: null
    },
    {
      name: `restaurant`,
      offers: null
    }
  ];
  const randomIndex = getRandomInteger(0, types.length - 1);

  return types[randomIndex];
};

const generateTime = () => {
  return getRandomInteger(5, 60);
};


const generatePrice = () => {

  return getRandomInteger(10, 200);
};

export const generateDate = () => {
  const maxDaysGap = 7;
  const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);
  return dayjs(dayjs().add(daysGap, `day`).toDate());
};

export const generateEvent = () => {

  return {
    id: generateId(),
    date: generateDate(),
    type: generateType(),
    time: generateTime(),
    price: generatePrice(),
    destination: generateDestination(),
    isFavorite: Boolean(getRandomInteger(0, 1))
  };
};
