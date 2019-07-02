import * as vscode from 'vscode';
// import { transpileModule, sys } from 'typescript';
import {
  // getConnectionManager,
  // EntityMetadata,
  // Connection,
  ConnectionOptions,
  ConnectionOptionsReader,
  Connection,
  getConnectionManager,
  EntityMetadata
} from 'typeorm';
// import {
//   getAllFiles,
//   splitClassesAndStrings,
//   findTypescriptCompileOptions
// } from './utils';
// import { openDatabase } from './openDatabase';

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
      return this.getConnectionOptions();
    }
  }

  // private async getConnections(): Promise<TypeOrmObject[]> {
  //   const manager = getConnectionManager();

  //   if (manager.connections.length === 0) {
  //     await openDatabase();
  //   }

  //   return manager.connections.map(connection => {
  //     return new TypeOrmConnection(connection);
  //   });
  // }

  private async getConnectionOptions(): Promise<TypeOrmObject[]> {
    if (vscode.workspace.workspaceFolders) {
      if (vscode.workspace.workspaceFolders.length > 0) {
        const rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
        const options = await new ConnectionOptionsReader({
          root: rootPath
        }).all();
        return options.map(option => {
          if (option.entities && option.entities.length !== 0) {
            Object.assign(
              option.entities,
              option.entities.map(entity => {
                return rootPath + '/' + entity;
              })
            );
          }
          return new TypeORMConnection(getConnectionManager().create(option));
        });
      } else {
        return Promise.resolve([]);
      }
    } else {
      return Promise.resolve([]);
    }
  }
}

class TypeORMConnection implements TypeOrmObject {
  id: string;
  metadata: Connection;

  constructor(connection: Connection) {
    this.metadata = connection;
    if (connection.name) {
      this.id = connection.name;
    } else {
      this.id = 'default';
    }
  }

  async getChildren(): Promise<TypeOrmObject[]> {
    await this.metadata.connect();
    // const [entityClassesOrSchemas, entityDirectories] = splitClassesAndStrings(
    //   this.metadata.entities || []
    // );
    // const files = getAllFiles(entityDirectories);
    // return files.map(file => {
    //   return new TypeOrmEntityFile(this.metadata.entities[index]., file);
    // });
    return this.metadata.entityMetadatas.map(
      (entityMetadata: EntityMetadata) => {
        return new TypeOrmEntity(entityMetadata);
      }
    );
  }

  getTreeItem(): vscode.TreeItem {
    const treeItem = new vscode.TreeItem(
      `${this.id} (${this.metadata.options.database})`
    );
    treeItem.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
    return treeItem;
  }
}

// class DummyObject implements TypeOrmObject {
//   constructor(readonly id: string, readonly diagnostic?: string) {}

//   getTreeItem(): vscode.TreeItem | Thenable<vscode.TreeItem> {
//     const treeItem = new vscode.TreeItem(
//       this.id,
//       vscode.TreeItemCollapsibleState.None
//     );
//     if (this.diagnostic) {
//       treeItem.tooltip = this.diagnostic;
//     }
//     return treeItem;
//   }

//   getChildren(): vscode.ProviderResult<TypeOrmObject[]> {
//     return [];
//   }
// }

// class TypeOrmEntityFile implements TypeOrmObject {
//   id: string;
//   metadata: any = undefined;
//   fullpath: string;

//   constructor(name: string, fullpath: string) {
//     this.id = name;
//     this.fullpath = fullpath;
//   }

//   async getChildren(): Promise<TypeOrmObject[]> {
//     try {
//       const entityts = sys.readFile(PlatformTools.pathResolve(this.fullpath));
//       const options = await findTypescriptCompileOptions();
//       if (entityts) {
//         const entityjs = transpileModule(entityts, options.compilerOptions);
//         const requireFromString = require('require-from-string');
//         this.metadata = requireFromString(entityjs.outputText);
//       }
//       return Promise.resolve([new DummyObject('cool')]);
//     } catch (error) {
//       return Promise.resolve([new DummyObject(error)]);
//     }
//   }

//   getTreeItem(): vscode.TreeItem {
//     const treeItem = new vscode.TreeItem(this.id);
//     treeItem.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
//     return treeItem;
//   }
// }

// class TypeOrmConnection implements TypeOrmObject {
//   id: string;
//   metadata: Connection;

//   constructor(connection: Connection) {
//     this.metadata = connection;
//     this.id = connection.name;
//   }

//   getChildren(): TypeOrmObject[] {
//     const entities = this.metadata.entityMetadatas;
//     return entities.map(entity => {
//       return new TypeOrmEntity(entity);
//     });
//   }

//   getTreeItem(): vscode.TreeItem {
//     const treeItem = new vscode.TreeItem(
//       `${this.id} (${this.metadata.driver.database})`
//     );
//     treeItem.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
//     return treeItem;
//   }
// }

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
