import * as vscode from 'vscode';
import { createConnection, Connection } from 'typeorm';

export async function openDatabase(): Promise<Connection | null> {
  let myentities: Array<string> = [];
  if (vscode.workspace.workspaceFolders) {
    myentities = vscode.workspace.workspaceFolders.map(element => {
      return element.uri.fsPath + '/' + process.env.TYPEORM_ENTITIES;
    });
  }
  const dbConfig: any = {
    type:
      process.env.TYPEORM_CONNECTION || process.env.DB_CONNECTION || 'postgres',
    host: process.env.TYPEORM_HOST || process.env.DB_HOST || 'localhost',
    port: process.env.TYPEORM_PORT || process.env.DB_PORT || 5432,
    username:
      process.env.TYPEORM_USERNAME || process.env.DB_USERNAME || 'postgres',
    password:
      process.env.TYPEORM_PASSWORD || process.env.DB_PASSWORD || 'postgres_234',
    database:
      process.env.TYPEORM_DATABASE || process.env.DB_DATABASE || 'postgres',
    entities: myentities,
    synchronize:
      process.env.TYPEORM_SYNCHRONIZE === 'true' ||
      process.env.DB_SYNCHRONIZE === 'true' ||
      true,
    logging:
      process.env.TYPEORM_LOGGING === 'true' ||
      process.env.DB_LOGGING === 'true' ||
      true
  };

  try {
    const connection = await createConnection(dbConfig);
    // vscode.window.showInformationMessage('Database Connected');
    return connection;
  } catch (error) {
    console.error('Error while opening database: ', error);
    return null;
  }
}
