import {
  render,
  RenderPosition
} from "../utils/render.js";
import TripEventsSortView from "../view/trip-events-sort.js";
import TripWrapperView from "../view/trip-wrapper.js";
import TripNoEventsView from "../view/trip-no-events.js";
import EventPresenter from "./event.js";
import {getUpdatedItems} from "../utils/common.js";
import {SortType} from "../const.js";
import {sortEventByPrice, sortEventByTime} from "../utils/event.js";

export default class Board {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._eventPresenter = {};

    this._currentSortType = SortType.DEFAULT;
    this._tripNoEventsComponent = new TripNoEventsView();
    this._tripEventsSortComponent = new TripEventsSortView();
    this._tripWrapperComponent = new TripWrapperView();

    this._handleEventChange = this._handleEventChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(boardEvents) {
    this._boardEvents = boardEvents.slice();
    this._sourcedboardEvents = boardEvents.slice();

    render(this._boardContainer, this._tripWrapperComponent, RenderPosition.BEFOREEND);

    this._renderBoard();
  }

  _sortEvents(sortType) {
    switch (sortType) {
      case SortType.TIME:
        this._boardEvents.sort(sortEventByTime);
        break;
      case SortType.PRICE:
        this._boardEvents.sort(sortEventByPrice);
        break;
      default:
        this._boardEvents = this._sourcedboardEvents.slice();
    }

    this._currentSortType = sortType;
  }

  _handleModeChange() {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleEventChange(updatedEvent) {
    this._boardEvents = getUpdatedItems(this._boardEvents, updatedEvent);
    this._eventPresenter[updatedEvent.id].init(updatedEvent);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortEvents(sortType);
    this._clearEventList();
    this._renderBoard();
  }

  _renderBoard() {
    if (!this._boardEvents.length) {
      this._renderNoEvents();
      return;
    }
    this._renderSort();
    this._renderEvents(this._boardEvents);
  }

  _renderSort() {
    render(this._boardContainer, this._tripEventsSortComponent, RenderPosition.AFTERBEGIN);
    this._tripEventsSortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderNoEvents() {
    render(this._boardContainer, this._tripNoEventsComponent, RenderPosition.BEFOREEND);
  }

  _clearEventList() {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.destroy());
    this._taskPresenter = {};
  }

  _renderEvents(events) {
    events.forEach((event) => this._renderEvent(event));
  }

  _renderEvent(event) {
    const eventPresenter = new EventPresenter(this._tripWrapperComponent, this._handleEventChange, this._handleModeChange);
    eventPresenter.init(event);
    this._eventPresenter[event.id] = eventPresenter;
  }
}
