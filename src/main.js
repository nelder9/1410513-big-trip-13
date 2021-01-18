import TripInfoView from "./view/trip-info.js";
import TripTabsView from "./view/trip-tabs.js";
import EventsModel from "./model/events.js";
import FilterModel from "./model/filter.js";
import FilterPresenter from "./presenter/filter.js";
import {UpdateType} from "./const.js";
import {
  render,
  RenderPosition
} from "./utils/render.js";
import BoardPresenter from "./presenter/board.js";

import Api from "./api.js";

const AUTHORIZATION = `Basic hS6sd4dfSwyl9sb9j`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;

const api = new Api(END_POINT, AUTHORIZATION);

const eventsModel = new EventsModel();


const filterModel = new FilterModel();

const siteTripMainElement = document.querySelector(`.trip-main`);
const siteTripControlsElement = document.querySelector(`.trip-main__trip-controls`);
const siteTripEventsElement = document.querySelector(`.trip-events`);

render(siteTripMainElement, new TripInfoView().getElement(), RenderPosition.AFTERBEGIN);
render(siteTripControlsElement, new TripTabsView().getElement(), RenderPosition.AFTERBEGIN);


const boardPresenter = new BoardPresenter(siteTripEventsElement, eventsModel, filterModel, api);
const filterPresenter = new FilterPresenter(siteTripControlsElement, filterModel);

filterPresenter.init();
boardPresenter.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  boardPresenter.createEvent();
});

api.getEvents()
  .then((events) => {
    eventsModel.setEvents(UpdateType.INIT, events);
  })
  .catch(() => {
    eventsModel.setEvents(UpdateType.INIT, []);
  });
