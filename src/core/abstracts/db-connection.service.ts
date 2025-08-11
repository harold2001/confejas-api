export abstract class DBConnectionService {
  abstract readonly type: string;
  abstract readonly databaseName;

  abstract onConnected(callback?: () => void): void;

  // abstract onDisconnected(callback?: () => void): void;

  abstract onError(callback?: (error: any) => void): void;

  abstract isConnected(): boolean;
}
