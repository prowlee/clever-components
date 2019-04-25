import '../atoms/cc-button.js';
import '../atoms/cc-input-text.js';
import envVarUtils from '../lib/env-vars.js';
import { css, html, LitElement } from 'lit-element';
import { dispatchCustomEvent } from '../lib/events';
import i18n from '@i18n';

export class EnvVarCreate extends LitElement {

  static get properties () {
    return {
      variablesNames: { type: Array, attribute: false },
      _variableName: { type: String, attribute: false },
      _variableValue: { type: String, attribute: false },
    };
  }

  constructor () {
    super();
    this.variablesNames = [];
    this.reset();
  }

  static get styles () {
    // language=CSS
    return css`
      :host {
        display: block;
      }

      .wrapper {
        display: flex;
        flex-wrap: wrap;
        padding: 0.25rem;
        padding: 0rem;
        width: 100%
      }

      cc-input-text[name=name] {
        flex: 1 1 0;
        min-width: 10rem;
      }

      .input-btn {
        display: flex;
        flex: 2 1 0;
      }

      cc-input-text[name=value] {
        flex: 1 1 0;
        min-width: 20rem;
      }

      cc-button {
        /* TODO: handle bad i18n */
        width: 7rem;
      }
    `;
  }

  render () {

    const isNameInvalid = !envVarUtils.validateName(this._variableName);
    const isNameAlreadyDefined = this.variablesNames.includes(this._variableName);
    const hasErrors = isNameInvalid || isNameAlreadyDefined;

    return html`
      <div class="wrapper">
        <cc-input-text
          id="name-input"
          name="name"
          .value="${this._variableName}"
          placeholder="${i18n(`env-var-create.name.placeholder`)}"
          @cc-input-text:input="${this._nameInputHandler}"
        ></cc-input-text>
        <span class="input-btn">
          <cc-input-text
            multi
            name="value"
            .value="${this._variableValue}"
            placeholder="${i18n(`env-var-create.value.placeholder`)}"
            @cc-input-text:input="${this._valueInputHandler}"
          ></cc-input-text>
          <cc-button
            primary
            ?disabled="${hasErrors}"
            @click=${this._submitHandler}
          >${i18n(`env-var-create.create-button`)}</cc-button>
        </span>
      </div>
      <div ?hidden="${!isNameInvalid || this._variableName === ''}">
        ${i18n(`env-var-create.errors.invalid-name`, { name: this._variableName })}  
      </div>
      <div ?hidden="${!isNameAlreadyDefined}">
        ${i18n(`env-var-create.errors.already-defined-name`, { name: this._variableName })}  
      </div>
    `;
  }

  _nameInputHandler ({ detail }) {
    this._variableName = detail.value;
  }

  _valueInputHandler ({ detail }) {
    this._variableValue = detail.value;
  }

  _submitHandler (e) {
    dispatchCustomEvent(this, 'create', {
      name: this._variableName,
      value: this._variableValue,
    });
    this.reset();
    this.shadowRoot.getElementById('name-input').focus();
  }

  reset () {
    this._variableName = '';
    this._variableValue = '';
  }
}

window.customElements.define('env-var-create', EnvVarCreate);

