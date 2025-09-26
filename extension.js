// extension.js
const vscode = require('vscode');
const { spawn } = require('child_process');

function activate(context) {
    const disposable = vscode.commands.registerCommand('openSystemTerminal.openTerminal', (uri) => {
        if (!uri || !uri.fsPath) return;

        const folderPath = uri.fsPath;

        if (process.platform === 'win32') {
            // 弹出独立 Windows PowerShell 窗口
            spawn('start', ['powershell.exe', '-NoExit', '-Command', `Set-Location '${folderPath}'`], {
                shell: true,
                cwd: folderPath,
                windowsHide: false,
                detached: true
            }).unref();
        } else if (process.platform === 'darwin') {
            const script = `tell application "Terminal" to do script "cd \\"${folderPath}\\""`;
            spawn('osascript', ['-e', script], { detached: true }).unref();
        } else {
            // Linux 主流桌面
            spawn('gnome-terminal', ['--working-directory', folderPath], { detached: true }).unref();
        }

        vscode.window.showInformationMessage(`已在系统终端中打开: ${folderPath}`);
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}
module.exports = { activate, deactivate };
