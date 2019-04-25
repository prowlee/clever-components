import '../atoms/cc-input-text.js';
import envVarUtils from '../lib/env-vars.js';
import { css, html, LitElement } from 'lit-element';
import { dispatchCustomEvent } from '../lib/events.js';
import i18n from '@i18n';

/**
 * A high level env var editor, edit all vars at once with a big string that is parsed and provides error messages
 *
 * @customElement env-var-editor-expert
 *
 * @event env-var-editor-expert:change - TODO
 *
 * @prop {Array} variables - TODO
 * @prop {Array} _variablesAsText - TODO
 */
export class EnvVarEditorExpert extends LitElement {

  static get properties () {
    return {
      variables: { type: Array, attribute: false },
      _variablesAsText: { type: Array, attribute: false },
      _formattedErrors: { type: Array, attribute: false },
    };
  }

  constructor () {
    super();
    this.variables = [];
  }

  static get styles () {
    // language=CSS
    return css`
      :host {
        display: block;
      }

      :host([hidden]) {
        display: none;
      }
    `;
  }

  set variables (variables) {
    const filteredVariables = variables
      .filter(({ isDeleted }) => !isDeleted);
    this._variablesAsText = envVarUtils.toNameEqualsValueString(filteredVariables);
    this._errors = [];
  }

  set _errors (rawErrors) {
    this._formattedErrors = rawErrors.map(({ type, name, pos }) => {
      if (type === envVarUtils.ERROR_TYPES.INVALID_NAME) {
        return {
          line: pos.line,
          msg: i18n('env-var-editor-expert.errors.invalid-name', { name }),
        };
      }
      if (type === envVarUtils.ERROR_TYPES.DUPLICATED_NAME) {
        return {
          line: pos.line,
          msg: i18n('env-var-editor-expert.errors.duplicated-name', { name }),
        };
      }
      if (type === envVarUtils.ERROR_TYPES.INVALID_LINE) {
        return {
          line: pos.line,
          msg: i18n('env-var-editor-expert.errors.invalid-line'),
        };
      }
      if (type === envVarUtils.ERROR_TYPES.INVALID_VALUE) {
        return {
          line: pos.line,
          msg: i18n('env-var-editor-expert.errors.invalid-value'),
        };
      }
      return { line: '?', msg: i18n('env-var-editor-expert.errors.unknown') };
    });
  }

  render () {
    return html`
      <cc-input-text
        multi
        .value="${this._variablesAsText}"
        @cc-input-text:input=${this._inputHandler}
      ></cc-input-text>
      
      <ul ?hidden="${this._formattedErrors.length === 0}">
        ${this._formattedErrors.map(({ line, msg }) => html`
          <li><strong>line ${line}:</strong> ${msg}</li>
        `)}
      </ul>
      <div ?hidden="${this._formattedErrors.length > 0}">${i18n('env-var-editor-expert.errors.none')}</div>
    `;
  }

  _inputHandler ({ detail }) {
    const { variables, errors } = envVarUtils.parseRaw(detail.value);
    this._errors = errors;
    if (errors.length === 0) {
      dispatchCustomEvent(this, 'change', variables);
    }
  }
}

window.customElements.define('env-var-editor-expert', EnvVarEditorExpert);
