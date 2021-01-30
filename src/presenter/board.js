import TripEventsSortView from "../view/trip-events-sort.js";
import EventNewPresenter from "./event-new.js";
import LoadingView from "../view/loading.js";
import EventPresenter, {
  State as EventPresenterViewState
} from "./event.js";
import TripWrapperView from "../view/trip-wrapper.js";
import TripNoEventsView from "../view/trip-no-events.js";
import {
  FILTERS
} from "../utils/filter.js";
import {
  SortType,
  UpdateType,
  UserAction,
  FilterType
} from "../const.js";
import {
  sortEventByPrice,
  sortEventByTime,
  sortEventByDays
} from "../utils/event.js";
import {
  render,
  RenderPosition,
  remove
} from "../utils/render.js";

export default class Board {
  constructor(boardContainer, eventsModel, filterModel, api) {
    this._eventsModel = eventsModel;
    this._filterModel = filterModel;
    this._boardContainer = boardContainer;
    this._eventPresenter = {};
    this._api = api;
    this._isLoading = true;

    this._tripEventsSortComponent = null;

    this._currentSortType = SortType.DEFAULT;

    this._tripNoEventsComponent = new TripNoEventsView();
    this._tripWrapperComponent = new TripWrapperView();
    this._loadingComponent = new LoadingView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._eventNewPresenter = new EventNewPresenter(this._tripWrapperComponent, this._handleViewAction);
  }

  init() {
    render(this._boardContainer, this._tripWrapperComponent, RenderPosition.BEFOREEND);

    this._eventsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderBoard();
  }

  destroy() {
    this._clearBoard({
      resetSortType: true
    });

    remove(this._tripWrapperComponent);

    this._eventsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  createEvent(callback) {
    const destinations = this._eventsModel.getDestinations().slice();
    const offers = this._eventsModel.getOffers().slice();
    this._currentSortType = SortType.DEFAULT;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._eventNewPresenter.init(callback, destinations, offers);
  }

  _getEvents() {
    const filterType = this._filterModel.getFilter();
    const events = this._eventsModel.getEvents();
    const filtredEvents = FILTERS[filterType](events);
    switch (this._currentSortType) {
      case SortType.DEFAULT:
        return filtredEvents.sort(sortEventByDays);
      case SortType.TIME:
        return filtredEvents.sort(sortEventByTime);
      case SortType.PRICE:
        return filtredEvents.sort(sortEventByPrice);
    }

    return filtredEvents;
  }

  _handleModeChange() {
    this._eventNewPresenter.destroy();
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType || !sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearBoard();
    this._renderBoard();
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this._eventPresenter[update.id].setViewState(EventPresenterViewState.SAVING);
        this._api.updateEvent(update)
          .then((response) => {
            this._eventsModel.updateEvent(updateType, response);
          }).catch(() => {
            this._eventPresenter[update.id].setViewState(EventPresenterViewState.ABORTING);
          });
        break;
      case UserAction.ADD_EVENT:
        this._eventNewPresenter.setSaving();
        this._api.addEvent(update)
          .then((response) => {
            this._eventsModel.addEvent(updateType, response);
            document.querySelector(`.trip-main__event-add-btn`).disabled = false;
          })
          .catch(() => {
            this._eventNewPresenter.setAborting();
          });
        break;
      case UserAction.DELETE_EVENT:
        this._eventPresenter[update.id].setViewState(EventPresenterViewState.DELETING);
        this._api.deleteEvent(update)
          .then(() => {
            this._eventsModel.deleteEvent(updateType, update);
            document.querySelector(`.trip-main__event-add-btn`).disabled = false;
          })
          .catch(() => {
            this._eventPresenter[update.id].setViewState(EventPresenterViewState.ABORTING);
          });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._eventPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        this._clearBoard({
          resetSortType: true
        });
        this._renderBoard();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderBoard();
        break;
    }
  }

  _renderBoard() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const events = this._getEvents();
    const eventCount = events.length;
    this._renderSort();
    if (eventCount === 0) {
      this._renderNoEvents();
      return;
    }

    this._renderEvents(events);
  }

  _renderSort() {

    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._tripEventsSortComponent = new TripEventsSortView(this._currentSortType);
    this._tripEventsSortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._boardContainer, this._tripEventsSortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderNoEvents() {
    render(this._boardContainer, this._tripNoEventsComponent, RenderPosition.BEFOREEND);
  }

  _renderEvents(events) {
    events.forEach((event) => this._renderEvent(event));
  }

  _renderLoading() {
    render(this._boardContainer, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  _renderEvent(event) {
    const eventPresenter = new EventPresenter(this._tripWrapperComponent, this._handleViewAction, this._handleModeChange, this._eventsModel);
    eventPresenter.init(event);
    this._eventPresenter[event.id] = eventPresenter;
  }

  _clearBoard({
    resetSortType = false
  } = {}) {

    this._eventNewPresenter.destroy();

    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.destroy());
    this._eventPresenter = {};

    remove(this._tripNoEventsComponent);
    remove(this._loadingComponent);
    remove(this._tripEventsSortComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }
}
