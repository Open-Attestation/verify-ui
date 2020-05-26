const { override, addDecoratorsLegacy } = require("customize-cra");

const enableRequireEnsure = () => (config) => {
  config.output.globalObject = "this";
  config.module.rules[0].parser.requireEnsure = true;
  return config;
};

module.exports = override(addDecoratorsLegacy(), enableRequireEnsure());
