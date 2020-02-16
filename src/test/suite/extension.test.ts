import * as vscode from "vscode";
import { expect } from "chai";
import { assertUnwrap } from "../assertUnwrap";

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  test("extension installed", () => {
    const extension = vscode.extensions.getExtension("aussiegeek.swifttasks");
    expect(extension).to.not.eq(null);
    assertUnwrap(extension, unwrappedExtension => {
      unwrappedExtension.activate();
    });
  });

  test("tasks in source package are configured", async () => {
    const tasks = await vscode.tasks.fetchTasks();
    expect(tasks).to.have.lengthOf(1);
    assertUnwrap(tasks[0], task => {
      expect(task.name).to.eq("basicTests");
      expect(task.source).to.eq("swift");
    });
  });
});
