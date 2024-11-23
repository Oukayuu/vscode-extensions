import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "easy-sonar-prop-setting" is now active!');

    const addPathToEnv = (uri: vscode.Uri, key: string, clear: boolean = false) => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('No workspace folder is open');
            return;
        }

        const rootPath = workspaceFolders[0].uri.fsPath;
        const config = vscode.workspace.getConfiguration('easySonarPropSetting');
        const envFileName = config.get<string>('envFileName', '.env');
        const envPath = path.join(rootPath, envFileName);
        const selectedPath = uri.fsPath;
        const relativePath = `./${path.relative(rootPath, selectedPath)}`;

        if (fs.existsSync(envPath)) {
            const envConfig = dotenv.parse(fs.readFileSync(envPath));
            if (clear) {
                envConfig[key] = relativePath;
            } else {
                const existingPaths = envConfig[key] ? envConfig[key].split(', ') : [];
                if (!existingPaths.includes(relativePath)) {
                    existingPaths.push(relativePath);
                    envConfig[key] = existingPaths.join(', ');
                } else {
                    vscode.window.showErrorMessage(`${relativePath} is already in ${key}`);
                    return;
                }
            }
            const envContent = Object.keys(envConfig).map(k => `${k}=${envConfig[k]}`).join('\n');
            fs.writeFileSync(envPath, envContent);
            vscode.window.showInformationMessage(`${key} set to ${envConfig[key]}`);
        } else {
            vscode.window.showErrorMessage(`${envFileName} file not found in the root path`);
        }
    };

    const disposable1 = vscode.commands.registerCommand('easy-sonar-prop-setting.addSonarPath', (uri: vscode.Uri) => {
        const config = vscode.workspace.getConfiguration('easySonarPropSetting');
        const sonarPathKey = config.get<string>('sonarPathKey', 'sonar.path');
        addPathToEnv(uri, sonarPathKey);
    });

    const disposable2 = vscode.commands.registerCommand('easy-sonar-prop-setting.addTestInclusion', (uri: vscode.Uri) => {
        const config = vscode.workspace.getConfiguration('easySonarPropSetting');
        const testInclusionKey = config.get<string>('testInclusionKey', 'test.inclusion');
        addPathToEnv(uri, testInclusionKey);
    });

    const disposable3 = vscode.commands.registerCommand('easy-sonar-prop-setting.addTestExclusion', (uri: vscode.Uri) => {
        const config = vscode.workspace.getConfiguration('easySonarPropSetting');
        const testExclusionKey = config.get<string>('testExclusionKey', 'test.exclusion');
        addPathToEnv(uri, testExclusionKey);
    });

    const disposable4 = vscode.commands.registerCommand('easy-sonar-prop-setting.clearAndAddSonarPath', (uri: vscode.Uri) => {
        const config = vscode.workspace.getConfiguration('easySonarPropSetting');
        const sonarPathKey = config.get<string>('sonarPathKey', 'sonar.path');
        const enableClearFunction = config.get<boolean>('enableClearFunction', true);
        addPathToEnv(uri, sonarPathKey, enableClearFunction);
    });

    const disposable5 = vscode.commands.registerCommand('easy-sonar-prop-setting.clearAndAddTestInclusion', (uri: vscode.Uri) => {
        const config = vscode.workspace.getConfiguration('easySonarPropSetting');
        const testInclusionKey = config.get<string>('testInclusionKey', 'test.inclusion');
        const enableClearTestInclusion = config.get<boolean>('enableClearTestInclusion', false);
        addPathToEnv(uri, testInclusionKey, enableClearTestInclusion);
    });

    const disposable6 = vscode.commands.registerCommand('easy-sonar-prop-setting.clearAndAddTestExclusion', (uri: vscode.Uri) => {
        const config = vscode.workspace.getConfiguration('easySonarPropSetting');
        const testExclusionKey = config.get<string>('testExclusionKey', 'test.exclusion');
        const enableClearTestExclusion = config.get<boolean>('enableClearTestExclusion', false);
        addPathToEnv(uri, testExclusionKey, enableClearTestExclusion);
    });

    context.subscriptions.push(disposable1, disposable2, disposable3, disposable4, disposable5, disposable6);
}

export function deactivate() {}