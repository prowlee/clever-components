import fs from 'fs';
import path from 'path';
import { createFilter } from '@rollup/pluginutils';
import { asyncWalk } from 'estree-walker';
import MagicString from 'magic-string';

function getRelativeAssetPath (node) {
  return node.object.arguments[0].value;
}

// Looking for this:
// new URL('./path/to/asset.ext', import.meta.url).href
function isNewUrlImportMetaUrlHref (node) {
  return node.type === 'MemberExpression'
    && node.object.type === 'NewExpression'
    && node.object.callee.type === 'Identifier'
    && node.object.callee.name === 'URL'
    && node.object.arguments.length === 2
    && node.object.arguments[0].type === 'Literal'
    && typeof getRelativeAssetPath(node) === 'string'
    && node.object.arguments[1].type === 'MemberExpression'
    && node.object.arguments[1].object.type === 'MetaProperty'
    && node.object.arguments[1].property.type === 'Identifier'
    && node.object.arguments[1].property.name === 'url'
    && node.property.type === 'Identifier'
    && node.property.name === 'href';
}

export function importMetaUrlAssets ({ include, exclude, warnOnError, transform } = {}) {

  const filter = createFilter(include, exclude);

  return {
    name: 'rollup-plugin-import-meta-url-assets',

    async transform (code, id) {

      if (!filter(id)) {
        return null;
      }

      const ast = this.parse(code);
      const magicString = new MagicString(code);

      await asyncWalk(ast, {
        enter: async (node, parent) => {

          if (isNewUrlImportMetaUrlHref(node)) {

            const { dir: absoluteScriptDir } = path.parse(id);
            const relativeAssetPath = getRelativeAssetPath(node);
            const absoluteAssetPath = path.resolve(absoluteScriptDir, relativeAssetPath);
            const { base: assetName } = path.parse(absoluteAssetPath);

            try {
              const assetContents = await fs.promises.readFile(absoluteAssetPath);
              const transformedAssetContents = (transform != null)
                ? await transform(assetContents)
                : assetContents;
              const ref = this.emitFile({ type: 'asset', name: assetName, source: transformedAssetContents });
              magicString.overwrite(node.start, node.end, `import.meta.ROLLUP_FILE_URL_${ref}`);
            }
            catch (error) {
              if (warnOnError) {
                this.warn(error, node.object.arguments[0].start);
              }
              else {
                this.error(error, node.object.arguments[0].start);
              }
            }

          }
        },
      });

      return {
        code: magicString.toString(),
        map: magicString.generateMap(),
      };
    },
  };
}
