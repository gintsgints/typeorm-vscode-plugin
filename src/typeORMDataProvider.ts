import * as vscode from 'vscode';
import { getConnectionManager, EntityMetadata } from 'typeorm';
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
    const manager = getConnectionManager();

    if (manager.connections.length === 0) {
      await openDatabase();
    }

    if (manager.connections[0]) {
      const entities = manager.connections[0].entityMetadatas;
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
