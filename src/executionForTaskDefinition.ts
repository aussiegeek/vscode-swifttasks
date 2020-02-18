import * as vscode from "vscode";
import {
  SwiftPackageTaskDefinition,
  isSwiftPackageDefinition,
  SwiftPackageTaskType
} from "./types";

function filterForTask(taskType: SwiftPackageTaskType): string {
  switch (taskType) {
    case "build":
      return "--target";
    case "test":
      return "--filter";
  }
}

function selectorFilter(definition: SwiftPackageTaskDefinition): string {
  switch (definition.selector.kind) {
    case "package":
      return "";
    case "target":
      return ` ${filterForTask(definition.taskType)} ${
        definition.selector.name
      }`;
  }
}
function executionForSwiftPackageTaskDefinition(
  definition: SwiftPackageTaskDefinition
): vscode.ShellExecution {
  return new vscode.ShellExecution(
    `swift ${definition.taskType} --package-path ${
      definition.directory
    }${selectorFilter(definition)}`
  );
}

export default function executionForTaskDefinition(
  definition: vscode.TaskDefinition
): vscode.ShellExecution | vscode.ProcessExecution | undefined {
  if (isSwiftPackageDefinition(definition)) {
    return executionForSwiftPackageTaskDefinition(definition);
  }
  return undefined;
}
