import * as vscode from 'vscode';
import { PlatformTools } from 'typeorm/platform/PlatformTools';

/**
 * Gets all files for given directory mask
 * @param directories array of directory path's
 * @param formats file extensions to filter out
 */
export function getAllFiles(
  directories: string[],
  formats = ['.js', '.ts']
): string[] {
  const allFiles = directories.reduce(
    (allDirs, dir) => {
      return allDirs.concat(
        PlatformTools.load('glob').sync(PlatformTools.pathNormalize(dir))
      );
    },
    [] as string[]
  );

  return allFiles.filter(file => {
    const dtsExtension = file.substring(file.length - 5, file.length);
    return (
      formats.indexOf(PlatformTools.pathExtname(file)) !== -1 &&
      dtsExtension !== '.d.ts'
    );
  });
}

export function splitClassesAndStrings<T>(
  clsesAndStrings: (string | T)[]
): [T[], string[]] {
  return [
    clsesAndStrings.filter((cls): cls is T => typeof cls !== 'string'),
    clsesAndStrings.filter((str): str is string => typeof str === 'string')
  ];
}

export async function findTypescriptCompileOptions() {
  const tsconfigs = await vscode.workspace.findFiles('**/tsconfig.json');
  if (!tsconfigs || tsconfigs.length === 0) {
    throw new Error("Could not find a valid 'tsconfig.json'.");
  }
  return require(tsconfigs[0].fsPath);
}
