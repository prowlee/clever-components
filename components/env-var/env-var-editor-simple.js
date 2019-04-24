import './env-var-create.js';
import './env-var-input.js';
import { css, html, LitElement } from 'lit-element';
import { dispatchCustomEvent } from '../lib/events.js';
import { repeat } from 'lit-html/directives/repeat.js';

/**
 * A high level env var editor, edit variables one at a time + a create form
 *
 * @customElement env-var-editor-simple
 *
 * @event env-var-editor-simple:change - TODO
 *
 * @prop {Array} variables - TODO
 */
export class EnvVarEditorSimple extends LitElement {

  static get properties () {
    return {
      variables: { type: Array, attribute: false },
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
      env-var-create {
        margin-bottom: 2rem;
      }
    `;
  }

  render () {

    const variablesNames = this.variables.map(({ name }) => name);

    return html`
    <env-var-create .variablesNames="${variablesNames}" @env-var-create:create="${this._createHandler}"></env-var-create>
    
    ${repeat(
      this.variables,
      ({ name }) => name,
      ({ name, value, isNew, isEdited, isDeleted }) => {
        return html`<env-var-input
            name="${name}"
            value="${value}"
            ?is-new="${isNew}"
            ?is-edited="${isEdited}"
            ?is-deleted="${isDeleted}"
            @env-var-input:input=${this._inputHandler}
            @env-var-input:delete=${this._deleteHandler}
            @env-var-input:keep=${this._keepHandler}
          ></env-var-input>`;
      },
    )}
    `;
  }

  _createHandler ({ detail: newVar }) {
    this.variables = [...this.variables, newVar];
    dispatchCustomEvent(this, 'change', this.variables);
  }

  _inputHandler ({ detail: editedVar }) {
    this.variables = this.variables.map((v) => {
      return (v.name === editedVar.name)
        ? { ...v, value: editedVar.value }
        : v;
    });
    dispatchCustomEvent(this, 'change', this.variables);
  }

  _deleteHandler ({ detail: deletedVar }) {
    this.variables = this.variables
      .filter((v) => {
        return (v.name === deletedVar.name)
          ? (!v.isNew)
          : true;
      })
      .map((v) => {
        return (v.name === deletedVar.name)
          ? { ...v, isDeleted: true }
          : v;
      });
    dispatchCustomEvent(this, 'change', this.variables);
  }

  _keepHandler ({ detail: keptVar }) {
    this.variables = this.variables.map((v) => {
      return (v.name === keptVar.name)
        ? { ...v, isDeleted: false }
        : v;
    });
    dispatchCustomEvent(this, 'change', this.variables);
  }
}

window.customElements.define('env-var-editor-simple', EnvVarEditorSimple);
