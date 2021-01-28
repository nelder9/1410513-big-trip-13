import TripInfoView from "./view/trip-info.js";
import StatisticsView from "./view/statistics.js";
import TripTabsView from "./view/trip-tabs.js";
import EventsModel from "./model/events.js";
import FilterModel from "./model/filter.js";
import FilterPresenter from "./presenter/filter.js";
import DestinationsModel from "./model/destinations.js";
import OffersModel from "./model/offers";
import {
  UpdateType,
  MenuItem,
  FilterType
} from "./const.js";
import {
  render,
  RenderPosition,
  remove
} from "./utils/render.js";
import BoardPresenter from "./presenter/board.js";

import Api from "./api.js";

const AUTHORIZATION = `Basic hS6sd4dfSwyl95sd5`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;

const api = new Api(END_POINT, AUTHORIZATION);

const eventsModel = new EventsModel();

const siteMenuComponent = new TripTabsView();
const filterModel = new FilterModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();

const siteTripMainElement = document.querySelector(`.trip-main`);
const siteTripControlsElement = document.querySelector(`.trip-main__trip-controls`);
const siteTripEventsElement = document.querySelector(`.trip-events`);

render(siteTripMainElement, new TripInfoView().getElement(), RenderPosition.AFTERBEGIN);


const boardPresenter = new BoardPresenter(siteTripEventsElement, eventsModel, filterModel, api, destinationsModel, offersModel);
const filterPresenter = new FilterPresenter(siteTripControlsElement, filterModel);

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.EVENTS:
      boardPresenter.destroy();
      document.querySelector(`.trip-main__event-add-btn`).disabled = false;
      document.querySelector(`[data-name=${MenuItem.STATISTICS}]`).classList.remove(`trip-tabs__btn--active`);
      document.querySelector(`[data-name=${MenuItem.EVENTS}]`).classList.add(`trip-tabs__btn--active`);
      boardPresenter.init();
      remove(statisticsComponent);
      break;
    case MenuItem.STATISTICS:
      boardPresenter.destroy();
      if (statisticsComponent !== null) {
        remove(statisticsComponent);
      }
      document.querySelector(`.trip-main__event-add-btn`).disabled = true;
      document.querySelector(`[data-name=${MenuItem.STATISTICS}]`).classList.add(`trip-tabs__btn--active`);
      document.querySelector(`[data-name=${MenuItem.EVENTS}]`).classList.remove(`trip-tabs__btn--active`);
      statisticsComponent = new StatisticsView(eventsModel.getEvents());
      render(siteTripEventsElement, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

const handleEventNewFormClose = () => {
  document.querySelector(`.trip-main__event-add-btn`).disabled = false;
  siteMenuComponent.setMenuItem(MenuItem.EVENTS);
};


filterPresenter.init();
boardPresenter.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  document.querySelector(`.trip-main__event-add-btn`).disabled = true;
  filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  boardPresenter.createEvent(handleEventNewFormClose);
});

Promise
  .all([
    api.getEvents(),
    api.getOffers(),
    api.getDestinations()
  ])
  .then(([events, offers, destinations]) => {
    destinationsModel.setDestinations(destinations);
    offersModel.setOffers(offers);
    eventsModel.setEvents(UpdateType.INIT, events);
    render(siteTripControlsElement, siteMenuComponent, RenderPosition.AFTERBEGIN);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  });
