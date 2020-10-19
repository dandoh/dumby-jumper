// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { REASON_RESCRIPT, runJumper } from './jumpers';


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

  let disposable = vscode.commands.registerCommand('dumby-jumper.goToDefinition', () => {

    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; };

    switch (editor.document.languageId) {
      case 'rescript': {
        runJumper(REASON_RESCRIPT, editor);
      }
      case 'reason': {
        runJumper(REASON_RESCRIPT, editor);
      }
    }

  });

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
