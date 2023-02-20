import * as vscode from 'vscode';


export function activate(context: vscode.ExtensionContext) {

    let gettersAndSetters = vscode.commands.registerCommand("d-boilerplate.addGettersSetters", (args) => {
        console.log("doing that fancy boi :)");
        const editor = vscode.window.activeTextEditor;

        if(editor) {

            // Get cursor position
            let cursorPosition = editor.selection.start;

            // Find out where this word starts
            const variable = editor.document.getWordRangeAtPosition(cursorPosition);
            const variableStartCharacter = variable?.start.character || 0;

            // What line is it at?
            var line = cursorPosition.line;

            // console.log("start char:",variableStartCharacter);
            // console.log("end char:", variableEndCharacter);

            // Now get the name of the variable
            const variablePosition = new vscode.Position(line, variableStartCharacter);
            const variableNameRange = editor.document.getWordRangeAtPosition(variablePosition);
            const variableName = editor.document.getText(variableNameRange);
            // console.log("var name:" + variableName);

            // Now get the type of the variable TODO: find previous word no matter what
            const typePosition = new vscode.Position(line, variableStartCharacter - 1);
            const typeRange = editor.document.getWordRangeAtPosition(typePosition);
            const typeName = editor.document.getText(typeRange);
            // console.log("var type:" + typeName);

            // Now try to find where this scope ends
            var foundLine = 0;
            for (var i = line + 1; i <= editor.document.lineCount; i++) {
                foundLine = i;
                const lineString = editor.document.lineAt(foundLine).text;
                // Can only assume that } is the end of the scope :T
                if (lineString === "}") {
                    break;
                }
            }

            


        }
    });

    context.subscriptions.push(gettersAndSetters);


}

// This method is called when your extension is deactivated
export function deactivate() {}
