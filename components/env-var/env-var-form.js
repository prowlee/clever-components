import '../atoms/cc-button.js';
import './env-var-editor-expert.js';
import './env-var-editor-simple.js';
import { css, html, LitElement } from 'lit-element';
import { dispatchCustomEvent } from '../lib/events.js';
import i18n from '@i18n';

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
      _currentVariables: { type: Array, attribute: false },
      _expertVariables: { type: Array, attribute: false },
      _mode: { type: String, attribute: false },
    };
  }

  constructor () {
    super();
    this.variables = [];
    this._mode = 'SIMPLE';
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
    this._initVariables = variables;
    this._currentVariables = variables.sort((a, b) => a.name.localeCompare(b.name));
    this._expertVariables = variables.sort((a, b) => a.name.localeCompare(b.name));
  }

  render () {
    return html`
      <div class="mode-switcher">
        <label for="SIMPLE">${i18n('env-var-form.mode.simple')}</label>
        <input type="radio" name="mode" value="SIMPLE" id="SIMPLE" ?checked="${this._mode === 'SIMPLE'}" @change="${this._toggleModeHandler}">
        <label for="EXPERT">${i18n('env-var-form.mode.expert')}</label>
        <input type="radio" name="mode" value="EXPERT" id="EXPERT" ?checked="${this._mode === 'EXPERT'}" @change="${this._toggleModeHandler}">
      </div>
      
      <div class="editor">
        <env-var-editor-simple
          ?hidden="${this._mode !== 'SIMPLE'}"
          .variables="${this._currentVariables}"
          @env-var-editor-simple:change="${this._changeHandler}"
        ></env-var-editor-simple>
        
        <env-var-editor-expert
          ?hidden="${this._mode !== 'EXPERT'}"
          .variables="${this._expertVariables}"
          @env-var-editor-expert:change="${this._changeHandler}"
        ></env-var-editor-expert>
      </div>
      
      <div class="button-bar">
        <cc-button @click="${this._resetHandler}">${i18n('env-var-form.reset')}</cc-button>
        <cc-button success @click="${this._updateHandler}">${i18n('env-var-form.update')}</cc-button>
      </div>
    `;
  }

  _changeHandler ({ detail: changedVariables }) {

    const deletedVariables = this._initVariables
      .filter((initVar) => {
        const changedVar = changedVariables.find((v) => v.name === initVar.name);
        return (changedVar == null || changedVar.isDeleted) && !initVar.isNew;
      })
      .map((v) => ({ ...v, isDeleted: true }));

    const newVariables = changedVariables
      .filter((changedVar) => {
        const initVar = this._initVariables.find((v) => v.name === changedVar.name);
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
        const initVar = this._initVariables.find((v) => v.name === changedVar.name);
        const isEdited = initVar.value !== changedVar.value;
        return ({ ...changedVar, isEdited });
      });

    this._currentVariables = [...deletedVariables, ...newVariables, ...otherVariables].sort((a, b) => a.name.localeCompare(b.name));
  }

  _toggleModeHandler (e) {
    if (e.target.value === 'EXPERT') {
      this._expertVariables = this._currentVariables;
    }
    this._mode = e.target.value;
  }

  _resetHandler () {
    this.variables = this._initVariables;
  }

  _updateHandler () {
    dispatchCustomEvent(this, 'submit', this._currentVariables);
  }
}

window.customElements.define('env-var-form', EnvVarForm);
