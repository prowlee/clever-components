import '../atoms/cc-input-text.js';
import envVarUtils from '../lib/env-vars.js';
import { dispatchCustomEvent } from '../lib/events.js';
import { css, html, LitElement } from 'lit-element';

const varsAsText = Symbol();
const errors = Symbol();
const formattedErrors = Symbol();

/**
 * A high level env var editor, edit all vars at once with a big string that is parsed and provides error messages
 *
 * @customElement env-var-editor-expert
 *
 * @event env-var-editor-expert:change - TODO
 *
 * @prop {Array} variables - TODO
 */
export class EnvVarEditorExpert extends LitElement {

  static get properties () {
    return {
      variables: { type: Array, attribute: false },
      [varsAsText]: { type: Array, attribute: false },
      [formattedErrors]: { type: Array, attribute: false },
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
    this[varsAsText] = envVarUtils.toNameEqualsValueString(filteredVariables);
    this.setErrors([]);
  }

  setErrors (rawErrors) {
    this[formattedErrors] = rawErrors.map(({ type, name, pos }) => {
      if (type === envVarUtils.ERROR_TYPES.INVALID_NAME) {
        return {
          line: pos.line,
          msg: html`<code>${name}</code> is not a valid variable name`,
        };
      }
      if (type === envVarUtils.ERROR_TYPES.DUPLICATED_NAME) {
        return {
          line: pos.line,
          msg: html`be careful, the name <code>${name}</code> is already defined`,
        };
      }
      if (type === envVarUtils.ERROR_TYPES.INVALID_LINE) {
        return {
          line: pos.line,
          msg: html`this line is not valid, the correct pattern is <code>KEY="VALUE"</code>`,
        };
      }
      if (type === envVarUtils.ERROR_TYPES.INVALID_VALUE) {
        return {
          line: pos.line,
          msg: html`the value is not valid, if you use quotes, you need to escape them like this <code>\\"</code> or quote the whole value.`,
        };
      }
      return { line: '?', msg: 'Unknown Error' };
    });
  }

  render () {
    return html`
      <cc-input-text
        multi
        .value="${this[varsAsText]}"
        @cc-input-text:input=${this.inputHandler}
      ></cc-input-text>
      
      <ul ?hidden="${this[formattedErrors].length === 0}">
        ${this[formattedErrors].map(({ line, msg }) => html`
          <li><strong>line ${line}:</strong> ${msg}</li>
        `)}
      </ul>
      <div ?hidden="${this[formattedErrors].length > 0}">no errors</div>
    `;
  }

  inputHandler ({ detail }) {
    const { variables, errors } = envVarUtils.parseRaw(detail.value);
    this.setErrors(errors);
    if (errors.length === 0) {
      dispatchCustomEvent(this, 'change', variables);
    }
  }
}

window.customElements.define('env-var-editor-expert', EnvVarEditorExpert);
