import '../../src/maps/cc-map.js';
import fakeHeatmapData from '../assets/24-hours-points.json';
import { makeStory, storyWait } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

const spreadDuration = 5000;
const delay = spreadDuration + 2000;

const points = [
  { lat: 48.8, lon: 2.3, tooltip: 'Paris' },
  { lat: 50.6, lon: 3.1, tooltip: 'Lille' },
  { lat: 47.2, lon: -1.6, tooltip: 'Nantes' },
  { lat: 45.7, lon: 4.7, tooltip: 'Lyon' },
];

const blinkingDots = points.map((p, i) => ({ ...p, count: 10 ** i, tag: 'cc-map-marker-dot' }));

export default {
  title: '🛠 Maps/<cc-map>',
  component: 'cc-map',
};

const conf = {
  component: 'cc-map',
  // language=CSS
  css: `
    cc-map {
      display: inline-flex;
      margin-bottom: 1rem;
      margin-right: 1rem;
      vertical-align: bottom;
    }
  `,
};

export const defaultStory = makeStory(conf, {
  items: [
    { innerHTML: 'Blinking dots', points: blinkingDots },
    { mode: 'heatmap', innerHTML: 'Heatmap', heatmapPoints: fakeHeatmapData },
  ],
});

export const emptyWithLegendInSlot = makeStory(conf, {
  items: [{ innerHTML: 'Map with legend' }],
});

export const emptyWithDifferentSizes = makeStory(conf, {
  items: [
    { style: 'height:10rem; width:30rem' },
    { style: 'height:20rem; width:15rem' },
  ],
});

export const emptyWithDifferentCentersAndZooms = makeStory(conf, {
  docs: 'Centered on New York and Hong Kong.',
  items: [
    { centerLat: '40.7', centerLon: '-74', viewZoom: '2' },
    { centerLat: '22.4', centerLon: '114.2', viewZoom: '4' },
  ],
});

export const emptyWithHeatmap = makeStory(conf, {
  items: [{
    viewZoom: '2',
    mode: 'heatmap',
    heatmapPoints: [],
    innerHTML: `Heatmap simulation with no data points`,
  }],
});

export const loading = makeStory(conf, {
  docs: 'Without and with legend.',
  items: [
    { loading: true },
    { loading: true, innerHTML: 'Map with legend' },
  ],
});

export const error = makeStory(conf, {
  docs: 'Without and with legend.',
  items: [
    { error: true },
    { error: true, innerHTML: 'Map with legend' },
  ],
});

export const errorWithLoadingIndicator = makeStory(conf, {
  docs: 'Without and with legend.',
  items: [
    { loading: true, error: true },
    { loading: true, error: true, innerHTML: 'Map with legend' },
  ],
});

export const pointsWithDots = makeStory(conf, {
  name: '👍 Points (blinking dots with tooltips)',
  items: [{ points: blinkingDots }],
});

export const pointsWithServers = makeStory(conf, {
  name: '👍 Points (servers)',
  items: [{ points: points.map((p, i) => ({ ...p, tooltip: null, enabled: i === 2, tag: 'cc-map-marker-server' })) }],
});

export const pointsWithDotsNoTooltips = makeStory(conf, {
  name: '👍 Points (blinking dots without tooltips)',
  items: [{ points: blinkingDots.map((p) => ({ ...p, tooltip: null })) }],
});

export const simulationWithUpdatesOnSameDot = makeStory(conf, {
  items: [{
    viewZoom: '2',
    mode: 'points',
    points: [blinkingDots[0]],
  }],
  simulations: [
    storyWait(2000, ([component]) => {
      component.points = [{ ...blinkingDots[0], count: 5 }];
    }),
    storyWait(2000, ([component]) => {
      component.points = [{ ...blinkingDots[0], count: 20, tooltip: 'Paris<br>Cachan' }];
    }),
    storyWait(2000, ([component]) => {
      component.points = [{ ...blinkingDots[0], count: 50, tooltip: 'Paris<br>Cachan<br>La défense...' }];
    }),
    storyWait(2000, ([component]) => {
      component.points = [{ ...blinkingDots[0], count: 100, tooltip: null }];
    }),
  ],
});

export const simulationWithDifferentDots = makeStory(conf, {
  items: [{
    viewZoom: '2',
    mode: 'points',
    points: [blinkingDots[0]],
  }],
  simulations: [
    storyWait(1000, ([component]) => {
      component.points = [blinkingDots[1]];
    }),
    storyWait(1000, ([component]) => {
      component.points = [blinkingDots[2]];
    }),
    storyWait(1000, ([component]) => {
      component.points = [blinkingDots[3]];
    }),
    storyWait(1000, ([component]) => {
      component.points = [];
    }),
  ],
});

export const simulationWithUpdatesOnSameServer = makeStory(conf, {
  items: [{
    viewZoom: '2',
    mode: 'points',
    points: [{ lat: 48.8, lon: 2.3, enabled: false, tag: 'cc-map-marker-server' }],
  }],
  simulations: [
    storyWait(2000, ([component]) => {
      component.points = [{ lat: 48.8, lon: 2.3, enabled: true, tag: 'cc-map-marker-server' }];
    }),
    storyWait(5000, ([component]) => {
      component.points = [{ lat: 48.8, lon: 2.3, enabled: false, tag: 'cc-map-marker-server' }];
    }),
  ],
});

export const simulationWithHeatmap = makeStory(conf, {
  items: [{
    viewZoom: '2',
    mode: 'heatmap',
    heatmapPoints: fakeHeatmapData,
    innerHTML: `Heatmap simulation`,
  }],
});

enhanceStoriesNames({
  defaultStory,
  emptyWithLegendInSlot,
  emptyWithDifferentSizes,
  emptyWithDifferentCentersAndZooms,
  emptyWithHeatmap,
  loading,
  error,
  errorWithLoadingIndicator,
  pointsWithDots,
  pointsWithServers,
  pointsWithDotsNoTooltips,
  simulationWithUpdatesOnSameDot,
  simulationWithDifferentDots,
  simulationWithUpdatesOnSameServer,
  simulationWithHeatmap,
});
