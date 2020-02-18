import { expect } from "chai";
import * as vscode from "vscode";
import { assertUnwrap } from "../assertUnwrap";
import tasksForPackage from "../../tasksForPackage";
import { SwiftPackageDefinition } from "../../types";

const directory = "/projects/foo";
suite("tasks for package", () => {
  test("create test task", () => {
    const packageDefinition: SwiftPackageDefinition = {
      name: "basic",
      targets: [
        {
          name: "basicTests",
          type: "test"
        }
      ]
    };

    assertUnwrap(
      tasksForPackage({
        packageDefinition,
        directory
      }),
      tasks => {
        expect(tasks).to.have.lengthOf(2);
        assertUnwrap(
          tasks.find(task => task.name === "test target: basicTests"),
          testTask => {
            expect(testTask).to.deep.include({
              name: "test target: basicTests",
              scope: vscode.TaskScope.Workspace,
              source: "swift",
              definition: {
                type: "swift",
                directory: "/projects/foo",
                selector: { kind: "target", name: "basicTests" },
                taskType: "test"
              },
              problemMatchers: [],
              hasDefinedMatchers: true
            });
          }
        );
      }
    );
  });

  test("create build task", () => {
    const packageDefinition: SwiftPackageDefinition = {
      name: "basic",
      targets: [
        {
          name: "basic",
          type: "regular"
        }
      ]
    };

    assertUnwrap(
      tasksForPackage({
        packageDefinition,
        directory
      }),
      tasks => {
        expect(tasks).to.have.lengthOf(2);
        assertUnwrap(
          tasks.find(task => task.name === "build target: basic"),
          testTask => {
            expect(testTask).to.deep.include({
              name: "build target: basic",
              scope: vscode.TaskScope.Workspace,
              source: "swift",
              definition: {
                type: "swift",
                directory: "/projects/foo",
                selector: { kind: "target", name: "basic" },
                taskType: "build"
              },
              problemMatchers: [],
              hasDefinedMatchers: true
            });
          }
        );
      }
    );
  });

  test("package with two test targets", () => {
    const packageDefinition: SwiftPackageDefinition = {
      name: "basic",
      targets: [
        {
          name: "basicTests",
          type: "test"
        },
        {
          name: "anotherTests",
          type: "test"
        }
      ]
    };
    const tasks = tasksForPackage({ packageDefinition, directory });
    expect(tasks.map(task => task.name)).to.have.members([
      "test target: basicTests",
      "test target: anotherTests",
      "test package: basic"
    ]);
  });
  test("package with no targets", () => {
    const packageDefinition: SwiftPackageDefinition = {
      name: "basic",
      targets: []
    };

    const tasks = tasksForPackage({
      packageDefinition,
      directory
    });

    expect(tasks).to.have.lengthOf(0);
  });

  test("build whole package", () => {
    const packageDefinition: SwiftPackageDefinition = {
      name: "basic",
      targets: [
        {
          name: "basic",
          type: "regular"
        }
      ]
    };

    const tasks = tasksForPackage({
      packageDefinition,
      directory
    });

    expect(tasks).to.have.lengthOf(2);
    expect(tasks.map(task => task.name)).to.have.members([
      "build package: basic",
      "build target: basic"
    ]);

    assertUnwrap(
      tasks.find(task => task.name === "build package: basic"),
      testTask => {
        expect(testTask).to.deep.include({
          name: "build package: basic",
          scope: vscode.TaskScope.Workspace,
          source: "swift",
          definition: {
            type: "swift",
            directory: "/projects/foo",
            selector: { kind: "package" },
            taskType: "build"
          },
          problemMatchers: [],
          hasDefinedMatchers: true
        });
      }
    );
  });
  test("test whole package", () => {
    const packageDefinition: SwiftPackageDefinition = {
      name: "basic",
      targets: [
        {
          name: "basicTests",
          type: "test"
        }
      ]
    };

    const tasks = tasksForPackage({
      packageDefinition,
      directory
    });

    expect(tasks).to.have.lengthOf(2);

    assertUnwrap(
      tasks.find(task => task.name === "test package: basic"),
      testTask => {
        expect(testTask).to.deep.include({
          scope: vscode.TaskScope.Workspace,
          source: "swift",
          definition: {
            type: "swift",
            directory: "/projects/foo",
            selector: { kind: "package" },
            taskType: "test"
          },
          problemMatchers: [],
          hasDefinedMatchers: true
        });
      }
    );
  });
});
