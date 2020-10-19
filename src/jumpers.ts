
import * as vscode from 'vscode';
import { closest } from 'fastest-levenshtein';

function getSelectedText(editor: vscode.TextEditor): string | null {
	const document = editor.document;

	// if there is a selection
	const selectedText = document.getText(editor.selection);
	if (selectedText !== "") {
		return selectedText;
	};

	// fall back to surrounding word
	const selection = document.getWordRangeAtPosition(editor.selection.active);
	if (selection) {
		return editor.document.getText(selection);
	}

	return null;
}


export const runJumper = (jumper: Jumper, editor: vscode.TextEditor) => {
	const text = getSelectedText(editor);
	if (!text) { return; }
	jumper(editor, text);
};

export type Jumper = (editor: vscode.TextEditor, selectedText: string) => void;

export const REASON_RESCRIPT: Jumper = (editor, selectedText) => {

	const searchTexts = [
		`**/Relude_${selectedText}.{re,res}`,
		`**/${selectedText}.{re,res}`,
		`**/Relude_${selectedText}_Base.{re,res}`,
		`**/Relude_${selectedText}_*.{re,res}`,

	];

	const match = /(\w+)Array/gi.exec(selectedText);
	if (match) {
		searchTexts.push(
			`**/Relude_${match[1]}.{re,res}`,
			`**/Relude_${match[1]}*.{re,res}`
		);
	}

	searchTexts.reduce((acc: Promise<vscode.Uri[]>, cur: string) => {
		return acc.then(files => {
			return files.length
				? Promise.resolve(files)
				: vscode.workspace.findFiles(cur, null, 3);
		});

	}, Promise.resolve([])).then(files => {
		if (files.length) {
			const currentFilePath = editor.document.uri.path;
			if (files.length) {
				const closestFile = closest(currentFilePath, files.map(f => f.path));
				vscode.workspace
					.openTextDocument(closestFile)
					.then(vscode.window.showTextDocument);
			}
		}
	});

};