"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    console.log('Congratulations, your extension "react-component-2" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand("react-component-snippets.createComponent", async () => {
        // The code you place here will be executed every time your command is executed
        // Prompt the user to enter the component name
        const componentName = await vscode.window.showInputBox({
            prompt: "Enter component name",
        });
        if (!componentName) {
            vscode.window.showErrorMessage("Component name is required");
            return;
        }
        // Prompt the user to select the file type (tsx or jsx)
        const fileType = await vscode.window.showQuickPick(["tsx", "jsx"], {
            placeHolder: "Select file type",
        });
        if (!fileType) {
            vscode.window.showErrorMessage("File type is required");
            return;
        }
        // Get the path of the opened workspace folder
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage("No folder opened");
            return;
        }
        const rootPath = workspaceFolders[0].uri.fsPath;
        // Define the path to the 'components' folder inside the workspace
        const componentsPath = path.join(rootPath, "components");
        if (!fs.existsSync(componentsPath)) {
            // Define the path to the 'src' folder inside the workspace
            const srcPath = path.join(rootPath, "src");
            // Check if the 'src' folder exists, if yes, checks if the 'components' folder exists in the 'src' folder
            if (fs.existsSync(srcPath)) {
                // Define the path to the 'src/components' folder inside the workspace
                const newComponentsPath = path.join(rootPath, "src/components");
                // Check if the 'src/components' folder exists, if not show error message // TODO if not asks for it
                if (!fs.existsSync(newComponentsPath)) {
                    vscode.window.showErrorMessage("No 'components' folder found! Please try again.");
                    return;
                }
                // Define the path to the new component folder
                const componentFolderPath = path.join(newComponentsPath, componentName);
                // Check if the component folder (that will be created) already exists
                if (!fs.existsSync(componentFolderPath)) {
                    // Create the new component folder
                    fs.mkdirSync(componentFolderPath);
                }
                else {
                    vscode.window.showErrorMessage("Folder already exists");
                    return;
                }
                // Split the component name by space
                const splitComponentName = componentName.split(" ");
                let finalFileName = "";
                // Capitalize the first letter of each word in the component name
                for (var i = 0; i < splitComponentName.length; i++) {
                    finalFileName +=
                        splitComponentName[i].charAt(0).toUpperCase() +
                            splitComponentName[i].slice(1);
                }
                // Define the component file name based on the component name and selected file type
                const componentFileName = `${finalFileName}.${fileType}`;
                const componentFilePath = path.join(componentFolderPath, componentFileName);
                // Define the content of the component file
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
                // Create the component file with the defined content
                fs.writeFileSync(componentFilePath, componentContent);
                // Show a message indicating that the component was created successfully
                vscode.window.showInformationMessage(`Component ${componentFileName} created successfully!`);
            }
        }
    });
    // Add the command to the subscriptions of the extension context
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map