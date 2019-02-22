import * as vscode from 'vscode';
import { getConnectionManager, EntityMetadata, Connection } from 'typeorm';
import { openDatabase } from './openDatabase';

interface TypeOrmObject {
  readonly id: string;
  readonly metadata?: any;
  getChildren(): vscode.ProviderResult<TypeOrmObject[]>;
  getTreeItem(): vscode.TreeItem | Thenable<vscode.TreeItem>;
}

export class TypeORMProvider implements vscode.TreeDataProvider<TypeOrmObject> {
  onDidChangeTreeData?:
    | vscode.Event<TypeOrmObject | null | undefined>
    | undefined;
  getTreeItem(
    element: TypeOrmObject
  ): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element.getTreeItem();
  }
  getChildren(
    element?: TypeOrmObject | undefined
  ): vscode.ProviderResult<TypeOrmObject[]> {
    if (element) {
      return element.getChildren();
    } else {
      return this.getConnections();
    }
  }

  private async getConnections(): Promise<TypeOrmObject[]> {
    const manager = getConnectionManager();

    if (manager.connections.length === 0) {
      await openDatabase();
    }

    return manager.connections.map(connection => {
      return new TypeOrmConnection(connection);
    });
  }
}

class TypeOrmConnection implements TypeOrmObject {
  id: string;
  metadata: Connection;

  constructor(connection: Connection) {
    this.metadata = connection;
    this.id = connection.name;
  }

  getChildren(): TypeOrmObject[] {
    const entities = this.metadata.entityMetadatas;
    return entities.map(entity => {
      return new TypeOrmEntity(entity);
    });
  }

  getTreeItem(): vscode.TreeItem {
    const treeItem = new vscode.TreeItem(this.id);
    treeItem.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
    return treeItem;
  }
}

class TypeOrmEntity implements TypeOrmObject {
  id: string;
  metadata: EntityMetadata;

  constructor(entity: EntityMetadata) {
    this.metadata = entity;
    this.id = entity.name;
  }

  getChildren(): TypeOrmObject[] {
    return [];
  }

  getTreeItem(): vscode.TreeItem {
    const treeItem = new vscode.TreeItem(this.id);
    return treeItem;
  }
}
