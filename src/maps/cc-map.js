import '../atoms/cc-loader.js';
import '../molecules/cc-error.js';
import leaflet from 'leaflet';
// 'leaflet.heat' needs to be imported after 'leaflet'
import 'leaflet.heat';
import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { WORLD_GEOJSON } from '../assets/world-110m.geo.js';
import { i18n } from '../lib/i18n.js';
import { withResizeObserver } from '../mixins/with-resize-observer.js';
import { leafletStyles } from '../styles/leaflet.js';

/**
 * World map with two modes: blinking dots or heatmap.
 *
 * 🎨 default CSS display: `flex`
 * <br>
 * 🧐 [component's source code on GitHub](https://github.com/CleverCloud/clever-components/blob/master/src/maps/cc-map.js)
 *
 * ## Details
 *
 * * The component has a default height of 15rem and a default width 20rem but this can be overridden with CSS.
 * * When using `points`, you need to specify which HTML tag should be used to create and display the marker, this can be `img`, `div` or any custom element you defined in your page.
 * * If you need to set custom properties on the DOM element created for the marker, set them on the `Point` object.
 *
 * ## Type definitions
 *
 * ```js
 * interface Point {
 *   lat: number,           // Latitude
 *   lon: number,           // Longitude
 *   tag: string,           // The HTML tag name used as a marker
 *   tooltip?: string,      // Tooltip when the point is hovered
 *   // Additional specific properties
 * }
 * ```
 *
 * ```js
 * interface HeatmapPoint {
 *   lat: number,   // Latitude
 *   lon: number,   // Longitude
 *   count: number, // Number of occurences for this location
 * }
 * ```
 *
 * @prop {Number} centerLat - Sets the latitude center of the map.
 * @prop {Number} centerLon - Sets the longitude center of the map.
 * @prop {Boolean} error - Displays an error message (can be combined with `loading`).
 * @prop {HeatmapPoint[]} heatmapPoints - Sets the list of points used to draw the heatmap.
 * @prop {Boolean} loading - Displays a loader on top of the map (can be combined with `error`).
 * @prop {"points"|"heatmap"} mode - Sets map mode: `"points"` for points with custom markers and `"heatmap"` for a heatmap.
 * @prop {Point[]} points - Sets the list of points used to place markers.
 * @prop {Number} viewZoom - Sets the zoom of the map (between 1 and 6).
 *
 * @slot - The legend and/or details for the map (displayed at the bottom).
 */
export class CcMap extends withResizeObserver(LitElement) {

  static get properties () {
    return {
      centerLat: { type: Number, attribute: 'center-lat' },
      centerLon: { type: Number, attribute: 'center-lon' },
      error: { type: Boolean, reflect: true },
      heatmapPoints: { type: Array },
      loading: { type: Boolean, reflect: true },
      mode: { type: String },
      points: { type: Array },
      viewZoom: { type: Number, attribute: 'view-zoom', reflect: true },
    };
  }

  constructor () {
    super();
    // Centered on Paris by default
    this.centerLat = 48.9;
    this.centerLon = 2.4;
    this.error = false;
    this.loading = false;
    this.mode = 'points';
    this.viewZoom = 2;
    this._pointsCache = {};
  }

  get centerLat () {
    return this._centerLat;
  }

  get centerLon () {
    return this._centerLon;
  }

  get viewZoom () {
    return this._viewZoom;
  }

  get mode () {
    return this._mode;
  }

  get heatmapPoints () {
    return this._heatmapPoints;
  }

  get points () {
    return this._points;
  }

  set centerLat (newVal) {
    const oldVal = this._centerLat;
    this._centerLat = newVal;
    this.requestUpdate('centerLat', oldVal)
      .then(() => this._map.setView([newVal, this._centerLon]));
  }

  set centerLon (newVal) {
    const oldVal = this._centerLon;
    this._centerLon = newVal;
    this.requestUpdate('centerLon', oldVal)
      .then(() => this._map.setView([this._centerLat, newVal]));
  }

