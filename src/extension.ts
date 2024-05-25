import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('component-creator.createComponent', async () => {
        const componentName = await vscode.window.showInputBox({ prompt: 'Enter component name' });
        if (!componentName) {
            vscode.window.showErrorMessage('Component name is required');
            return;
        }

        const fileType = await vscode.window.showQuickPick(['tsx', 'jsx'], { placeHolder: 'Select file type' });
        if (!fileType) {
            vscode.window.showErrorMessage('File type is required');
            return;
        }

        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('No folder opened');
            return;
        }

        const rootPath = workspaceFolders[0].uri.fsPath;
        const componentsPath = path.join(rootPath, 'components');
        if (!fs.existsSync(componentsPath)) {
            fs.mkdirSync(componentsPath);
        }

        const componentFolderPath = path.join(componentsPath, componentName);
        if (!fs.existsSync(componentFolderPath)) {
            fs.mkdirSync(componentFolderPath);
        } else {
            vscode.window.showErrorMessage('Folder already exists');
            return;
        }

        const componentFileName = `${componentName.charAt(0).toUpperCase() + componentName.slice(1)}.${fileType}`;
        const componentFilePath = path.join(componentFolderPath, componentFileName);
        const componentContent = `import React from 'react';

const ${componentName.charAt(0).toUpperCase() + componentName.slice(1)} = () => {
    return (
        <div>
            ${componentName}
        </div>
    );
}

export default ${componentName.charAt(0).toUpperCase() + componentName.slice(1)};
`;

        fs.writeFileSync(componentFilePath, componentContent);
        vscode.window.showInformationMessage(`Component ${componentFileName} created successfully!`);
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}