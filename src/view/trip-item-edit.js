import SmartView from "./smart.js";
import dayjs from "dayjs";
import flatpickr from "flatpickr";
import {humanizeEditEventTime} from "../utils/event.js";
import "../../node_modules/flatpickr/dist/flatpickr.min.css";

const BLANK_EVENT = {
  dateFrom: `2021-01-05T01:50:44.503Z`,
  dateTo: `2021-01-05T15:04:17.706Z`,
  destination: {
    description: `Geneva, in a middle of Europe.`,
    name: `Geneva`,
    pictures: [
      {
        description: `Berlin embankment`,
        src: `http://picsum.photos/300/200?r=0.72273779502398`
      },
      {
        description: `Berlin embankment`,
        src: `http://picsum.photos/300/200?r=0.6354874215537865`
      }
    ]
  },
  isFavorite: true,
  offers: [
    {
      title: `Choose comfort class`,
      price: 110
    },
    {
      title: `Choose business class`,
      price: 180
    }
  ],
  price: 150,
  type: `ship`
};

const createTripItemEditTemplate = (data, destinations, serverOffers) => {
  // console.log(serverOffers);
  // Криво доходят до сюда destinations, serverOffers, не могу понять в чем дело((( в консоле при старте приложения, через раз выскакивает ошибка
  const {
    type,
    price,
    dateFrom,
    dateTo,
    destination,
    isSaving,
    isDeleting,
    isDisabled
  } = data;

  const createEventTypeItems = () => {
    const types = Object.values(serverOffers).map((item) => item);
    return `
      ${types.map(({type}) => `
        <div class="event__type-item">
          <input
            id="event-type-${type}"
            class="event__type-input visually-hidden"
            type="radio"
            name="event-type"
            value="${type}"
            ${isDisabled ? `disabled` : ``}
          >
          <label
            class="event__type-label event__type-label--${type}"
            for="event-type-${type}"
          >
            ${type}
          </label>
        </div>
      `).join(``)}
    `;
  };
  const eventTypeItems = createEventTypeItems();

  const getPic = (dest) => {
    let pic = ``;
    if (dest.pictures.length) {
      for (let i = 0; i < dest.pictures.length; i++) {
        pic += `<img class="event__photo" src="${dest.pictures[i].src}" alt="${dest.pictures[i].description}"></img>`;
      }
    }
    return `<div class="event__photos-container">
    <div class="event__photos-tape">${pic}</div>
    </div>`;
  };

  return `<li class="trip-events__item">
              <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>
                        ${eventTypeItems}
                      </fieldset>
                    </div>
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-1">
                      ${type.toLowerCase()}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
                    <datalist id="destination-list-1">
                      <option value="Amsterdam"></option>
                      <option value="Geneva"></option>
                      <option value="Chamonix"></option>
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeEditEventTime(dateFrom)}">
                    —
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeEditEventTime(dateTo)}">
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      €
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="number" min="0" max="9999" name="event-price" value="${price}">
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit">${isSaving ? `Saving...` : `Save`}</button>
                  <button class="event__reset-btn" type="reset">${isDeleting ? `Deleting...` : `Delete`}</button>
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
                </header>
                <section class="event__details">
                  

                  <section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${destination.description}</p>
                    ${getPic(destination)}
                  </section>
                </section>
              </form>
            </li>`;
};


export default class EventEdit extends SmartView {
  constructor(event = BLANK_EVENT, destinations, offers) {
    super();
    this._destinations = Object.assign({}, destinations);
    this._offers = Object.assign({}, offers);
    this._data = EventEdit.parseEventToData(event);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
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
      isDeleting: false
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
      defaultDate: this._data.dateFrom,
      enableTime: true,
      onChange: this._dueDateChangeHandlerTo
    });
  }

  _dueDateChangeHandlerFrom([userDate]) {
    this.updateData({
      dateFrom: dayjs(userDate).hour(23).minute(59).second(59).toDate()
    });
  }
  _dueDateChangeHandlerTo([userDate]) {

    this.updateData({
      dateTo: dayjs(userDate).hour(23).minute(59).second(59).toDate()
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
      type: evt.target.value
    });
  }

  _destinationInputHandler(evt) {
    evt.preventDefault();
    if (evt.target.value === `Geneva`) {
      this.updateData({
        destination: {
          name: `Geneva`,
          text: `Geneva is a city in Switzerland that lies at the southern tip of expansive Lac Léman (Lake Geneva). Surrounded by the Alps and Jura mountains, the city has views of dramatic Mont Blanc.`
        }
      });
    }
    if (evt.target.value === `Amsterdam`) {
      this.updateData({
        destination: {
          name: `Amsterdam`,
          text: `Amsterdam, city and port, western Netherlands, located on the IJsselmeer and connected to the North Sea. It is the capital and the principal commercial and financial centre of the Netherlands.`
        }
      });
    }
    if (evt.target.value === `Chamonix`) {
      this.updateData({
        destination: {
          name: `Chamonix`,
          text: `Chamonix-Mont-Blanc (usually shortened to Chamonix) is a resort area near the junction of France, Switzerland and Italy. At the base of Mont Blanc, the highest summit in the Alps, it's renowned for its skiing.`
        }
      });
    }
  }
}
