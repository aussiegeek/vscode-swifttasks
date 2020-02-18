import * as vscode from "vscode";
import {
  SwiftPackageTaskDefinition,
  RawPackageDefinition,
  SwiftPackageTaskType,
  SwiftTargetType,
  SwiftSelectors,
  isTask
} from "./types";

export const TaskType = "swift";

function targetTypeToTaskType(
  targetType: SwiftTargetType
): SwiftPackageTaskType {
  switch (targetType) {
    case "regular":
      return "build";
    case "test":
      return "test";
  }
}

function taskForSelector(
  selector: SwiftSelectors,
  directory: string,
  taskType: SwiftPackageTaskType,
  taskName: string
): vscode.Task {
  const taskDefinition: SwiftPackageTaskDefinition = {
    directory,
    taskType,
    selector,
    type: TaskType
  };

  return new vscode.Task(
    taskDefinition,
    vscode.TaskScope.Workspace,
    `${taskType} ${selector.kind}: ${taskName}`,
    TaskType,
    undefined,
    []
  );
}

function packageTask(
  rawPackageDefinition: RawPackageDefinition,
  targetType: SwiftTargetType
): vscode.Task | undefined {
  const { directory, packageDefinition } = rawPackageDefinition;

  const taskType = targetTypeToTaskType(targetType);

  if (!packageDefinition.targets.some(target => target.type === targetType)) {
    return undefined;
  }

  return taskForSelector(
    { kind: "package" },
    directory,
    taskType,
    packageDefinition.name
  );
}

export default function(
  rawPackageDefinition: RawPackageDefinition
): vscode.Task[] {
  const { packageDefinition, directory } = rawPackageDefinition;

  const tasks = packageDefinition.targets.map(target =>
    taskForSelector(
      { kind: "target", name: target.name },
      directory,
      targetTypeToTaskType(target.type),
      target.name
    )
  );

  const taskTypes: SwiftTargetType[] = ["regular", "test"];
  const packageTasks = taskTypes.map(taskType =>
    packageTask(rawPackageDefinition, taskType)
  );

  return [...tasks, ...packageTasks].filter(isTask);
}
