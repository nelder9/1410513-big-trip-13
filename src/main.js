import TripInfoView from "./view/trip-info.js";
import TripTabsView from "./view/trip-tabs.js";
import TripFiltersView from "./view/trip-filters.js";
import TripEventsView from "./view/trip-events.js";
import TripWrapperView from "./view/trip-wrapper.js";
import TripItemView from "./view/trip-item.js";
import TripItemEditView from "./view/trip-item-edit";

import {
  generateEvent
} from "./mock/event.js";
import {
  render,
  RenderPosition
} from "./utils.js";

const ITEM_COUNT = 15;

const events = new Array(ITEM_COUNT).fill().map(generateEvent);

const siteTripMainElement = document.querySelector(`.trip-main`);
const siteTripControlsElement = document.querySelector(`.trip-main__trip-controls`);
const siteTripEventsElement = document.querySelector(`.trip-events`);

render(siteTripMainElement, new TripInfoView().getElement(), RenderPosition.AFTERBEGIN);
render(siteTripControlsElement, new TripTabsView().getElement(), RenderPosition.AFTERBEGIN);
render(siteTripControlsElement, new TripFiltersView().getElement(), RenderPosition.BEFOREEND);

const renderEvent = (eventListElement, event) => {
  const eventComponent = new TripItemView(event);
  const eventEditComponent = new TripItemEditView(event);

  const replaceEventToEdit = () => {
    eventListElement.replaceChild(eventEditComponent.getElement(), eventComponent.getElement());
  };

  const replaceEditToEvent = () => {
    eventListElement.replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      replaceEditToEvent();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  eventComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replaceEventToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  eventEditComponent.getElement().querySelector(`form`).addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceEditToEvent();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(eventListElement, eventComponent.getElement(), RenderPosition.BEFOREEND);
};

const renderBoard = (boardContainer, boardEvents) => {
  const boardComponent = new TripEventsView();
  const eventsListComponent = new TripWrapperView();

  render(boardContainer, boardComponent.getElement(), RenderPosition.AFTERBEGIN);
  render(boardComponent.getElement(), eventsListComponent.getElement(), RenderPosition.BEFOREEND);

  for (let i = 0; i < ITEM_COUNT; i++) {
    renderEvent(eventsListComponent.getElement(), boardEvents[i]);
  }
};

renderBoard(siteTripEventsElement, events);
