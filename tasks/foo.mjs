import { promises as fs } from 'fs';
import { translations } from '../src/translations/translations.en.js';

async function run () {

  const pairs = Object
    .entries(translations)
    .map(([key, strOrFun]) => {
      if (typeof strOrFun === 'string') {
        return [key, strOrFun];
      }
      const fnString = strOrFun.toString();
      if (fnString.endsWith('`')) {
        const [, stringValue] = fnString.match(/`(.*)`$/) ?? [];
        return [key, stringValue];
      }
      return [key, 'UNKNOWN'];
    });

  pairs.length = 50;

  const obj = Object.fromEntries(pairs);
  const jsonObj = JSON.stringify(obj, null, '  ');

  await fs.writeFile('./src/translations/translations.en.json', jsonObj);
}

run()
  .catch(console.error);
