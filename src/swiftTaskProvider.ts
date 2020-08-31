import * as vscode from "vscode";
import { ProviderResult, window } from "vscode";
import { TaskType } from "./tasksForPackage";
import tasksForUri from "./tasksForUri";
import executionForTaskDefinition from "./executionForTaskDefinition";

export { TaskType };

export default class SwiftTaskProvider implements vscode.TaskProvider {
  private packageFileGlob = "**/Package.swift";

  private filesystemTaskCache: vscode.Task[] | undefined;

  static TaskType = TaskType;

  async fetchAndSetTasks(): Promise<vscode.Task[]> {
    try {
      this.filesystemTaskCache = await this.fetchAllTasks();
    } catch (error) {
      window.showErrorMessage(error.message);
      return [];
    }
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
    const tasks = await uris.reduce<Promise<vscode.Task[]>>(
      async (accumulatorPromise, uri: vscode.Uri) => {
        const accumulator = await accumulatorPromise;

        const uriTasks = await tasksForUri(uri);
        accumulator.push(...uriTasks);
        return accumulator;
      },
      Promise.resolve([])
    );
    return tasks.map(originalTask => {
      const task = originalTask;
      task.execution = executionForTaskDefinition(originalTask.definition);
      return task;
    });
  }

  provideTasks(): vscode.ProviderResult<vscode.Task[]> {
    return this.fetchCachedTasks();
  }

  // eslint-disable-next-line class-methods-use-this
  resolveTask(originalTask: vscode.Task): ProviderResult<vscode.Task> {
    const task = originalTask;
    task.execution = executionForTaskDefinition(task.definition);
    if (task.execution) {
      return task;
    }
    return undefined;
  }
}
