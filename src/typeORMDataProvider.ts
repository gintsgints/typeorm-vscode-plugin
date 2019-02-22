import * as vscode from 'vscode';
import { getConnection, EntityMetadata, Connection } from 'typeorm';
import { readConfig } from './readConfig';
import { openDatabase } from './openDatabase';

export class TypeORMProvider implements vscode.TreeDataProvider<Model> {
  onDidChangeTreeData?: vscode.Event<Model | null | undefined> | undefined;
  getTreeItem(element: Model): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }
  getChildren(element?: Model | undefined): vscode.ProviderResult<Model[]> {
    if (element) {
      return [];
    } else {
      return this.getEntities();
    }
  }

  private async getEntities(): Promise<Model[]> {
    await readConfig();
    let connection: Connection | null;
    try {
      connection = getConnection('default');
    } catch (error) {
      connection = await openDatabase();
    }

    if (connection) {
      const entities = connection.entityMetadatas;
      const items = entities.map((entity: EntityMetadata) => {
        return new Model(entity.name);
      });
      return items;
    } else {
      return [new Model('DB not open')];
    }
  }
}

export class Model extends vscode.TreeItem {
  constructor(public readonly label: string) {
    super(label);
  }
}
