import { expect } from "chai";
import executionForTaskDefinition from "../../executionForTaskDefinition";
import { SwiftPackageTaskDefinition } from "../../types";

const directory = "/projects/foo";
suite("execution for definition", () => {
  test("test package", () => {
    const definition: SwiftPackageTaskDefinition = {
      directory,
      selector: { kind: "package" },
      taskType: "test",
      type: "swift"
    };

    expect(executionForTaskDefinition(definition)).to.deep.include({
      commandLine: "swift test --package-path /projects/foo",
      args: [],
      options: undefined
    });
  });
  test("build package", () => {
    const definition: SwiftPackageTaskDefinition = {
      directory,
      selector: { kind: "package" },
      taskType: "build",
      type: "swift"
    };

    expect(executionForTaskDefinition(definition)).to.deep.include({
      commandLine: "swift build --package-path /projects/foo",
      args: [],
      options: undefined
    });
  });
  test("test target", () => {
    const definition: SwiftPackageTaskDefinition = {
      directory,
      selector: { kind: "target", name: "basicTests" },
      taskType: "test",
      type: "swift"
    };
    expect(executionForTaskDefinition(definition)).to.deep.include({
      commandLine:
        "swift test --package-path /projects/foo --filter basicTests",
      args: [],
      options: undefined
    });
  });
  test("build target", () => {
    const definition: SwiftPackageTaskDefinition = {
      directory,
      selector: { kind: "target", name: "basic" },
      taskType: "build",
      type: "swift"
    };

    expect(executionForTaskDefinition(definition)).to.deep.include({
      commandLine: "swift build --package-path /projects/foo --target basic",
      args: [],
      options: undefined
    });
  });
});
