import * as vscode from "vscode";
import TasksForPackage from "./tasksForPackage";
import fetchPackageDefinition from "./fetchPackageDefinition";

export default async function tasksForUri(
  uri: vscode.Uri
): Promise<vscode.Task[]> {
  const packageDefinition = await fetchPackageDefinition(uri.fsPath);
  const task = TasksForPackage(packageDefinition);
  return task;
}
