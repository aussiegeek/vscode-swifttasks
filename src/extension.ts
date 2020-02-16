import * as vscode from "vscode";
import SwiftTaskProvider from "./swiftTaskProvider";

let taskProvider: vscode.Disposable | undefined;

export function activate(): void {
  taskProvider = vscode.tasks.registerTaskProvider(
    "swift",
    new SwiftTaskProvider()
  );
}

export function deactivate(): void {
  if (taskProvider) {
    taskProvider.dispose();
  }
}
