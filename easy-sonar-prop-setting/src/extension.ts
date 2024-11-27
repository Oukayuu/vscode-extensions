import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "easy-sonar-prop-setting" is now active!'
  );

  const addPathToProperties = (
    uri: vscode.Uri,
    key: string,
    clear: boolean = false
  ) => {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      vscode.window.showErrorMessage("No workspace folder is open");
      return;
    }

    const selectedPath = uri.fsPath;
    const rootFolder = workspaceFolders.find(folder => selectedPath.startsWith(folder.uri.fsPath));
    if (!rootFolder) {
      vscode.window.showErrorMessage("Selected path is not within any workspace folder");
      return;
    }
    const rootPath = rootFolder.uri.fsPath;
    const config = vscode.workspace.getConfiguration("easySonarPropSetting");
    const propertiesFileName = config.get<string>(
      "propertiesFileName",
      "sonar-project.properties"
    );
    const propertiesPath = path.join(rootPath, propertiesFileName);
    const relativePath = `./${path.relative(rootPath, selectedPath)}`.replace(
      /\\/g,
      "/"
    );

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
            const existingPaths = line.includes("=")
              ? line
                  .split("=")[1]
                  .split(",")
                  .map((p) => p.trim())
              : [];
            if (!existingPaths.includes(relativePath)) {
              existingPaths.push(relativePath);
              newLines.push(`${key} = ${existingPaths.join(", ")}`);
            } else {
              vscode.window.showErrorMessage(
                `${relativePath} is already in ${key}`
              );
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
    (uri: vscode.Uri) => {
      const config = vscode.workspace.getConfiguration("easySonarPropSetting");
      const sonarSourcesKey = config.get<string>(
        "sonarSourcesKey",
        "sonar.sources"
      );
      addPathToProperties(uri, sonarSourcesKey);
    }
  );

  const disposableAddSonarTests = vscode.commands.registerCommand(
    "easy-sonar-prop-setting.addSonarTests",
    (uri: vscode.Uri) => {
      const config = vscode.workspace.getConfiguration("easySonarPropSetting");
      const sonarTestsKey = config.get<string>("sonarTestsKey", "sonar.tests");
      addPathToProperties(uri, sonarTestsKey);
    }
  );

  const disposableClearAndAddSonarSources = vscode.commands.registerCommand(
    "easy-sonar-prop-setting.clearAndAddSonarSources",
    (uri: vscode.Uri) => {
      const config = vscode.workspace.getConfiguration("easySonarPropSetting");
      const sonarSourcesKey = config.get<string>(
        "sonarSourcesKey",
        "sonar.sources"
      );
      const enableClearAndAddSonarSources = config.get<boolean>(
        "enableClearAndAddSonarSources",
        true
      );
      addPathToProperties(uri, sonarSourcesKey, enableClearAndAddSonarSources);
    }
  );

  const disposableClearAndAddSonarTests = vscode.commands.registerCommand(
    "easy-sonar-prop-setting.clearAndAddSonarTests",
    (uri: vscode.Uri) => {
      const config = vscode.workspace.getConfiguration("easySonarPropSetting");
      const sonarTestsKey = config.get<string>("sonarTestsKey", "sonar.tests");
      const enableClearAndAddSonarTests = config.get<boolean>(
        "enableClearAndAddSonarTests",
        true
      );
      addPathToProperties(uri, sonarTestsKey, enableClearAndAddSonarTests);
    }
  );

  const disposableAddSonarTestInclusions = vscode.commands.registerCommand(
    "easy-sonar-prop-setting.addSonarTestInclusions",
    (uri: vscode.Uri) => {
      const config = vscode.workspace.getConfiguration("easySonarPropSetting");
      const sonarTestInclusionsKey = config.get<string>(
        "sonarTestInclusionsKey",
        "sonar.test.inclusions"
      );
      addPathToProperties(uri, sonarTestInclusionsKey);
    }
  );

  const disposableClearAndAddSonarTestInclusions =
    vscode.commands.registerCommand(
      "easy-sonar-prop-setting.clearAndAddSonarTestInclusions",
      (uri: vscode.Uri) => {
        const config = vscode.workspace.getConfiguration(
          "easySonarPropSetting"
        );
        const sonarTestInclusionsKey = config.get<string>(
          "sonarTestInclusionsKey",
          "sonar.test.inclusions"
        );
        const enableClearAndAddSonarTestInclusions = config.get<boolean>(
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
    (uri: vscode.Uri) => {
      const config = vscode.workspace.getConfiguration("easySonarPropSetting");
      const sonarExclusionsKey = config.get<string>(
        "sonarExclusionsKey",
        "sonar.exclusions"
      );
      addPathToProperties(uri, sonarExclusionsKey);
    }
  );

  const disposableClearAndAddSonarExclusions = vscode.commands.registerCommand(
    "easy-sonar-prop-setting.clearAndAddSonarExclusions",
    (uri: vscode.Uri) => {
      const config = vscode.workspace.getConfiguration("easySonarPropSetting");
      const sonarExclusionsKey = config.get<string>(
        "sonarExclusionsKey",
        "sonar.exclusions"
      );
      const enableClearAndAddSonarExclusions = config.get<boolean>(
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
    (uri: vscode.Uri) => {
      const rootPath = uri.fsPath.replace(/\\/g, "/").replace(/\/sonar-project\.properties$/, "");
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
}

export function deactivate() {}
