import * as vscode from "vscode";
// see https://github.com/apple/swift-package-manager/blob/master/Sources/PackageModel/Manifest.swift

export interface SwiftPackageDefinition {
  name?: string;
  targets: SwiftTarget[];
}

type SwiftTarget = {
  type: "regular" | "test";
  name: string;
};

export interface SwiftTaskDefinition extends vscode.TaskDefinition {
  directory: string;
}

export interface RawPackageDefinition {
  packageDefinition: SwiftPackageDefinition;
  directory: string;
}
