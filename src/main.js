import TripInfoView from "./view/trip-info.js";
import TripTabsView from "./view/trip-tabs.js";
import TripFiltersView from "./view/trip-filters.js";
import {render, RenderPosition} from "./utils/render.js";
import BoardPresenter from "./presenter/board.js";
import {
  generateEvent
} from "./mock/event.js";
import {sortEventByDays} from "./utils/event.js";
const ITEM_COUNT = 40;

const events = new Array(ITEM_COUNT).fill().map(generateEvent).sort(sortEventByDays);

const siteTripMainElement = document.querySelector(`.trip-main`);
const siteTripControlsElement = document.querySelector(`.trip-main__trip-controls`);
const siteTripEventsElement = document.querySelector(`.trip-events`);

render(siteTripMainElement, new TripInfoView().getElement(), RenderPosition.AFTERBEGIN);
render(siteTripControlsElement, new TripTabsView().getElement(), RenderPosition.AFTERBEGIN);
render(siteTripControlsElement, new TripFiltersView().getElement(), RenderPosition.BEFOREEND);


const boardPresenter = new BoardPresenter(siteTripEventsElement);

boardPresenter.init(events);
