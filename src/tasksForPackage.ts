import * as vscode from "vscode";
import { SwiftTaskDefinition, RawPackageDefinition } from "./types";

export const TaskType = "swift";

export default function(
  rawPackageDefinition: RawPackageDefinition
): vscode.Task[] {
  const { packageDefinition, directory } = rawPackageDefinition;
  const tasks: vscode.Task[] = packageDefinition.targets
    .filter(task => task.type === "test")
    .map(task => {
      const taskDefinition: SwiftTaskDefinition = {
        directory,
        type: TaskType
      };
      const shellExecution = new vscode.ShellExecution(
        `swift test --package-path ${directory}`,
        {}
      );

      const scope = vscode.TaskScope.Workspace;
      const source = TaskType;
      return new vscode.Task(
        taskDefinition,
        scope,
        task.name,
        source,
        shellExecution,
        []
      );
    });

  return tasks;
}
