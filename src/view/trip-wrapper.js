import AbstractView from "./abstract.js";

const createTripWrapperTemplate = () => {
  return `<ul class="trip-events__list"></ul>`;
};

export default class TripWrapper extends AbstractView {
  getTemplate() {
    return createTripWrapperTemplate();
  }
}
