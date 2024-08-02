import * as vscode from 'vscode';
import { Server, Socket } from "socket.io";

const PORT: number = 5000;
var isServerRunning: boolean = false;
const io: Server = new Server(PORT);

interface EditorStatus {
	fileName: string;
	workspaceFolder: string;
}

var editorStatus: EditorStatus = {
	fileName: 'None',
	workspaceFolder: 'None'
};

export function activate(context: vscode.ExtensionContext) {

	io.on('connection', (socket: Socket) => {
		console.log('Client connected');
		socket.emit('editorStatus', editorStatus);
	});

	const serverStart = vscode.commands.registerCommand('vsc-activity.StartServer', () => {
		vscode.window.showInformationMessage(`Starting socket server on port ${PORT}.`);
		if (isServerRunning) { return vscode.window.showInformationMessage(`Server is already running on port ${PORT}.`); }
		try {
			io.listen(PORT);
			isServerRunning = true;
			vscode.window.showInformationMessage(`Server started on port ${PORT}.`);
		} catch (error) {
			vscode.window.showErrorMessage(`Failed to start server on port: ${PORT}.`);
			isServerRunning = false;
		}

	});

	const serverStop = vscode.commands.registerCommand('vsc-activity.StopServer', () => {
		vscode.window.showInformationMessage(`Stopping socket server on port ${PORT}`);
		if (!isServerRunning) { return vscode.window.showInformationMessage(`Server is already not running on port ${PORT}`); }
		try {
			io.close();
			isServerRunning = false;
			vscode.window.showInformationMessage(`Server stopped on port ${PORT}.`);
		} catch (error) {
			vscode.window.showErrorMessage(`Failed to stop server on port: ${PORT}.`);
			isServerRunning = true;
		}
	});

	const fileChange = vscode.window.onDidChangeActiveTextEditor((editor) => {
		if (!isServerRunning) { return; }
		if (!editor) { return; }
		editorStatus.fileName = editor.document.fileName || 'None';
		editorStatus.workspaceFolder = vscode.workspace.getWorkspaceFolder(editor.document.uri)?.name || 'None';
		io.emit('editorStatus', editorStatus);
	});


	context.subscriptions.push(serverStart);
	context.subscriptions.push(serverStop);
	context.subscriptions.push(fileChange);
}

// This method is called when your extension is deactivated
export function deactivate() { }
