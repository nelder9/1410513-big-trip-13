import {
  render,
  RenderPosition
} from "../utils/render.js";
import TripEventsSortView from "../view/trip-events-sort.js";
import TripWrapperView from "../view/trip-wrapper.js";
import TripNoEventsView from "../view/trip-no-events.js";
import EventPresenter from "./event.js";
import {updateItem} from "../utils/common.js";

export default class Board {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._eventPresenter = {};

    this._tripNoEventsComponent = new TripNoEventsView();
    this._tripEventsSortComponent = new TripEventsSortView();
    this._tripWrapperComponent = new TripWrapperView();

    this._handleEventChange = this._handleEventChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);

  }

  init(boardEvents) {
    this._boardEvents = boardEvents.slice();
    this._sourcedboardTrips = boardEvents.slice();

    render(this._boardContainer, this._tripWrapperComponent, RenderPosition.BEFOREEND);

    this._renderBoard();
  }

  _handleModeChange() {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleEventChange(updatedEvent) {
    this._boardEvents = updateItem(this._boardEvents, updatedEvent);
    this._eventPresenter[updatedEvent.id].init(updatedEvent);
  }

  _renderBoard() {
    if (!this._boardEvents.length) {
      this._renderNoEvents();
      return;
    }
    this._renderEvents(this._boardEvents);
  }

  _renderNoEvents() {
    render(this._boardContainer, this._tripNoEventsComponent, RenderPosition.BEFOREEND);
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
