"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = require("path");

var _fs = require("fs");

var _default = (api, bag) => api.onGenerateFiles(() => {
  const indexPath = bag.joinApolloPath('index.js');
  const templatePath = bag.joinApolloTemplatePath('index.js');
  const optionsFile = api.winPath(bag.optionsFile);
  const indexTemplate = (0, _fs.readFileSync)(templatePath, 'utf-8');
  const indexContent = indexTemplate.replace('<%= OptionsFile %>', optionsFile);
  (0, _fs.writeFileSync)(indexPath, indexContent);
});

exports.default = _default;