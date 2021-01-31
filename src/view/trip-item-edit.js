import SmartView from "./smart.js";
import dayjs from "dayjs";
import flatpickr from "flatpickr";
import {
  humanizeEditEventTime
} from "../utils/event.js";
import {
  TYPES
} from "../const.js";
import "../../node_modules/flatpickr/dist/flatpickr.min.css";

const createEventEditTypeTemplate = (currentType) => {
  return TYPES.map((type) => `
    <div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${currentType === type ? `checked` : ``}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
    </div>
  `.trim()).join(``);
};

const createOffersTypeTemplate = (offers, serverOffers, type) => {

  const offersWithCurrentType = serverOffers.find((it) => it.type === type);
  const currentAvailableOffers = offersWithCurrentType ? offersWithCurrentType.offers : [];
  const availableOffersTemplate = currentAvailableOffers.map((offer) => {
    const isChecked = offers.some(({
      title
    }) => offer.title === title);

    return `
        <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="${offer.title}" data-price="${offer.price}" type="checkbox" name="${offer.title}" ${isChecked ? `checked` : ``}>
          <label class="event__offer-label" for="${offer.title}">
            <span class="event__offer-title">${offer.title}</span>
            +€&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </label>
        </div>
      `;
  }).join(``);
  if (!availableOffersTemplate) {
    return ``;
  }
  return `
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
            ${availableOffersTemplate}
          </div>
        </section>
      `.trim();
};

const createDestTemplate = (destinations) => {
  return destinations.map((el) => `
                 <option value="${el.name}"></option>
  `.trim()).join(``);
};


const createTripItemEditTemplate = (data, destinations, serverOffers) => {
  const {
    type,
    price,
    dateFrom,
    dateTo,
    destination,
    isSaving,
    isDeleting,
    offers,
    isNew
  } = data;

  const typesTemplate = createEventEditTypeTemplate(type);
  const offersTemplate = createOffersTypeTemplate(offers, serverOffers, type);
  const destTemplate = createDestTemplate(destinations);

  const getPicture = (dest) => {
    const picture = dest.pictures.reduce((acc, it) => `${acc}<img class="event__photo" src="${it.src}" alt="${it.description}">`, ``);
    return `<div class="event__photos-container">
              <div class="event__photos-tape">${picture}</div>
            </div>`;
  };

  return `<li class="trip-events__item">
            <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                    <div class="event__type-wrapper">
                        <label class="event__type  event__type-btn" for="event-type-toggle-1">
                            <span class="visually-hidden">Choose event type</span>
                            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png"
                                alt="Event type icon">
                        </label>
                        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                        <div class="event__type-list">
                            <fieldset class="event__type-group">
                                <legend class="visually-hidden">Event type</legend>
                                ${typesTemplate}
                            </fieldset>
                        </div>
                    </div>

                    <div class="event__field-group  event__field-group--destination">
                        <label class="event__label  event__type-output" for="event-destination-1">
                            ${type.toLowerCase()}
                        </label>
                        <input class="event__input  event__input--destination" id="event-destination-1" type="text"
                            name="event-destination" value="${destination.name}" list="destination-list-1">
                        <datalist id="destination-list-1">
                        ${destTemplate}
                        </datalist>
                    </div>

                    <div class="event__field-group  event__field-group--time">
                        <label class="visually-hidden" for="event-start-time-1">From</label>
                        <input class="event__input  event__input--time" id="event-start-time-1" type="text"
                            name="event-start-time" value="${humanizeEditEventTime(dateFrom)}">
                        —
                        <label class="visually-hidden" for="event-end-time-1">To</label>
                        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time"
                            value="${humanizeEditEventTime(dateTo)}">
                    </div>

                    <div class="event__field-group  event__field-group--price">
                        <label class="event__label" for="event-price-1">
                            <span class="visually-hidden">Price</span>
                            €
                        </label>
                        <input class="event__input  event__input--price" id="event-price-1" type="number" min="0" max="9999"
                            name="event-price" value="${price}">
                    </div>

                    <button class="event__save-btn  btn  btn--blue" type="submit">${isSaving ? `Saving...` : `Save`}</button>
                    <button class="event__reset-btn" type="reset">${isNew ? `Cancel` : `${isDeleting ? `Deleting...` : `Delete`}`}</button>
                    ${!isNew ? `<button class="event__rollup-btn" type="button">
                                  <span class="visually-hidden">Close event</span>
                                </button>` : `<button class="event__rollup-btn" style="visibility: hidden" type="button">
                                                <span class="visually-hidden">Close event</span>
                                              </button>`}
                </header>
                <section class="event__details">
                    ${offersTemplate}
                </section>
                <section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${destination.description}</p>
                    ${getPicture(destination)}
                </section>
                </section>
            </form>
          </li>`;
};

