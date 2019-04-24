import '../atoms/cc-button.js';
import '../atoms/cc-input-text.js';
import envVarUtils from '../lib/env-vars.js';
import initI18n from '../lib/i18n.js';
import { css, html, LitElement } from 'lit-element';
import { dispatchCustomEvent } from '../lib/events';

const i18n = initI18n({
  'env-var-create.name.placeholder': 'ENV_VAR_NAME',
  'env-var-create.value.placeholder': 'env var value',
  'env-var-create.create-button': 'Create',
  'env-var-create.errors.invalid-name': ({ name }) => html`Name <code>${name}</code> is invalid`,
  'env-var-create.errors.already-defined-name': ({ name }) => html`Name <code>${name}</code> is already defined`,
});

const variableName = Symbol();
const variableValue = Symbol();

export class EnvVarCreate extends LitElement {

  static get properties () {
    return {
      variablesNames: { type: Array, attribute: false },
      [variableName]: { type: String, attribute: false },
      [variableValue]: { type: String, attribute: false },
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

    const isNameInvalid = !envVarUtils.validateName(this[variableName]);
    const isNameAlreadyDefined = this.variablesNames.includes(this[variableName]);
    const hasErrors = isNameInvalid || isNameAlreadyDefined;

    return html`
      <div class="wrapper">
        <cc-input-text
          id="name-input"
          name="name"
          .value="${this[variableName]}"
          placeholder="${i18n(`env-var-create.name.placeholder`)}"
          @cc-input-text:input="${this.nameInputHandler}"
        ></cc-input-text>
        <span class="input-btn">
          <cc-input-text
            multi
            name="value"
            .value="${this[variableValue]}"
            placeholder="${i18n(`env-var-create.value.placeholder`)}"
            @cc-input-text:input="${this.valueInputHandler}"
          ></cc-input-text>
          <cc-button
            primary
            ?disabled="${hasErrors}"
            @click=${this.submitHandler}
          >${i18n(`env-var-create.create-button`)}</cc-button>
        </span>
      </div>
      <div ?hidden="${!isNameInvalid || this[variableName] === ''}">
        ${i18n(`env-var-create.errors.invalid-name`, { name: this[variableName] })}  
      </div>
      <div ?hidden="${!isNameAlreadyDefined}">
        ${i18n(`env-var-create.errors.already-defined-name`, { name: this[variableName] })}  
      </div>
    `;
  }

  nameInputHandler ({ detail }) {
    this[variableName] = detail.value;
  }

  valueInputHandler ({ detail }) {
    this[variableValue] = detail.value;
  }

  submitHandler (e) {
    dispatchCustomEvent(this, 'create', {
      name: this[variableName],
      value: this[variableValue],
    });
    this.reset();
    this.shadowRoot.getElementById('name-input').focus();
  }

  reset () {
    this[variableName] = '';
    this[variableValue] = '';
  }
}

window.customElements.define('env-var-create', EnvVarCreate);

