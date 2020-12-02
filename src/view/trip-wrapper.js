import {createElement} from "../utils.js";

const createTripWrapperTemplate = () => {
  return `<ul class="trip-events__list"></ul>`;
};

export default class TripWrapper {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTripWrapperTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