export default class EventEdit extends SmartView {
  constructor(event, destinations, offers) {
    super();
    this._destinations = destinations.slice();
    this._offers = offers.slice();
    this._data = EventEdit.parseEventToData(event);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._offerChangeHandler = this._offerChangeHandler.bind(this);
    this._dueDateChangeHandlerFrom = this._dueDateChangeHandlerFrom.bind(this);
    this._dueDateChangeHandlerTo = this._dueDateChangeHandlerTo.bind(this);
    this._destinationInputHandler = this._destinationInputHandler.bind(this);
    this._clickHandler = this._clickHandler.bind(this);
    this._datepicker = null;

    this._setInnerHandlers();
    this._setDatepicker();
  }

  removeElement() {
    super.removeElement();

    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }
  }

  reset(event) {

    this.updateData(EventEdit.parseEventToData(event));
  }

  getTemplate() {
    return createTripItemEditTemplate(this._data, this._destinations, this._offers);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.submitForm(EventEdit.parseDataToEvent(this._data));
  }

  setSubmitFormHandler(callback) {
    this._callback.submitForm = callback;
    this.getElement().querySelector(`.event__save-btn`).addEventListener(`click`, this._formSubmitHandler);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(EventEdit.parseDataToEvent(this._data));
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._formDeleteClickHandler);
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._clickHandler);
  }

  static parseEventToData(event) {
    return Object.assign({}, event, {
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    });
  }

  static parseDataToEvent(data) {
    data = Object.assign({}, data);
    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;
    return data;
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatepicker();
    this.setSubmitFormHandler(this._callback.submitForm);
    this.setClickHandler(this._callback.click);
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  _setDatepicker() {
    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }
    this._datepicker = flatpickr(this.getElement().querySelector(`#event-start-time-1`), {
      dateFormat: `d/m/y H:i`,
      enableTime: true,
      defaultDate: this._data.dateFrom,
      onChange: this._dueDateChangeHandlerFrom
    });
    this._datepicker = flatpickr(this.getElement().querySelector(`#event-end-time-1`), {
      minDate: this._data.dateFrom,
      dateFormat: `d/m/y H:i`,
      enableTime: true,
      onChange: this._dueDateChangeHandlerTo
    });
  }

  _dueDateChangeHandlerFrom([userDate]) {
    this.updateData({
      dateFrom: dayjs(userDate).toJSON(),
      dateTo: dayjs(userDate).toJSON()
    });
  }
  _dueDateChangeHandlerTo([userDate]) {
    this.updateData({
      dateTo: dayjs(userDate).toJSON()
    }, true);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector(`.event__input--price`)
      .addEventListener(`input`, this._priceInputHandler);

    this.getElement()
      .querySelector(`.event__type-group`)
      .addEventListener(`change`, this._typeChangeHandler);

    this.getElement()
      .querySelector(`.event__input--destination`)
      .addEventListener(`input`, this._destinationInputHandler);

    const availableOffersEl = this.getElement().querySelector(`.event__available-offers`);
    if (availableOffersEl) {
      availableOffersEl.addEventListener(`input`, this._offerChangeHandler);
    }
  }

  _priceInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      price: parseInt(evt.target.value, 10)
    }, true);
  }

  _typeChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      type: evt.target.value,
      offers: []
    });
    this.updateElement();
  }

  _offerChangeHandler(evt) {
    evt.preventDefault();
    let currentOffers = this._data.offers.slice();
    if (evt.target.checked) {
      const newOffer = {
        title: evt.target.name,
        price: parseInt(evt.target.getAttribute(`data-price`), 10)
      };
      currentOffers.push(newOffer);
    } else {
      const popOffer = this._data.offers.find((it) => it.title === evt.target.name);
      currentOffers.splice(currentOffers.indexOf(popOffer, 0), 1);
    }
    this.updateData({
      offers: currentOffers
    });
    this.updateElement();
  }

  _destinationInputHandler(evt) {
    evt.preventDefault();
    const updateDest = this._destinations.find((it) => it.name === evt.target.value);
    if (updateDest) {
      this.updateData({
        destination: updateDest
      });
    }
  }
}
