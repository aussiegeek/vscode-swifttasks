import * as childProcess from "child_process";
import * as path from "path";
import * as util from "util";
import { RawPackageDefinition } from "./types";

const exec = util.promisify(childProcess.exec);

export default async function FetchPackageDefinition(
  definitionPath: string
): Promise<RawPackageDefinition> {
  const directory = path.dirname(definitionPath);
  const results = await exec(
    `swift package --package-path ${directory} dump-package`,
    {}
  );

  const packageDefinition = JSON.parse(results.stdout);
  return { packageDefinition, directory };
}
