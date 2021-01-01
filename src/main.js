import TripInfoView from "./view/trip-info.js";
import TripTabsView from "./view/trip-tabs.js";
import EventsModel from "./model/events.js";
import FilterModel from "./model/filter.js";
import FilterPresenter from "./presenter/filter.js";
import {render, RenderPosition} from "./utils/render.js";
import BoardPresenter from "./presenter/board.js";
import {
  generateEvent
} from "./mock/event.js";
import {sortEventByDays} from "./utils/event.js";

const ITEM_COUNT = 5;

const events = new Array(ITEM_COUNT).fill().map(generateEvent).sort(sortEventByDays);

const eventsModel = new EventsModel();
eventsModel.setEvents(events);

const filterModel = new FilterModel();

const siteTripMainElement = document.querySelector(`.trip-main`);
const siteTripControlsElement = document.querySelector(`.trip-main__trip-controls`);
const siteTripEventsElement = document.querySelector(`.trip-events`);

render(siteTripMainElement, new TripInfoView().getElement(), RenderPosition.AFTERBEGIN);
render(siteTripControlsElement, new TripTabsView().getElement(), RenderPosition.AFTERBEGIN);


const boardPresenter = new BoardPresenter(siteTripEventsElement, eventsModel, filterModel);
const filterPresenter = new FilterPresenter(siteTripControlsElement, filterModel);

filterPresenter.init();
boardPresenter.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  boardPresenter.createEvent();
});

