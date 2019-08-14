"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = require("path");

var _fs = require("fs");

var _default = (api, bag) => api.onGenerateFiles(() => {
  const indexPath = bag.joinApolloPath("index.js");
  const templatePath = bag.joinApolloTemplatePath("index.js");
  const optionsFile = api.winPath(bag.optionsFile);
  const indexTemplate = (0, _fs.readFileSync)(templatePath, "utf-8");
  let indexContent = indexTemplate.replace("<%= OptionsFile %>", optionsFile);

  if (bag.opts.hooksImportFrom === "react-apollo") {
    indexContent = indexContent.replace("{/* <%= ApolloProviderChildren %> */}", "{children}");
  } else {
    indexContent = indexContent.replace("// <%= ImportReactApolloHooks %>", 'import { ApolloProvider as ApolloHooksProvider } from "react-apollo-hooks";').replace("{/* <%= ApolloProviderChildren %> */}", "<ApolloHooksProvider client={client}>{children}</ApolloHooksProvider>");
  }

  (0, _fs.writeFileSync)(indexPath, indexContent);
});

exports.default = _default;