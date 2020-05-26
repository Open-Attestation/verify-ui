module.exports = function override(config, env) {
  config.output.globalObject = "this";
  config.module.rules[0].parser.requireEnsure = true;

  return config;
};
