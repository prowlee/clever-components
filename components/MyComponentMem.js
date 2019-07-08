import { html, LitElement } from 'lit-element';
import { memoizeMethods } from './lib/utils';

/**
 * (Component description)
 *
 * (details about the component)
 *
 * @customElement my-component
 *
 * @event eventName - Event description
 *
 * @attr {Type} attr-name - Attribute description
 */

export class MyComponentMem extends LitElement {

  static get properties () {
    return {
      _theClick: { type: Number, attribute: false },
      _theString: { type: String, attribute: false },
      _theBase64: { type: String, attribute: false },
    };
  }

  constructor () {
    super();
    this._theClick = 0;
  }

  _onClick () {
    this._theClick += 1;
    this._theString = (this._theClick % 5) === 0 ? 'Oh Yeah' : 'Oh No';
  }

  get _theBase64 () {
    return this._btoa(this._theString);
  }

  _btoa (text) {
    return btoa(text);
  }

  render () {
    return html`
      <button @click=${this._onClick}>click</button>
      <div>theClick: ${this._theClick}</div>
      <div>theString: ${this._theString}</div>
      <div>theBase64: ${this._theBase64}</div>
    `;
  }

  static get styles () {
    return [];
  }
}

memoizeMethods(MyComponentMem, MyComponentMem.prototype._btoa);

window.customElements.define('my-component-mem', MyComponentMem);
