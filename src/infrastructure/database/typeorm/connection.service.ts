import { DBConnectionService } from '@core/abstracts/db-connection.service';
import { Injectable } from '@nestjs/common';
import { DataSource, getConnectionManager } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class ConnectionService extends DBConnectionService {
  readonly databaseName = 'rotazio';
  readonly type = 'postgres';

  private connectionManager = getConnectionManager();

  constructor(@InjectDataSource() private dataSource: DataSource) {
    super();
  }

  onConnected(callback) {
    if (callback) {
      // callback();
    }
  }

  onError(callback) {
    if (callback) {
      // callback();
    }
  }

  isConnected() {
    return this.dataSource.isInitialized;
  }
}
