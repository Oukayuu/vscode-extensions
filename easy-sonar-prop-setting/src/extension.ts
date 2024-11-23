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
        const envPath = path.join(rootPath, '.env');
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
            vscode.window.showErrorMessage('.env file not found in the root path');
        }
    };

    const disposable1 = vscode.commands.registerCommand('easy-sonar-prop-setting.addSonarPath', (uri: vscode.Uri) => {
        addPathToEnv(uri, 'sonar.path');
    });

    const disposable2 = vscode.commands.registerCommand('easy-sonar-prop-setting.addTestInclusion', (uri: vscode.Uri) => {
        addPathToEnv(uri, 'test.inclusion');
    });

    const disposable3 = vscode.commands.registerCommand('easy-sonar-prop-setting.addTestExclusion', (uri: vscode.Uri) => {
        addPathToEnv(uri, 'test.exclusion');
    });

    const disposable4 = vscode.commands.registerCommand('easy-sonar-prop-setting.clearAndAddSonarPath', (uri: vscode.Uri) => {
        addPathToEnv(uri, 'sonar.path', true);
    });

    context.subscriptions.push(disposable1, disposable2, disposable3, disposable4);
}

export function deactivate() {}