import * as vscode from "vscode";
// see https://github.com/apple/swift-package-manager/blob/master/Sources/PackageModel/Manifest.swift

export interface SwiftPackageDefinition {
  name: string;
  targets: SwiftTarget[];
}

export type SwiftTarget = SwiftTestTarget | SwiftBuildTarget;
interface SwiftBaseTarget {
  name: string;
}

export interface SwiftTestTarget extends SwiftBaseTarget {
  type: "test";
}

export interface SwiftBuildTarget extends SwiftBaseTarget {
  type: "regular";
}
export type SwiftTargetType = "regular" | "test";
export type SwiftPackageTaskType = "build" | "test";
export interface SwiftPackageTaskDefinition extends vscode.TaskDefinition {
  directory: string;
  selector: SwiftSelectors;
  taskType: SwiftPackageTaskType;
  type: "swift";
}
export type SwiftSelectors = SwiftPackageSelector | SwiftTargetSelector;
export interface SwiftPackageSelector {
  kind: "package";
}

export interface SwiftTargetSelector {
  kind: "target";
  name: string;
}

export interface RawPackageDefinition {
  packageDefinition: SwiftPackageDefinition;
  directory: string;
}

export function isTask(task: vscode.Task | undefined): task is vscode.Task {
  return task !== undefined && (task as vscode.Task).definition !== undefined;
}

export function isSwiftPackageDefinition(
  definition: vscode.TaskDefinition | SwiftPackageTaskDefinition
): definition is SwiftPackageTaskDefinition {
  return (definition as SwiftPackageTaskDefinition).selector !== undefined;
}
