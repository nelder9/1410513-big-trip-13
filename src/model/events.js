import Observer from "../utils/observer.js";

export default class Events extends Observer {
  constructor() {
    super();
    this._events = [];
  }

  setEvents(updateType, events) {
    this._events = events.slice();
    this._notify(updateType);
  }

  getEvents() {
    return this._events;
  }

  static adaptToClient(event) {
    return {
      id: event.id,
      destination: event.destination,
      offers: event.offers,
      type: event.type.toUpperCase(),
      price: event.base_price,
      isFavorite: event.is_favorite,
      dateFrom: event.date_from,
      dateTo: event.date_to
    };
  }

  static adaptToServer(event) {
    return {
      id: event.id,
      destination: event.destination,
      offers: event.offers,
      type: event.type.toLowerCase(),
      [`base_price`]: event.price,
      [`is_favorite`]: event.isFavorite,
      [`date_from`]: event.dateFrom,
      [`date_to`]: event.dateTo,
    };
  }

  updateEvent(updateType, update) {
    const index = this._events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting event`);
    }

    this._events = [
      ...this._events.slice(0, index),
      update,
      ...this._events.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addEvent(updateType, update) {
    this._events = [
      update,
      ...this._events
    ];

    this._notify(updateType, update);
  }

  deleteEvent(updateType, update) {
    const index = this._events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting event`);
    }

    this._events = this._events.filter((_, i) => i !== index);

    this._notify(updateType);
  }
}
