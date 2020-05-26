const { isEqual } = require("lodash");

module.exports = {
  webpack: {
    configure(webpackConfig) {
      const updatedRules = webpackConfig.module.rules.filter(
        rule => !isEqual(rule, { parser: { requireEnsure: false } })
      );
      webpackConfig.module.rules = updatedRules;

      return webpackConfig;
    }
  }
};