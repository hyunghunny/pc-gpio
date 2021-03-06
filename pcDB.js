﻿var fs = require("fs");
var sqlite3 = require("sqlite3").verbose();
var database = null;
var table = '';
var dbfile = './pc.db';
/**
 * check whether database is existed
 *
 * @return true when it is existed or false.
 */
exports.hasDB = function () {

    var exists = fs.existsSync(dbfile);
    return exists;
};

exports.createFile = function () {

    console.log("Creating DB file.");
    fs.openSync(dbfile, "w");
    console.log("Done.");
    console.log("Getting DB file.");
    database = new sqlite3.Database(dbfile);
};

exports.openFile = function () {

    console.log("Getting DB file.");
    database = new sqlite3.Database(dbfile);
};

exports.createTable = function (defaultTableName) {
    var query = "CREATE TABLE IF NOT EXISTS " + defaultTableName +
    " (timestamp DATETIME DEFAULT CURRENT_TIMESTAMP PRIMARY KEY NOT NULL,value REAL NOT NULL)";
    database.run(query);
    table = defaultTableName;
    console.log(defaultTableName + ' created');
};

exports.insert = function (timestamp, value) {
    database.serialize(function () {
        var query = "INSERT INTO " + table + "(timestamp,value) VALUES (?,?)";
        var stmt = database.prepare(query);
        stmt.run(timestamp, value, function () {
            //console.log(timestamp + ", " + value);
        });
        stmt.finalize();
    });
};

// XXX:checking required
exports.insertAsync = function (timestamp, value, cb) {

      var query = "INSERT INTO " + table + "(timestamp,value) VALUES (?,?)";
      var stmt = database.prepare(query);
      stmt.run(timestamp, value, function (result) {
          //console.log(timestamp + ", " + value);
          cb(result);
          // how to know the result?
          stmt.finalize();
      });

};


exports.showTableNames = function () {
    database.all("SELECT name FROM sqlite_master WHERE type = 'table'",
    function (err, rows) {
        if (err) throw err;
        if (rows.length !== 0) {
            rows.forEach(function (row) {
                console.log('table name: ' + row.name);
            });
        }
    });
};

exports.getTableName = function () {
    if (table === '')
        console.log('Table is not loaded');
    else {
//        console.log('Table ' + table + ' loaded');
        return table;
    }
};

exports.setTableName = function (tableName) {
    if (typeof tableName === 'string')
        table = tableName;
};

exports.getDBType = function () {
    return 'people_counter';
};

exports.find = function (callback, condition) {
    database.serialize(function () {
        //condition은 사용자에게 입력받은 조건(where절)
        var stmt = '';
        if (typeof condition === 'string') {
            stmt = "SELECT * from " + table + " where " + condition;
        }
        else {
            stmt = "SELECT * from " + table;
        }
        database.all(stmt, function (err, rows) {
            if (err) throw err;
            if (rows.length !== 0) {
                callback(rows);//rows는 array
            }
            else {
                console.log("Data dose not exists");
            }
        });
    });
};
// XXX:this function requires verification
exports.findAsync = function (callback, condition) {
      //condition은 사용자에게 입력받은 조건(where절)
      var stmt = '';
      if (typeof condition === 'string') {
          stmt = "SELECT * from " + table + " where " + condition;
      }
      else {
          stmt = "SELECT * from " + table;
      }
      database.all(stmt, function (err, rows) {
          if (err) throw err;
          if (rows.length !== 0) {
              callback(rows);//rows는 array
          }
          else {
              console.log("Data dose not exists");
          }
      });
};

exports.closeDB = function () {
    database.close();
};
