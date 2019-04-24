import '../atoms/cc-button.js';
import './env-var-editor-expert.js';
import './env-var-editor-simple.js';
import { css, html, LitElement } from 'lit-element';
import { dispatchCustomEvent } from '../lib/events.js';

const initVariables = Symbol();
const currentVariables = Symbol();
const expertVariables = Symbol();
const mode = Symbol();

/**
 * A high level env var editor form, wraps simple editor and expert editor
 *
 * @customElement env-var-form
 *
 * @event env-var-form:submit - TODO
 *
 * @prop {Array} variables - TODO
 */
export class EnvVarForm extends LitElement {

  static get properties () {
    return {
      variables: { type: Array, attribute: false },
      [currentVariables]: { type: Array, attribute: false },
      [expertVariables]: { type: Array, attribute: false },
      [mode]: { type: String, attribute: false },
    };
  }

  constructor () {
    super();
    this.variables = [];
    this[mode] = 'SIMPLE';
  }

  static get styles () {
    // language=CSS
    return css`
      :host {
        display: block;
        background: #fff;
        border-radius: 0.25rem;
        border: 1px solid #bcc2d1;
        padding: 1rem;
      }
      .mode-switcher,
      .editor {
        margin-bottom: 2rem;
      }
      .button-bar {
        display: flex;
        justify-content: space-between;
      }
    `;
  }

  set variables (variables) {
    this[initVariables] = variables;
    this[currentVariables] = variables.sort((a, b) => a.name.localeCompare(b.name));
    this[expertVariables] = variables.sort((a, b) => a.name.localeCompare(b.name));
  }

  render () {
    return html`
      <div class="mode-switcher">
        <label for="SIMPLE">Simple</label>
        <input type="radio" name="mode" value="SIMPLE" id="SIMPLE" ?checked="${this[mode] === 'SIMPLE'}" @change="${this.toggleModeHandler}">
        <label for="EXPERT">Expert</label>
        <input type="radio" name="mode" value="EXPERT" id="EXPERT" ?checked="${this[mode] === 'EXPERT'}" @change="${this.toggleModeHandler}">
      </div>
      
      <div class="editor">
        <env-var-editor-simple
          ?hidden="${this[mode] !== 'SIMPLE'}"
          .variables="${this[currentVariables]}"
          @env-var-editor-simple:change="${this.changeHandler}"
        ></env-var-editor-simple>
        
        <env-var-editor-expert
          ?hidden="${this[mode] !== 'EXPERT'}"
          .variables="${this[expertVariables]}"
          @env-var-editor-expert:change="${this.changeHandler}"
        ></env-var-editor-expert>
      </div>
      
      <div class="button-bar">
        <cc-button @click="${this.resetHandler}">reset</cc-button>
        <cc-button success @click="${this.updateHandler}">save changes</cc-button>
      </div>
    `;
  }

  changeHandler ({ detail: changedVariables }) {

    const deletedVariables = this[initVariables]
      .filter((initVar) => {
        const changedVar = changedVariables.find((v) => v.name === initVar.name);
        return (changedVar == null || changedVar.isDeleted) && !initVar.isNew;
      })
      .map((v) => ({ ...v, isDeleted: true }));

    const newVariables = changedVariables
      .filter((changedVar) => {
        const initVar = this[initVariables].find((v) => v.name === changedVar.name);
        return initVar == null;
      })
      .map((v) => ({ ...v, isNew: true }));

    const otherVariables = changedVariables
      .filter((changedVar) => {
        const isDeleted = deletedVariables.find((v) => v.name === changedVar.name);
        const isNew = newVariables.find((v) => v.name === changedVar.name);
        return !isDeleted && !isNew;
      })
      .map((changedVar) => {
        const initVar = this[initVariables].find((v) => v.name === changedVar.name);
        const isEdited = initVar.value !== changedVar.value;
        return ({ ...changedVar, isEdited });
      });

    this[currentVariables] = [...deletedVariables, ...newVariables, ...otherVariables].sort((a, b) => a.name.localeCompare(b.name));
  }

  toggleModeHandler (e) {
    if (e.target.value === 'EXPERT') {
      this[expertVariables] = this[currentVariables];
    }
    this[mode] = e.target.value;
  }

  resetHandler () {
    this.variables = this[initVariables];
  }

  updateHandler () {
    dispatchCustomEvent(this, 'submit', this[currentVariables]);
  }
}

window.customElements.define('env-var-form', EnvVarForm);
