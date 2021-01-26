import Observer from "../utils/observer.js";
export default class Destinations extends Observer {
  constructor() {
    super();
    this._destinations = [];
  }

  setDestinations(destinations) {
    // console.log(destinations);
    this._destinations = destinations;
    // this._notify(updateType);
  }

  getDestinations() {
    return this._destinations;
  }
}
