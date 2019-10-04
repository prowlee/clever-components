import { classMap } from 'lit-html/directives/class-map.js';
import { css, html, LitElement } from 'lit-element';
import { dispatchCustomEvent } from '../lib/events.js';
import { skeleton } from '../styles/skeleton.js';

/**
 * A text input (with optional multiline support)
 *
 * ## Details
 *
 * * uses a native `<input>` element by default and a `<textarea>` element when `multi` is true
 *
 * @fires cc-input-text:input - mirrors native input/textarea events with the `value` on `detail`
 *
 * @attr {Boolean} disabled - same as native a input/textarea element
 * @attr {Boolean} readonly - same as native a input/textarea element
 * @attr {Boolean} skeleton - enable skeleton screen UI pattern (loading hint)
 * @attr {Boolean} multi - enable multiline support (with a textarea)
 * @attr {String} value - same as native a input/textarea element
 * @attr {String} name - same as native a input/textarea element
 * @attr {String} placeholder - same as native a input/textarea element
 */
export class CcInputText extends LitElement {

  static get properties () {
    return {
      disabled: { type: Boolean },
      readonly: { type: Boolean },
      skeleton: { type: Boolean },
      multi: { type: Boolean },
      value: { type: String },
      name: { type: String },
      placeholder: { type: String },
    };
  }

  constructor () {
    super();
    this.name = '';
    this.value = '';
    this.placeholder = '';
  }

  focus () {
    this.shadowRoot.querySelector('.input').focus();
  }

  _onInput (e) {
    this.value = e.target.value;
    dispatchCustomEvent(this, 'input', this.value);
  }

  _onFocus (e) {
    if (this.readonly) {
      e.target.select();
    }
  }

  // Stop propagation of keydown and keypress events (to prevent conflicts with shortcuts)
  _stopPropagation (e) {
    e.stopPropagation();
  }

  render () {

    const rows = (this.value || '').split('\n').length;

    if (this.multi) {
      return html`<textarea
        class="input ${classMap({ skeleton: this.skeleton })}"
        style="--rows: ${rows}"
        rows=${rows}
        ?disabled=${this.disabled || this.skeleton}
        ?readonly=${this.readonly}
        .value=${this.value}
        name=${this.name}
        placeholder=${this.placeholder}
        @input=${this._onInput}
        @focus=${this._onFocus}
        spellcheck="false"
        @keydown=${this._stopPropagation}
        @keypress=${this._stopPropagation}
      ></textarea>`;
    }
    return html`<input type="text"
      class="input ${classMap({ skeleton: this.skeleton })}"
      ?disabled=${this.disabled || this.skeleton} 
      ?readonly=${this.readonly}
      .value=${this.value}
      name=${this.name}
      placeholder=${this.placeholder}
      @input=${this._onInput}
      @focus=${this._onFocus}
      spellcheck="false"
      @keydown=${this._stopPropagation}
      @keypress=${this._stopPropagation}
    >`;
  }

  static get styles () {
    return [
      skeleton,
      // language=CSS
      css`
        :host {
          display: inline-block;
          box-sizing: border-box;
          padding: 0.2rem;
          vertical-align: top;
        }

        :host([multi]) {
          display: block;
        }

        :host([skeleton]) {
          cursor: progress;
        }

        /* RESET */
        .input {
          /* remove Safari box shadow */
          -webkit-appearance: none;
          background: #fff;
          border: 1px solid #000;
          box-sizing: border-box;
          display: block;
          font-family: "SourceCodePro", "monaco", monospace;
          font-size: 14px;
          margin: 0;
          padding: 0;
          resize: none;
          width: 100%;
        }

        /* BASE */
        .input {
          border-color: #aaa;
          border-radius: 0.25rem;
          height: 2rem;
          line-height: 1.7rem;
          overflow: hidden;
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

        .skeleton {
          background-color: #eee;
          border-color: #eee;
        }

        .skeleton::placeholder {
          color: transparent;
        }

        /* TRANSITIONS */
        .input {
          box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
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
        }
      `,
    ];
  }
}

window.customElements.define('cc-input-text', CcInputText);
