import { css, html, LitElement } from 'lit-element';
import { dispatchCustomEvent } from '../lib/events';

/**
 * Simple text input for Clever Cloud
 *
 * ## Details
 *
 * * uses a native input element by default and a textarea element when `multi` is true
 *
 * @customElement cc-text-input
 *
 * @event cc-text-input:input - mirrors native input/textarea events with `{ value: 'the value' }` as `detail`
 *
 * @attr {Boolean} disabled - same as native a input/textarea element
 * @attr {Boolean} readonly - same as native a input/textarea element
 * @attr {Boolean} multi - enable multiline support (with a textarea)
 * @attr {String} value - same as native a input/textarea element
 * @attr {String} name - same as native a input/textarea element
 * @attr {String} placeholder - same as native a input/textarea element
 *
 */
export class CcInputText extends LitElement {

  static get properties () {
    return {
      disabled: { type: Boolean },
      readonly: { type: Boolean },
      multi: { type: Boolean },
      value: { type: String },
      name: { type: String },
      placeholder: { type: String },
    };
  }

  constructor () {
    super();
    this.value = '';
    this.placeholder = '';
  }

  static get styles () {
    // language=CSS
    return css`
      :host {
        display: inline-block;
        box-sizing: border-box;
        padding: 0.2rem;
        vertical-align: top;
      }

      :host([multi]) {
        display: block;
      }

      /* RESET */
      .input {
        background: #fff;
        border: 1px solid #000;
        box-sizing: border-box;
        display: block;
        font-family: monospace;
        font-size: 14px;
        margin: 0;
        padding: 0;
        resize: none;
        width: 100%;
      }

      /* BASE */
      .input {
        border-radius: 0.25rem;
        border-color: #aaa;
        height: 2rem;
        line-height: 1.7rem;
        padding: 0.15rem 0.5rem;
      }

      /* STATES */
      .input:focus {
        box-shadow: 0 0 0 .2em rgba(50, 115, 220, .25);
        border-color: #777;
        outline: 0;
      }

      .input:hover {
        border-color: #777;
      }

      .input:active {
        outline: 0;
      }

      .input[disabled] {
        background: #eee;
        border-color: #eee;
        cursor: default;
        opacity: .75;
        pointer-events: none;
      }

      .input[readonly] {
        background: #eee;
      }

      /* TRANSITIONS */
      .input {
        box-shadow: 0 0 0 .0 rgba(255, 255, 255, 0);
        transition: all 75ms ease-in-out, height 0ms;
      }

      /* MULTILINE BEHAVIOUR */
      /* TODO: this needs improvement */
      .input[rows] {
        height: calc(calc(calc(var(--rows, 1) * 1.7rem) + 0.3rem) + 2px);
        white-space: pre;
      }

      .input[rows="1"] {
        height: 2rem;
        overflow-y: hidden
      }
    `;
  }

  render () {

    const rows = (this.value || '').split('\n').length;

    if (this.multi) {
      return html`<textarea
        class="input"
        style="--rows: ${rows}"
        rows="${rows}"
        ?disabled="${this.disabled}"
        ?readonly="${this.readonly}"
        .value="${this.value}"
        name="${this.name}"
        placeholder="${this.placeholder}"
        @input=${this._inputHandler}
        @focus=${this._focusHandler}
        spellcheck="false"
        @keydown=${this._stopPropagation}
      ></textarea>`;
    }
    return html`<input type="text"
      class="input"
      ?disabled="${this.disabled}" 
      ?readonly="${this.readonly}" 
      .value="${this.value}"
      placeholder="${this.placeholder}"
      @input=${this._inputHandler}
      @focus=${this._focusHandler}
      spellcheck="false"
      @keydown=${this._stopPropagation}
    >`;
  }

  _inputHandler (e) {
    this.value = e.target.value;
    dispatchCustomEvent(this, 'input', {
      value: this.value,
    });
  }

  // Stop propagation of keydown events (to prevent conflicts with shortcuts)
  _stopPropagation (e) {
    e._stopPropagation();
  }

  _focusHandler (e) {
    if (this.readonly) {
      e.target.select();
    }
  }

  focus () {
    this.shadowRoot.querySelector('.input').focus();
  }
}

window.customElements.define('cc-input-text', CcInputText);
