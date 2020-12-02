import AbstractView from "./abstract.js";

const createTripNoEventsTemplate = () => {
  return `<p class="trip-events__msg">Click New Event to create your first point</p>`;
};

export default class TripNoEvents extends AbstractView {
  getTemplate() {
    return createTripNoEventsTemplate();
  }
}

