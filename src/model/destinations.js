import Observer from "../utils/observer.js";
export default class Destinations extends Observer {
  constructor() {
    super();
  }

  setDestinations(updateType, destinations) {
    this._destinations = destinations;
    this._notify(updateType);
  }

  getDestinations() {
    return this._destinations;
  }
}
