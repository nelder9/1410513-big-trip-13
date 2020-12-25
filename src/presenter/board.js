import TripEventsSortView from "../view/trip-events-sort.js";
import EventNewPresenter from "./event-new.js";
import TripWrapperView from "../view/trip-wrapper.js";
import TripNoEventsView from "../view/trip-no-events.js";
import EventPresenter from "./event.js";
import {
  filter
} from "../utils/filter.js";
import {
  SortType,
  UpdateType,
  UserAction,
  FilterType
} from "../const.js";
import {
  sortEventByPrice,
  sortEventByTime
} from "../utils/event.js";
import {
  render,
  RenderPosition,
  remove
} from "../utils/render.js";

export default class Board {
  constructor(boardContainer, eventsModel, filterModel) {
    this._eventsModel = eventsModel;
    this._filterModel = filterModel;
    this._boardContainer = boardContainer;
    this._eventPresenter = {};

    this._tripEventsSortComponent = null;

    this._currentSortType = SortType.DEFAULT;

    this._tripNoEventsComponent = new TripNoEventsView();
    this._tripWrapperComponent = new TripWrapperView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleEventChange = this._handleEventChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._eventsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._eventNewPresenter = new EventNewPresenter(this._tripWrapperComponent, this._handleViewAction);
  }

  init() {
    render(this._boardContainer, this._tripWrapperComponent, RenderPosition.BEFOREEND);

    this._renderBoard();
  }

  createEvent() {
    this._currentSortType = SortType.DEFAULT;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._eventNewPresenter.init();
  }
  _getEvents() {

    const filterType = this._filterModel.getFilter();
    const events = this._eventsModel.getEvents();
    const filtredEvents = filter[filterType](events);

    switch (this._currentSortType) {
      case SortType.TIME:
        return filtredEvents.sort(sortEventByTime);
      case SortType.PRICE:
        return filtredEvents.sort(sortEventByPrice);
    }

    return filtredEvents;
  }

  _handleModeChange() {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleEventChange(updatedEvent) {
    this._eventPresenter[updatedEvent.id].init(updatedEvent);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearBoard();
    this._renderBoard();
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this._eventsModel.updateEvent(updateType, update);
        break;
      case UserAction.ADD_EVENT:
        this._eventsModel.addEvent(updateType, update);
        break;
      case UserAction.DELETE_EVENT:
        this._eventsModel.deleteEvent(updateType, update);
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
    }
  }

  _renderBoard() {
    if (!this._getEvents().length) {
      this._renderNoEvents();
      return;
    }
    this._renderSort();
    this._renderEvents(this._getEvents());
  }

  _renderSort() {
    if (this._tripEventsSortComponent !== null) {
      this._tripEventsSortComponent = null;
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

  _renderEvent(event) {
    const eventPresenter = new EventPresenter(this._tripWrapperComponent, this._handleViewAction, this._handleModeChange);
    eventPresenter.init(event);
    this._eventPresenter[event.id] = eventPresenter;
  }

  _clearBoard({
    resetSortType = false
  } = {}) {

    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.destroy());
    this._eventPresenter = {};

    remove(this._tripEventsSortComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }
}
