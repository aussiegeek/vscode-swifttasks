import * as vscode from "vscode";
import { ProviderResult } from "vscode";
import { TaskType } from "./tasksForPackage";
import tasksForUri from "./tasksForUri";

export { TaskType };

export default class SwiftTaskProvider implements vscode.TaskProvider {
  private packageFileGlob = "**/Package.swift";

  private filesystemTaskCache: vscode.Task[] | undefined;

  static TaskType = TaskType;

  async fetchAndSetTasks(): Promise<vscode.Task[]> {
    this.filesystemTaskCache = await this.fetchAllTasks();
    return this.filesystemTaskCache;
  }

  async fetchCachedTasks(): Promise<vscode.Task[]> {
    if (this.filesystemTaskCache) {
      return this.filesystemTaskCache;
    }
    return this.fetchAndSetTasks();
  }

  async fetchAllTasks(): Promise<vscode.Task[]> {
    const uris = await vscode.workspace.findFiles(this.packageFileGlob);
    return uris.reduce<Promise<vscode.Task[]>>(
      async (accumulatorPromise, uri: vscode.Uri) => {
        const accumulator = await accumulatorPromise;

        const uriTasks = await tasksForUri(uri);
        accumulator.push(...uriTasks);
        return accumulator;
      },
      Promise.resolve([])
    );
  }

  provideTasks(): vscode.ProviderResult<vscode.Task[]> {
    return this.fetchCachedTasks();
  }

  // eslint-disable-next-line class-methods-use-this
  resolveTask(task: vscode.Task): ProviderResult<vscode.Task> {
    return task;
  }
}
