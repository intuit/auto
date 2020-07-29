import { Auto, execPromise } from "@auto-it/core";
import * as glob from "fast-glob";
import * as fs from "fs";
import * as jsdom from "jsdom";
import * as prettier from "prettier";
import { IMavenPluginOptions, getPom } from "./index";

/** Update the version in the pom.xml file **/
export async function updatePomVersion(
  content: string,
  version: string,
  options: IMavenPluginOptions
): Promise<string> {
  const dom = new jsdom.JSDOM(content, { contentType: "text/xml" });
  const pomDom = dom.window.document;
  const versionNode = pomDom.evaluate(
    "/project/version",
    pomDom.documentElement,
    pomDom.createNSResolver(pomDom.documentElement),
    9 // XPathResult.FIRST_ORDERED_NODE_TYPE
  );

  if (versionNode?.singleNodeValue) {
    versionNode.singleNodeValue.textContent = version;
  }

  const parentVersionNode = pomDom.evaluate(
    "/project/parent/version",
    pomDom.documentElement,
    pomDom.createNSResolver(pomDom.documentElement),
    9 // XPathResult.FIRST_ORDERED_NODE_TYPE
  );

  if (parentVersionNode?.singleNodeValue) {
    parentVersionNode.singleNodeValue.textContent = version;
  }

  return prettier.format(dom.serialize(), {
    printWidth: options.printWidth,
    tabWidth: options.tabWidth,
    parser: "html",
  });
}

/** Update the pom.xml file with the new version **/
export async function updatePomFile(
  pomFile: string,
  version: string,
  options: IMavenPluginOptions,
  auto: Auto
) {
  auto.logger.verbose.info(`Updating: ${pomFile}`);

  const pom = await getPom(pomFile);
  const content = await updatePomVersion(pom.pomXml, version, options);

  fs.writeFile(pomFile, content, { encoding: "utf8" }, (err) => {
    if (err) throw err;
  });
}

/** Find and update all pom.xml files with new versions, and then commit the changes **/
export async function updatePoms(
  version: string,
  options: IMavenPluginOptions,
  auto: Auto
) {
  auto.logger.verbose.info("Using the auto maven plugin");

  /** Get all the poms and update their versions **/
  const pomFiles = glob.sync("**/pom.xml");

  if (pomFiles && pomFiles.length > 0) {
    try {
      await Promise.all(
        pomFiles.map((pomFile) =>
          updatePomFile(pomFile, version, options, auto)
        )
      );
    } catch (error) {
      auto.logger.verbose.error(
        `There was an error modifying the pom files. Running 'git checkout -- .' to reset the clone.`
      );

      await execPromise("git", ["checkout", "--", "."]);
      throw error;
    }

    auto.logger.verbose.info(
      `Updated ${pomFiles.length} pom.xml files with version: ${version}`
    );

    await execPromise("git", [
      "commit",
      "-am",
      `"update version: ${version} [skip ci]"`,
      "--no-verify",
    ]);
  }
}
