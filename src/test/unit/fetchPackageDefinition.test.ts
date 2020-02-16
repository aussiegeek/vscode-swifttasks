import { expect } from "chai";
import * as path from "path";
import fetchPackageDefinition from "../../fetchPackageDefinition";

suite("fetch package definition", () => {
  test("successfully fetches a definition", async () => {
    const definitionPath = path.join(
      __dirname,
      "../../../test-packages/basic/Package.swift"
    );

    const results = await fetchPackageDefinition(definitionPath);
    expect(results.packageDefinition).to.include({ name: "basic" });
  });
});
