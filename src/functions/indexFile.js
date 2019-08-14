import { join } from "path";
import { readFileSync, writeFileSync } from "fs";

export default (api, bag) =>
  api.onGenerateFiles(() => {
    const indexPath = bag.joinApolloPath("index.js");
    const templatePath = bag.joinApolloTemplatePath("index.js");

    const optionsFile = api.winPath(bag.optionsFile);

    const indexTemplate = readFileSync(templatePath, "utf-8");
    let indexContent = indexTemplate.replace("<%= OptionsFile %>", optionsFile);

    if (bag.opts.hooksImportFrom === "react-apollo") {
      indexContent = indexContent.replace(
        "{/* <%= ApolloProviderChildren %> */}",
        "{children}"
      );
    } else {
      indexContent = indexContent
        .replace(
          "// <%= ImportReactApolloHooks %>",
          'import { ApolloProvider as ApolloHooksProvider } from "react-apollo-hooks";'
        )
        .replace(
          "{/* <%= ApolloProviderChildren %> */}",
          "<ApolloHooksProvider client={client}>{children}</ApolloHooksProvider>"
        );
    }

    writeFileSync(indexPath, indexContent);
  });
