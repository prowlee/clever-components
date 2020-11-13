import { css, html, LitElement } from 'lit-element';
import { assetUrl } from '../lib/asset-url.js';
import { i18n } from '../lib/i18n.js';
import {dispatchCustomEvent} from "../lib/events";
import "../atoms/cc-img.js";

// DOCS: You may prepare URLs for assets like SVG files here:
const warningSvg = assetUrl(import.meta, '../assets/warning.svg');
const noRedirectionSvg = assetUrl(import.meta, '../assets/redirection-off.svg');

/**
 * A component doing X and Y (one liner description of your component).
 *
 * * 🎨 default CSS display: `block`
 * <br>
 * 🧐 [component's source code on GitHub](https://github.com/CleverCloud/clever-components/blob/master/src/dir/cc-example-component.js)
 *
 * ## Details
 *
 * * Details about bla.
 * * Details about bla bla.
 * * Details about bla bla bla.
 *
 * ## Technical details
 *
 * * Technical details about foo.
 * * Technical details about bar.
 * * Technical details about baz.
 *
 * ## Type definitions
 *
 * ```js
 * interface Plan {
 *   name: string,
 *   price: number,
 *   features: feature[],
 * }
 * ```
 *
 * ```js
 * interface Feature {
 *   name: string,
 *   ?value: number|string,
 * }
 * ```
 * ## Images
 *
 * | | |
 * |-------|------|
 * | <img src="/src/assets/warning.svg" style="height: 1.5rem; vertical-align: middle"> | <code>warning.svg</code>
 * | <img src="/src/assets/redirection-off.svg" style="height: 1.5rem; vertical-align: middle"> | <code>redirection-off.svg</code>
 *
 * @prop {String} icon - Sets the url of the logo before the title.
 * @prop {String} title - Sets the title of the table.
 * @prop {Boolean} error - Set if there was an error while retrieving data.
 * @prop {Boolean} skeleton - Enables skeleton screen UI pattern (loading hint).
 * @prop {String} shortDesc - Sets a short desc about what the table is about.
 * @prop { Array<Plan> } plans - Sets the data needed for the content of the table
 * @prop { Array<Feature> } features - Sets the data needed for the content of the table
 *
 * @event {CustomEvent<ExampleInterface>} cc-pricing-table:add-plan - Fires XXX whenever YYY.
 *
 * @slot - The content of the button (text or HTML). If you want an image, please look at the `image` attribute.
 *
 * @cssprop {Color} --cc-loader-color - The color of the animated circle (defaults: `#2653af`).
 */
export class CcPricingTable extends LitElement {

  static get properties () {
    return {
      icon: { type: String },
      title: { type: String },
      error: { type: Boolean },
      skeleton: { type: Boolean },
      shortDesc: { type: String, attribute: 'short-desc' },
      plans: { type: Array },
      features: { type: Array },
    };
  }

  constructor () {
    super();
    this.error = false;
    this.skeleton = false;
  }

  /**
   * Format every plan into a table row with their properties transformed into table data
   * @returns {Array<html>} returns a formatted array with all the plan and their features associated
   */
  _renderPlans () {
    return this.plans.map((plan) => {
      return html`<tr>
            <td><button @click=${() => this._onAddPlan(plan.name)}>Add</button></td>
            <td>${plan.name}</td>
            ${this._renderPlanFeatures(plan.features)}
            <td id="price-plan">${i18n('cc-pricing-table.price', { price: plan.price })}</td>
           </tr>`;
    });
  }

  /**
   * Loop through every global feature and put the feature that we have in the plan at the correct place
   * (this step is mandatory because the order of the global features can be in a different order than the one that
   * we have in the features for a plan)
   * @returns {Array<html>} returns for a plan all the features formatted and in the correct order
   */
  _renderPlanFeatures (planFeatures) {
    return this.features.map((feature) => {
      const value = planFeatures.find((planFeature) => feature.name === planFeature.name).value;
      return html`<td>${value}</td>`;
    });
  }

  // DOCS: 7. Event handlers

  // If you listen to an event in your `render()` function,
  // use a private method to handle the event and prefix it with `_on`.
  _onAddPlan (planName) {
    dispatchCustomEvent(this, 'add-plan', { planName });
  }

  render () {

    return html`
     <div class="head">
        <cc-img src="${this.icon}" alt="${this.title}-logo"></cc-img>
        <div class="title">${this.title}</div>
     </div>
     <div class="description">${this.shortDesc}</div>
     <table>
        <tr>
            <th></th>
            <th>Plan</th>
            ${this.features.map((feature) => html`<th>${feature.name}</th>`)}
            <th>Price</th>
        </tr> 
            ${this._renderPlans()}
     </table>
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          display: grid;
          gap: 1rem;
          box-shadow: 0 0 0.5rem #aaa;
        } 
        
        .head {
          display: flex;
          align-items: center;
          padding: 1rem 1rem 0 1rem;
        }
        
        .title {
          font-size: 1.5rem;
          font-weight: bold;
        }
        
        .description {
          padding: 0 1rem;
        }
        
        cc-img {
          height: 3rem;
          width: 3rem;
          border-radius: 0.25rem;
          margin-right: 1rem;
        }
        
        table {
          border-collapse: collapse;
          font-family: arial, sans-serif;
          width: 100%;
        }

        td, th {
          border: 1px solid #dddddd;
          padding: 8px;
          text-align: left;
        }

        tr:nth-child(even) {
          background-color: #dddddd;
        }
        
        #price-plan {
            text-align: right;
        }
      `,
    ];
  }
}

window.customElements.define('cc-pricing-table', CcPricingTable);