  set viewZoom (newVal) {
    const oldVal = this._viewZoom;
    this._viewZoom = newVal;
    this.requestUpdate('viewZoom', oldVal)
      .then(() => this._map.setZoom(newVal));
  }

  set mode (newVal) {
    const oldVal = this._mode;
    this._mode = newVal;
    this.requestUpdate('mode', oldVal)
      .then(() => this._resetCurrentLayer());
  }

  set heatmapPoints (newVal) {
    const oldVal = this._heatmapPoints;
    this._heatmapPoints = newVal;
    this.requestUpdate('heatmapPoints', oldVal)
      .then(() => this._updateHeatmap(newVal));
  }

  set points (newVal) {
    const oldVal = this._points;
    this._points = newVal;
    this.requestUpdate('points', oldVal)
      .then(() => this._updatePoints(newVal));
  }

  _resetCurrentLayer () {
    const [layerToAdd, layerToRemove] = (this.mode === 'heatmap')
      ? [this._heatLayer, this._pointsLayer]
      : [this._pointsLayer, this._heatLayer];
    this._map.removeLayer(layerToRemove);
    this._map.addLayer(layerToAdd);
  }

  _updateHeatmap (newPoints) {

    if (!Array.isArray(newPoints)) {
      return;
    }

    const counts = newPoints.map(({ count }) => count);
    const maxCount = (newPoints.length > 0)
      ? Math.max(...counts)
      : 1;

    const heatPoints = newPoints
      .map(({ lat, lon, count }) => [lat, lon, count]);

    const heatOptions = {
      blur: 7,
      max: maxCount,
      minOpacity: 0.3,
      radius: 8,
    };

    this._heatLayer
      .clearLayers()
      .addLayer(leaflet.heatLayer(heatPoints, heatOptions));
  }

  _updatePoints (newPoints) {

    if (!Array.isArray(newPoints)) {
      return;
    }

    const obsoleteIds = new Set(Object.keys(this._pointsCache));

    for (const point of newPoints) {
      const id = [point.lat, point.lon, point.tag].join(',');
      const old = this._pointsCache[id];
      if (old == null) {
        this._createMarker(id, point);
      }
      this._updateMarker(id);
      obsoleteIds.delete(id);
    }

    for (const id of obsoleteIds.values()) {
      this._deleteMarker(id);
    }
  }

  _createMarker (id, point) {

    // Prepare icon
    const iconElement = document.createElement(point.tag);
    const icon = leaflet.divIcon({
      html: iconElement,
      className: 'cc-map-marker',
    });

    // Create marker and add it to the map
    const marker = leaflet
      .marker([point.lat, point.lon], { icon })
      .addTo(this._pointsLayer);

    this._pointsCache[id] = { point, marker, iconElement };
  }

  _updateMarker (id) {

    const { point, marker, iconElement } = this._pointsCache[id];

    // Update marker icon element properties
    Object.entries(point).map(([k, v]) => iconElement[k] = v);

    // Create, update or delete tooltip
    if (point.tooltip == null) {
      marker.unbindTooltip();
    }
    else {
      if (marker.getTooltip() == null) {
        marker.bindTooltip(point.tooltip, { direction: 'top' });
      }
      else {
        marker.setTooltipContent(point.tooltip);
      }
    }
  }

  _deleteMarker (id) {
    const { marker } = this._pointsCache[id];
    this._pointsLayer.removeLayer(marker);
    delete this._pointsCache[id];
  }

  /**
   * @private
   */
  onResize () {
    this._map.invalidateSize();
  }

