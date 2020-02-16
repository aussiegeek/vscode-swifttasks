import { expect } from "chai";
import * as vscode from "vscode";
import { assertUnwrap } from "../assertUnwrap";
import tasksForPackage from "../../tasksForPackage";
import { SwiftPackageDefinition } from "../../types";

suite("tasks for package", () => {
  test("create test task", () => {
    const packageDefinition: SwiftPackageDefinition = {
      name: "basic",
      targets: [
        {
          name: "basic",
          type: "regular"
        },
        {
          name: "basic: tests",
          type: "test"
        }
      ]
    };
    const directory = "/projects/foo";
    const tasks = tasksForPackage({
      packageDefinition,
      directory
    });

    assertUnwrap(tasks, unwrappedTasks => {
      expect(unwrappedTasks).to.have.lengthOf(1);

      const task = unwrappedTasks[0];
      expect(task).to.include({
        name: "basic: tests",
        scope: vscode.TaskScope.Workspace,
        source: "swift"
      });
      expect(task.definition).to.include({
        type: "swift",
        directory: "/projects/foo"
      });

      assertUnwrap(task.execution, execution => {
        if (execution instanceof vscode.ShellExecution) {
          expect(execution.commandLine).to.eq(
            `swift test --package-path ${directory}`
          );
        } else {
          expect.fail("execution is not a shell execution");
        }
      });
    });
  });
});
