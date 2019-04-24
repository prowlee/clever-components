import '../atoms/cc-button.js';
import '../atoms/cc-input-text.js';
import { css, html, LitElement, unsafeCSS } from 'lit-element';
import { dispatchCustomEvent } from '../lib/events.js';
// import deleteSvg from '../assets/delete.svg';

/**
 * A small input to manipulate an environement variable
 *
 * @customElement env-var-input
 *
 * @event env-var-input:input - mirrors native cc-input-text events with `{ name: 'the name', value: 'the value' }` as `detail`
 * @event env-var-input:delete - when the inner delete button is clicked with `{ name: 'the name' }` as `detail`
 * @event env-var-input:keep - when the inner keep button is clicked with `{ name: 'the name' }` as `detail`
 *
 * @attr {String} name - name of the environment variable, no space characters allowed
 * @attr {String} value - value of the environment variable (can be empty)
 * @attr {Boolean} isNew - if the environment variable is new (compared to server side state)
 * @attr {Boolean} isEdited - if the environment variable is edited (compared to server side state)
 * @attr {Boolean} isDeleted - if the environment variable should be deleted
 */
export class EnvVarInput extends LitElement {

  static get i18n () {
    return {
      deleteButton: 'Delete',
      keepButton: 'Keep',
      valuePlaceholder: 'Environment variable value',
      // deleteButton: 'Supprimer',
      // keepButton: 'Garder',
      // valuePlaceholder: 'Valeur de la variable d\'environnement',
    };
  }

  static get properties () {
    return {
      name: { type: String },
      value: { type: String },
      isNew: { type: Boolean, attribute: 'is-new' },
      isEdited: { type: Boolean, attribute: 'is-edited' },
      isDeleted: { type: Boolean, attribute: 'is-deleted' },
    };
  }

  constructor () {
    super();
    this.value = '';
    this.isNew = false;
    this.isEdited = false;
    this.isDeleted = false;
    // console.log({ deleteSvg });
  }

  static get styles () {
    // language=CSS
    return css`
      :host {
        align-items: flex-start;
        /* TODO: grids ? */
        display: flex;
        flex-wrap: wrap;
        width: 100%;
      }

      :host([hidden]) {
        display: none;
      }

      .icon {
        font-family: monospace;
        font-size: 0.9rem;
        height: 2rem;
        line-height: 2rem;
        padding: 0.2rem;
      }

      .label {
        display: inline-block;
        flex: 1 1 0;
        font-family: monospace;
        font-size: 0.9rem;
        height: 2rem;
        line-height: 2rem;
        min-width: 10rem;
        padding: 0.2rem;
      }

      .input-btn {
        display: flex;
        flex: 2 1 0;
      }

      cc-input-text {
        flex: 1 1 0;
        /* TODO: test this */
        min-width: 20rem;
      }

      cc-button {
        /* TODO: handle bad i18n */
        width: 7rem;
      }
      
      .label {
        background-repeat: no-repeat;
      }
    `;
        // background-image: url(${unsafeCSS(deleteSvg)});
  }

  render () {

    const buttons = this.isDeleted
      ? html`<cc-button @click=${this._keepHandler}>${this.constructor.i18n.keepButton}</cc-button>`
      : html`<cc-button danger outlined @click=${this._deleteHandler}>${this.constructor.i18n.deleteButton}</cc-button>`;

    return html`
      <span class="label">
        <span class="icon">[${this.isDeleted ? 'D' : this.isNew ? 'N' : this.isEdited ? 'E' : ' '}]</span>
        ${this.name}
      </span>
      <span class="input-btn">
        <cc-input-text
          multi
          .value=${this.value}
          name=${this.name}
          ?disabled=${this.isDeleted}
          .placeholder=${this.constructor.i18n.valuePlaceholder}
          @input=${this._inputHandler}
        ></cc-input-text>
        ${buttons}
      </span>
    `;
  }

  _inputHandler (e) {
    this.value = e.target.value;
    this.isValid = dispatchCustomEvent(this, 'input', { name: this.name, value: this.value });
  }

  _deleteHandler () {
    dispatchCustomEvent(this, 'delete', { name: this.name });
  }

  _keepHandler () {
    dispatchCustomEvent(this, 'keep', { name: this.name });
  }
}

window.customElements.define('env-var-input', EnvVarInput);