  // Draw the Leaflet map
  firstUpdated () {

    const leafletOptions = {
      // Block view on the world
      attributionControl: false,
      doubleClickZoom: true,
      dragging: true,
      keyboard: true,
      maxBounds: [[-84, -180], [90, 180]],
      maxBoundsViscosity: 1,
      maxZoom: 6,
      minZoom: 1,
      zoomControl: true,
    };

    // Init map
    this._map = leaflet
      .map(this.renderRoot.getElementById('cc-map-container'), leafletOptions)
      .setView([this._centerLat, this._centerLon], this._viewZoom);

    this._map.on('zoomanim', (e) => {
      this.viewZoom = e.zoom;
    });

    // Place zoom controls
    this._map.zoomControl.setPosition('bottomright');

    // Init world map from geojson data
    leaflet
      .geoJSON(WORLD_GEOJSON, {
        style: { className: 'map-country' },
        pane: 'tilePane',
      })
      .addTo(this._map);

    // Init layers
    this._pointsLayer = leaflet.layerGroup();
    this._heatLayer = leaflet.layerGroup();
    this._resetCurrentLayer();
  }

  render () {

    const noHeatmapPoints = (!this.error && this.mode === 'heatmap' && this.heatmapPoints != null && this.heatmapPoints.length === 0);
    const errorMode = this.loading ? 'loading' : 'info';

    return html`
      <div id="cc-map-container" class=${classMap({ 'no-data': noHeatmapPoints })}></div>
      <div class="legend ${classMap({ 'no-data': noHeatmapPoints })}"><slot></slot></div>
      ${this.loading && !this.error ? html`
      <cc-loader class="loader"></cc-loader>
    ` : ''}
      ${this.error || noHeatmapPoints ? html`
        <div class="msg-container">
          ${this.error ? html`
            <cc-error mode=${errorMode}>${i18n('cc-map.error')}</cc-error>
          ` : ''}
          ${noHeatmapPoints ? html`
            <div class="msg">${i18n('cc-map.no-points')}</div>
          ` : ''}
        </div>
      ` : ''}
    `;
  }

  static get styles () {
    return [
      leafletStyles,
      // language=CSS
      css`
        :host {
          display: flex;
          flex-direction: column;
          height: 15rem;
          position: relative;
          width: 20rem;
        }

        #cc-map-container {
          flex: 1 1 0;
          width: 100%;
        }

        :host([loading]) .leaflet-control-container,
        :host([error]) .leaflet-control-container {
          display: none;
        }

        :host([loading]) #cc-map-container,
        :host([error]) #cc-map-container,
        #cc-map-container.no-data,
        :host([loading]) .legend,
        :host([error]) .legend,
        .legend.no-data {
          filter: blur(.1rem);
        }

        .leaflet-container {
          background-color: #aadaff;
          z-index: 1;
        }

        .map-country {
          fill: #f5f5f5;
          fill-opacity: 1;
          stroke: #ddd;
          stroke-width: 1;
        }

        :host(:not(:empty)) .legend {
          background-color: #f1f5ff;
          box-shadow: inset 0 6px 6px -6px #a4b1c9;
          box-sizing: border-box;
          color: #2e2e2e;
          font-size: 0.9rem;
          font-style: italic;
          padding: 0.4rem 1rem;
        }

        .loader {
          height: 100%;
          left: 0;
          position: absolute;
          top: 0;
          width: 100%;
          /* Over Leaflet */
          z-index: 2000;
        }

        .msg-container {
          align-items: center;
          display: flex;
          height: 100%;
          justify-content: center;
          left: 0;
          position: absolute;
          top: 0;
          width: 100%;
          /* Over Leaflet */
          z-index: 2000;
        }

        cc-error,
        .msg {
          max-width: 80%;
        }

        .msg {
          align-items: center;
          background-color: white;
          border: 1px solid #bcc2d1;
          border-radius: 0.25rem;
          box-shadow: 0 0 1rem #aaa;
          display: flex;
          justify-content: center;
          padding: 1rem;
        }

        .cc-map-marker {
          align-items: center;
          display: flex;
          justify-content: center;
        }
      `,
    ];
  }
}

window.customElements.define('cc-map', CcMap);
