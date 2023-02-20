import * as vscode from 'vscode';



function getBasicInfo(editor: vscode.TextEditor):
[
    variableName: string,
    typeName: string,
    foundLine: number,
    foundCharacterBegin: number,
    foundCharacterEnd: number
] {
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
    const typeStartPosition = typeRange?.start || 0;
    // console.log("var type:" + typeName);

    // Now try to find where this scope ends
    var foundLine = 0;
    var foundCharacterBegin = 0;
    var foundCharacterEnd = 0;

    for (var i = line; i <= editor.document.lineCount; i++) {
        const line = editor.document.lineAt(i);
        const lineCharacterStartPosition = line.firstNonWhitespaceCharacterIndex;
        const lineCharacterEndPosition = line.range.end.character;
        const lineString = line.text;

        console.log(lineString);

        // Can only assume that } is the end of the scope :T
        if (lineString === "}") {
            foundLine = line.lineNumber - 1;
            break;
        } else if (lineCharacterEndPosition > 0 && lineCharacterStartPosition !== typeStartPosition) {
            foundCharacterBegin = lineCharacterStartPosition;
            foundCharacterEnd = lineCharacterEndPosition;
        }
    }

    return [variableName, typeName, foundLine, foundCharacterBegin, foundCharacterEnd];
}

//! Probably needs to know if tabs or spaces
function appendGetter(buildString: string, whitespace: string, variableName: string, typeName: string) {
    // Getter
    return buildString += "\n" +
    whitespace + "public " + typeName + " " + "get" + variableName.charAt(0).toUpperCase() + variableName.slice(1) + "() {\n" +
    whitespace + "    " + "return this." + variableName + ";\n" +
    whitespace + "}\n";
}
function appendSetter(buildString: string, whitespace: string, variableName: string, typeName: string) {
    // Setter
    return buildString += "\n" +
    whitespace + "public void " + "set" + variableName.charAt(0).toUpperCase() + variableName.slice(1) + "(" + typeName + " " + variableName + ") {\n" +
    whitespace + "    " + "this." + variableName + " = " + variableName + ";\n" +
    whitespace + "}\n";
}

function generateWhiteSpace(foundCharacterBegin: number) {
    // Generate white space to match scope
    var whitespace = "";
    for (var i = 0; i < foundCharacterBegin; i++) {
        whitespace += " ";
    }
    return whitespace;
}

export function activate(context: vscode.ExtensionContext) {

    let gettersAndSetters = vscode.commands.registerCommand("d-boilerplate.addGettersSetters", () => {
        const editor = vscode.window.activeTextEditor;
        if(editor) {
            const [variableName, typeName, foundLine, foundCharacterBegin, foundCharacterEnd] = getBasicInfo(editor);
            const insertionPosition = new vscode.Position(foundLine, foundCharacterEnd);
            var whiteSpace = generateWhiteSpace(foundCharacterBegin);
            var buildString = "\n";
            buildString = appendGetter(buildString, whiteSpace, variableName, typeName);
            buildString = appendSetter(buildString, whiteSpace, variableName, typeName);
            editor.edit( editBuilder => {
                editBuilder.insert( insertionPosition, buildString);
            });
        }
    });
    context.subscriptions.push(gettersAndSetters);

    let getters = vscode.commands.registerCommand("d-boilerplate.addGetters", () => {
        const editor = vscode.window.activeTextEditor;
        if(editor) {
            const [variableName, typeName, foundLine, foundCharacterBegin, foundCharacterEnd] = getBasicInfo(editor);
            const insertionPosition = new vscode.Position(foundLine, foundCharacterEnd);
            var whiteSpace = generateWhiteSpace(foundCharacterBegin);
            var buildString = "\n";
            buildString = appendGetter(buildString, whiteSpace, variableName, typeName);
            editor.edit( editBuilder => {
                editBuilder.insert( insertionPosition, buildString);
            });
        }
    });
    context.subscriptions.push(getters);

    let setters = vscode.commands.registerCommand("d-boilerplate.addSetters", () => {
        const editor = vscode.window.activeTextEditor;
        if(editor) {
            const [variableName, typeName, foundLine, foundCharacterBegin, foundCharacterEnd] = getBasicInfo(editor);
            const insertionPosition = new vscode.Position(foundLine, foundCharacterEnd);
            var whiteSpace = generateWhiteSpace(foundCharacterBegin);
            var buildString = "\n";
            buildString = appendSetter(buildString, whiteSpace, variableName, typeName);
            editor.edit( editBuilder => {
                editBuilder.insert( insertionPosition, buildString);
            });
        }
    });
    context.subscriptions.push(setters);


}

// This method is called when your extension is deactivated
export function deactivate() {}
