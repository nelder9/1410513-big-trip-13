import EventEditView from "../view/trip-item-edit.js";
import {remove, render, RenderPosition} from "../utils/render.js";
import {UserAction, UpdateType} from "../const.js";

const BLANK_EVENT = {
  dateFrom: `2021-01-05T01:50:44.503Z`,
  dateTo: `2021-01-05T15:04:17.706Z`,
  destination: {
    description: `Geneva, in a middle of Europe.`,
    name: `Geneva`,
    pictures: [
      {
        description: `Berlin embankment`,
        src: `http://picsum.photos/300/200?r=0.72273779502398`
      },
      {
        description: `Berlin embankment`,
        src: `http://picsum.photos/300/200?r=0.6354874215537865`
      }
    ]
  },
  isFavorite: true,
  offers: [],
  price: 100,
  type: `ship`,
  isNew: true
};

export default class EventNew {
  constructor(eventListContainer, changeData) {
    this._eventListContainer = eventListContainer;
    this._changeData = changeData;
    this._destroyCallback = null;

    this._eventEditComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init(callback, destinations, offers) {
    this._destroyCallback = callback;

    if (this._eventEditComponent !== null) {
      return;
    }
    this._destinations = destinations;
    this._offers = offers;

    this._eventEditComponent = new EventEditView(BLANK_EVENT, this._destinations, this._offers);
    this._eventEditComponent.setSubmitFormHandler(this._handleFormSubmit);
    this._eventEditComponent.setDeleteClickHandler(this._handleDeleteClick);
    this._eventEditComponent.setClickHandler(this._handleDeleteClick);

    render(this._eventListContainer, this._eventEditComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._eventEditComponent === null) {
      return;
    }

    if (this._destroyCallback !== null) {
      this._destroyCallback();
    }

    remove(this._eventEditComponent);
    this._eventEditComponent = null;
    document.querySelector(`.trip-main__event-add-btn`).disabled = false;
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _handleFormSubmit(event) {
    this._changeData(
        UserAction.ADD_EVENT,
        UpdateType.MINOR,
        event
    );
  }

  setSaving() {
    this._eventEditComponent.updateData({
      isDisabled: true,
      isSaving: true
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._eventEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    this._eventEditComponent.shake(resetFormState);
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
      document.querySelector(`.trip-main__event-add-btn`).disabled = false;
    }
  }
}
