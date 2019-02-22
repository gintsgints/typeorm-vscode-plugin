import * as vscode from 'vscode';
import * as dotenv from 'dotenv';

export async function readConfig() {
  const result = await vscode.workspace.findFiles('**/.env');

  result.forEach(async uri => {
    const envdoc = await vscode.workspace.openTextDocument(uri);
    const envConfig = dotenv.parse(envdoc.getText());
    for (let k in envConfig) {
      process.env[k] = envConfig[k];
    }
  });
  await Promise.all(result);
}
