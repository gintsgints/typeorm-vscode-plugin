// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Connection } from 'typeorm';
import { TypeORMProvider } from './typeORMDataProvider';
import { readConfig } from './readConfig';
import { openDatabase } from './openDatabase';

let connection: Connection | null = null;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "typeorm" is now active!');

  let treeProvider = vscode.window.registerTreeDataProvider(
    'extension.typeormExplorer',
    new TypeORMProvider()
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let crconCommand = vscode.commands.registerCommand(
    'extension.connectDB',
    async () => {
      //
      // The code you place here will be executed every time your command is executed
      await readConfig();
      connection = await openDatabase();
    }
  );

  let readConfigCommand = vscode.commands.registerCommand(
    'extension.readConfig',
    async () => {
      await readConfig();
    }
  );

  let execSQLCommand = vscode.commands.registerCommand(
    'extension.execSQL',
    async () => {
      try {
        if (connection) {
          const rawData = await connection.query(`SELECT * FROM "user"`);
          console.log(rawData);
        }
      } catch (error) {
        console.error('Error while opening database: ', error);
      }
    }
  );

  context.subscriptions.push(treeProvider);
  context.subscriptions.push(readConfigCommand);
  context.subscriptions.push(crconCommand);
  context.subscriptions.push(execSQLCommand);
}

// this method is called when your extension is deactivated
export function deactivate() {}
