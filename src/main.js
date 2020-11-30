import {
  createTripInfoTemplate
} from "./view/trip-info.js";
import {
  createTripTabsTemplate
} from "./view/trip-tabs.js";
import {
  createTripFiltersTemplate
} from "./view/trip-filters.js";
import {
  createTripEventsTemplate
} from "./view/trip-events.js";
import {
  createTripWrapperTemplate
} from "./view/trip-wrapper.js";
import {
  createTripItemTemplate
} from "./view/trip-item.js";
import {
  createTripItemEditTemplate
} from "./view/trip-item-edit";

import {
  generateEvent
} from "./mock/event.js";

const ITEM_COUNT = 15;

const events = new Array(ITEM_COUNT).fill().map(generateEvent);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteTripMainElement = document.querySelector(`.trip-main`);
const siteTripControlsElement = document.querySelector(`.trip-main__trip-controls`);
const siteTripEventsElement = document.querySelector(`.trip-events`);

render(siteTripMainElement, createTripInfoTemplate(), `afterbegin`);
render(siteTripControlsElement, createTripTabsTemplate(), `afterbegin`);
render(siteTripControlsElement, createTripFiltersTemplate(), `beforeend`);
render(siteTripEventsElement, createTripEventsTemplate(), `afterbegin`);
render(siteTripEventsElement, createTripWrapperTemplate(), `beforeend`);

const siteTripWrapperElement = document.querySelector(`.trip-events__list`);

render(siteTripWrapperElement, createTripItemEditTemplate(events[0]), `afterbegin`);

for (let i = 1; i < ITEM_COUNT; i++) {
  render(siteTripWrapperElement, createTripItemTemplate(events[i]), `beforeend`);
}

