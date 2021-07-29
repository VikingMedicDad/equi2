/**
 * Override Create React App Webpack configuration
 * This file is being used by react-app-rewired
 * @see https://github.com/timarney/react-app-rewired
 */

const {alias, configPaths} = require('react-app-rewire-alias');


module.exports = function override(config, env) {
  return alias(configPaths('./tsconfig.paths.json'))(config)
};
