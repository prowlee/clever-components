'use strict';

const i18n = require('./i18n.js');

const { createMacro } = require('babel-plugin-macros');

// `createMacro` is simply a function that ensures your macro is only
// called in the context of a babel transpilation and will throw an
// error with a helpful message if someone does not have babel-plugin-macros
// configured correctly
module.exports = createMacro(myMacro);

function myMacro ({ references, state, babel }) {
  // state is the second argument you're passed to a visitor in a
  // normal babel plugin. `babel` is the `babel-plugin-macros` module.
  // do whatever you like to the AST paths you find in `references`
  // read more below...
  references.default.forEach((referencePath) => {
    const key = referencePath.parent.arguments[0].value;
    const trad = i18n(key);
    // console.log(referencePath.parentPath);
    // console.log(referencePath.parentPath.parentPath);
    // console.log(babel.types);

    const exprss = referencePath.parentPath.parentPath.node.expressions;
    const quasis = referencePath.parentPath.parentPath.node.quasis;

    referencePath.parentPath.parentPath.replaceWith(babel.types.templateLiteral(
      [
        quasis[0],
        babel.types.templateElement({ raw: quasis[1].value.raw + trad + quasis[2].value.raw }),
      ],
      [
        exprss[0],
      ],
    ));
    // console.log(referencePath.parentPath.parentPath.node.expressions);
    // console.log(referencePath.parentPath.parentPath.node.quasis);
    // const trad = i18n(key);
    // console.log({ key, trad });
    // referencePath.parentPath.replaceWith(babel.types.stringLiteral(trad));
  });
}
