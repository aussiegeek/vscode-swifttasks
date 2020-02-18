import * as path from "path";
import * as Mocha from "mocha";
import * as glob from "glob";

// eslint-disable-next-line import/prefer-default-export
export function run(): Promise<void> {
  // Create the mocha test
  const mocha = new Mocha({
    ui: "tdd"
  });
  mocha.useColors(true);

  const testsRoot = path.resolve(__dirname, "..");

  return new Promise((c, error) => {
    glob("**/**.test.js", { cwd: testsRoot }, (globError, files) => {
      if (globError) {
        return error(globError);
      }

      // Add files to the test suite
      files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));

      try {
        // Run the mocha test
        mocha.run(failures => {
          if (failures > 0) {
            error(new Error(`${failures} tests failed.`));
          } else {
            c();
          }
        });
      } catch (error_) {
        // eslint-disable-next-line no-console
        console.error(error_);
        error_(error_);
      }
    });
  });
}
