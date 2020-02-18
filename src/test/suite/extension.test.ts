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

  // eslint-disable-next-line func-names
  test("tasks in source package are configured", async function() {
    this.timeout(5000);
    const tasks = await vscode.tasks.fetchTasks();
    expect(tasks).to.have.lengthOf(6);

    expect(tasks.map(task => task.name)).to.have.members([
      "build package: no-tests",
      "build target: no-tests",
      "build package: basic",
      "build target: basic",
      "test target: basicTests",
      "test package: basic"
    ]);
  });
});
