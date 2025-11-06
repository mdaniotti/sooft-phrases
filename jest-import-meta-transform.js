const ts = require("typescript");

module.exports = function (context) {
  return {
    transformSourceFile(node) {
      function visit(node) {
        if (
          ts.isPropertyAccessExpression(node) &&
          ts.isPropertyAccessExpression(node.expression) &&
          ts.isMetaProperty(node.expression.expression) &&
          node.expression.expression.keywordToken ===
            ts.SyntaxKind.ImportKeyword &&
          node.expression.name &&
          node.expression.name.text === "env" &&
          node.name &&
          node.name.text === "DEV"
        ) {
          return ts.factory.createFalse();
        }
        return ts.visitEachChild(node, visit, context);
      }
      return ts.visitNode(node, visit);
    },
  };
};

