"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode = __toESM(require("vscode"));
var fs = __toESM(require("fs"));
var path = __toESM(require("path"));
function activate(context) {
  console.log(
    'Congratulations, your extension "easy-sonar-prop-setting" is now active!'
  );
  const addPathToProperties = (uri, key, clear = false) => {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      vscode.window.showErrorMessage("No workspace folder is open");
      return;
    }
    const rootPath = workspaceFolders[0].uri.fsPath;
    const config2 = vscode.workspace.getConfiguration("easySonarPropSetting");
    const propertiesFileName = config2.get(
      "propertiesFileName",
      "sonar-project.properties"
    );
    const propertiesPath = path.join(rootPath, propertiesFileName);
    const selectedPath = uri.fsPath;
    const relativePath = `./${path.relative(rootPath, selectedPath)}`.replace(/\\/g, "/");
    if (fs.existsSync(propertiesPath)) {
      const fileContent = fs.readFileSync(propertiesPath, "utf-8");
      const lines = fileContent.split("\n");
      const newLines = [];
      let keyFound = false;
      for (const line of lines) {
        if (line.startsWith(`${key}=`) || line.startsWith(`${key} =`)) {
          keyFound = true;
          if (clear) {
            newLines.push(`${key} = ${relativePath}`);
          } else {
            const existingPaths = line.includes("=") ? line.split("=")[1].split(",").map((p) => p.trim()) : [];
            if (!existingPaths.includes(relativePath)) {
              existingPaths.push(relativePath);
              newLines.push(`${key} = ${existingPaths.join(", ")}`);
            } else {
              vscode.window.showErrorMessage(`${relativePath} is already in ${key}`);
              return;
            }
          }
        } else {
          newLines.push(line);
        }
      }
      if (!keyFound) {
        newLines.push(`${key} = ${relativePath}`);
      }
      fs.writeFileSync(propertiesPath, newLines.join("\n"));
      vscode.window.showInformationMessage(`${key} set to ${relativePath}`);
    } else {
      vscode.window.showErrorMessage(
        `${propertiesFileName} file not found in the root path`
      );
    }
  };
  const disposableAddSonarSources = vscode.commands.registerCommand(
    "easy-sonar-prop-setting.addSonarSources",
    (uri) => {
      const config2 = vscode.workspace.getConfiguration("easySonarPropSetting");
      const sonarSourcesKey = config2.get(
        "sonarSourcesKey",
        "sonar.sources"
      );
      addPathToProperties(uri, sonarSourcesKey);
    }
  );
  const disposableAddSonarTests = vscode.commands.registerCommand(
    "easy-sonar-prop-setting.addSonarTests",
    (uri) => {
      const config2 = vscode.workspace.getConfiguration("easySonarPropSetting");
      const sonarTestsKey = config2.get("sonarTestsKey", "sonar.tests");
      addPathToProperties(uri, sonarTestsKey);
    }
  );
  const disposableClearAndAddSonarSources = vscode.commands.registerCommand(
    "easy-sonar-prop-setting.clearAndAddSonarSources",
    (uri) => {
      const config2 = vscode.workspace.getConfiguration("easySonarPropSetting");
      const sonarSourcesKey = config2.get(
        "sonarSourcesKey",
        "sonar.sources"
      );
      const enableClearAndAddSonarSources = config2.get(
        "enableClearAndAddSonarSources",
        true
      );
      addPathToProperties(uri, sonarSourcesKey, enableClearAndAddSonarSources);
    }
  );
  const disposableClearAndAddSonarTests = vscode.commands.registerCommand(
    "easy-sonar-prop-setting.clearAndAddSonarTests",
    (uri) => {
      const config2 = vscode.workspace.getConfiguration("easySonarPropSetting");
      const sonarTestsKey = config2.get("sonarTestsKey", "sonar.tests");
      const enableClearAndAddSonarTests = config2.get(
        "enableClearAndAddSonarTests",
        true
      );
      addPathToProperties(uri, sonarTestsKey, enableClearAndAddSonarTests);
    }
  );
  const disposableAddSonarTestInclusions = vscode.commands.registerCommand(
    "easy-sonar-prop-setting.addSonarTestInclusions",
    (uri) => {
      const config2 = vscode.workspace.getConfiguration("easySonarPropSetting");
      const sonarTestInclusionsKey = config2.get(
        "sonarTestInclusionsKey",
        "sonar.test.inclusions"
      );
      addPathToProperties(uri, sonarTestInclusionsKey);
    }
  );
  const disposableClearAndAddSonarTestInclusions = vscode.commands.registerCommand(
    "easy-sonar-prop-setting.clearAndAddSonarTestInclusions",
    (uri) => {
      const config2 = vscode.workspace.getConfiguration(
        "easySonarPropSetting"
      );
      const sonarTestInclusionsKey = config2.get(
        "sonarTestInclusionsKey",
        "sonar.test.inclusions"
      );
      const enableClearAndAddSonarTestInclusions = config2.get(
        "enableClearAndAddSonarTestInclusions",
        true
      );
      addPathToProperties(
        uri,
        sonarTestInclusionsKey,
        enableClearAndAddSonarTestInclusions
      );
    }
  );
  const disposableAddSonarExclusions = vscode.commands.registerCommand(
    "easy-sonar-prop-setting.addSonarExclusions",
    (uri) => {
      const config2 = vscode.workspace.getConfiguration("easySonarPropSetting");
      const sonarExclusionsKey = config2.get(
        "sonarExclusionsKey",
        "sonar.exclusions"
      );
      addPathToProperties(uri, sonarExclusionsKey);
    }
  );
  const disposableClearAndAddSonarExclusions = vscode.commands.registerCommand(
    "easy-sonar-prop-setting.clearAndAddSonarExclusions",
    (uri) => {
      const config2 = vscode.workspace.getConfiguration("easySonarPropSetting");
      const sonarExclusionsKey = config2.get(
        "sonarExclusionsKey",
        "sonar.exclusions"
      );
      const enableClearAndAddSonarExclusions = config2.get(
        "enableClearAndAddSonarExclusions",
        false
      );
      addPathToProperties(
        uri,
        sonarExclusionsKey,
        enableClearAndAddSonarExclusions
      );
    }
  );
  const disposableRunSonarScanner = vscode.commands.registerCommand(
    "easy-sonar-prop-setting.runSonarScanner",
    () => {
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders) {
        vscode.window.showErrorMessage("No workspace folder is open");
        return;
      }
      const rootPath = workspaceFolders[0].uri.fsPath;
      const terminal = vscode.window.createTerminal("Sonar Scanner");
      terminal.show();
      terminal.sendText(`cd ${rootPath}`);
      terminal.sendText("sonar-scanner");
    }
  );
  context.subscriptions.push(
    disposableAddSonarSources,
    disposableAddSonarTests,
    disposableClearAndAddSonarSources,
    disposableClearAndAddSonarTests,
    disposableAddSonarTestInclusions,
    disposableClearAndAddSonarTestInclusions,
    disposableAddSonarExclusions,
    disposableClearAndAddSonarExclusions,
    disposableRunSonarScanner
  );
  const config = vscode.workspace.getConfiguration("easySonarPropSetting");
  const showRunSonarScannerButton = config.get(
    "showRunSonarScannerButton",
    true
  );
  const runSonarScannerButtonText = config.get(
    "runSonarScannerButtonText",
    "$(play) Run Sonar Scanner"
  );
  if (showRunSonarScannerButton) {
    const statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left,
      100
    );
    statusBarItem.text = runSonarScannerButtonText;
    statusBarItem.command = "easy-sonar-prop-setting.runSonarScanner";
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);
  }
}
function deactivate() {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
