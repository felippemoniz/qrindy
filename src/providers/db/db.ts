import { Injectable } from '@angular/core';

declare var openDatabase;


@Injectable()
export class DbProvider {

  private db;

  constructor() {
  }

  initDB(sql: string, dbName: string) {
    return new Promise((resolve) => {
      if (typeof window['sqlitePlugin'] === 'undefined') {
        //console.log('Using WebSql');

        this.db = openDatabase(dbName, '1.0', 'Offline document storage', 5 * 1024 * 1024);
        /*this.executeSql(sql).then(() => {
            resolve();
          }, () => {
            resolve();
          });*/
      } else {
        //console.log('Using SQLite');

        this.db = window['sqlitePlugin'].openDatabase({
          name: 'hunter.db',
          location: 2,
          androidDatabaseImplementation: 2,
          createFromLocation: 1
        }, () => {
        /*  this.executeSql(sql).then(() => {
              resolve();
            }, () => {
              resolve();
            });*/
        });
      }
    });
  }




  public executeSql(sql: string, params?: any[]) {
    return new Promise((resolve, reject) => {
      this.db.transaction(function (transaction) {
        transaction.executeSql(sql, params, function (transaction, result) {
          //console.log(transaction + 'OK');
          if (result.rows.length === 0) {
            resolve([]);
          } else {
            let obj = [];
            for (let i = 0; i < result.rows.length; i++) {
              obj.push(result.rows.item(i));
            }
            resolve(obj);
          }
        }, function (transaction, error) {
          console.error(transaction + 'Error');
          console.error(error);
          reject(error);
        });
      });
    });
  }


  public executeSqlInsert(sql: string, params?: any[]) {
    return new Promise((resolve, reject) => {
      this.db.transaction(function (transaction) {
        transaction.executeSql(sql, params, function (transaction, result) {
          //console.log(transaction + 'OK');
          if (result.rows.length === 0) {
            resolve(result.insertId);
          } else {
            let obj = [];
            for (let i = 0; i < result.rows.length; i++) {
              obj.push(result.rows.item(i));
            }
            resolve(obj);
          }
        }, function (transaction, error) {
          console.error(transaction + 'Error');
          console.error(error);
          reject(error);
        });
      });
    });
  }


  public getAll(tableName) {
    return this.executeSql(`SELECT * FROM ${tableName}`, []);
  }



  public getByField(tableName, valueField, fieldName, limit?) {
    let limitQuery = '';
    if (limit) {
      limitQuery = `LIMIT ${limit}`;
    }
    return this.executeSql(`SELECT * FROM ${tableName} where ${fieldName} = ? ${limitQuery}`, [valueField]);
  }

  public query(query) {
    return this.executeSql(query, []);
  }




  public save(tableName, data) {
    let sql = [];
    let values = [];
    let params = [];
    for (let key in data) {
      sql.push(key);
      values.push('?');
      if (Object.prototype.toString.call(data[key]) === '[object Array]') {
        params.push(JSON.stringify(data[key]));
      } else {
        params.push(data[key]);
      }
    }
    sql = [`INSERT INTO ${tableName} (`, sql.join(',')];
    values = ['(', values.join(',')];
    values.push(')');
    sql.push(') VALUES ');
    console.log(sql.join('') + "---------" + values.join('') + "parametros:"+ params)
    return this.executeSqlInsert(sql.join('') + values.join(''), params);
  }

  public delete(query, params?) {
    if (query.indexOf('DELETE') === -1) {
      return this.executeSql(`DELETE FROM ${query}`, []);
    }
    return this.executeSql(query, params || []);
  }


}
