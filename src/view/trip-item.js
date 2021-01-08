import AbstractView from "./abstract.js";
import dayjs from "dayjs";

const tripOffers = (offers) => {
  let offersVar = ``;
  for (let i = 0; i < offers.length; i++) {
    offersVar += `<li class="event__offer"><span class="event__offer-title">${offers[i].title}</span> +€&nbsp<span class="event__offer-price">${offers[i].price}</span></li>`;
  }
  return offersVar;
};

const diffTime = (dateFrom, dateTo) => {
  const date1 = dayjs(dateFrom);
  const date2 = dayjs(dateTo);
  let diffD = Math.abs(Math.ceil((date1.diff(date2)) / 1000 / 60 / 60 / 24));
  let diffH = Math.abs(Math.ceil((date1.diff(date2)) / 1000 / 60 / 60));
  let diffM = Math.abs(Math.floor((date1.diff(date2)) / 1000 / 60 % 60));
  if (diffH > 23) {
    return `${diffD}D ${Math.ceil(diffH % 24)}H ${diffM}M`;
  }
  return `${diffH}H ${diffM}M`;
};

const createTripItemTemplate = (event) => {
  const {
    type,
    price,
    isFavorite,
    dateFrom,
    dateTo,
    destination,
    offers
  } = event;

  const favoriteClassName = isFavorite ?
    `event__favorite-btn--active` :
    ``;


  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="2019-03-18">${dayjs(dateFrom).format(`D MMM`)}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type}${` `}${destination.name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="2019-03-18T10:30">${dayjs(dateFrom).format(`HH:mm`)}</time>
          &mdash;
          <time class="event__end-time" datetime="2019-03-18T11:00">${dayjs(dateTo).format(`HH:mm`)}</time>
        </p>
        <p class="event__duration">${diffTime(dateFrom, dateTo)}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        <li class="event__offer">
        <span class="event__offer-title">${tripOffers(offers)}</span>
        </li>
      </ul>
      <button class="event__favorite-btn ${favoriteClassName}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};

export default class TripItem extends AbstractView {
  constructor(event) {
    super();
    this._event = event;
    this._clickHandler = this._clickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createTripItemTemplate(this._event);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._clickHandler);
  }
  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }
  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.event__favorite-btn`).addEventListener(`click`, this._favoriteClickHandler);
  }
}
