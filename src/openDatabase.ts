import * as vscode from 'vscode';
import {
  ConnectionOptionsReader,
  Connection,
  getConnectionManager,
  PromiseUtils
} from 'typeorm';

export async function openDatabase(): Promise<Connection[]> {
  if (vscode.workspace.workspaceFolders) {
    if (vscode.workspace.workspaceFolders.length > 0) {
      const rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
      const options = await new ConnectionOptionsReader({
        root: rootPath
      }).all();
      const connections = options.map(option => {
        if (option.entities && option.entities.length !== 0) {
          Object.assign(
            option.entities,
            option.entities.map(entity => {
              return rootPath + '/' + entity;
            })
          );
        }
        return getConnectionManager().create(option);
      });
      return PromiseUtils.runInSequence(connections, connection =>
        connection.connect()
      );
    } else {
      return Promise.resolve([]);
    }
  } else {
    return Promise.resolve([]);
  }
}
