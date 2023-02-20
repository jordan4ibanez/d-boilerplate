import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

    let gettersAndSetters = vscode.commands.registerCommand("d-boilerplate.addGettersSetters", () => {
        console.log("hello :)");
    });
    context.subscriptions.push(gettersAndSetters);

    let getters = vscode.commands.registerCommand("d-boilerplate.addGettersSetters", () => {
        console.log("hello :)");
    });
    context.subscriptions.push(getters);

    let setters = vscode.commands.registerCommand("d-boilerplate.addGettersSetters", () => {
        console.log("hello :)");
    });
    context.subscriptions.push(setters);


}

// This method is called when your extension is deactivated
export function deactivate() {}
