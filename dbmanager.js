
function DBManager(type) {
  if (type == 'ibeacon') {
    this.database = require('./ibeaconDB.js');
  } else if (type == 'distance') {
    this.database = require('./distanceDB.js');
  } else if (type == 'sound') {
    this.database = require('./soundDB.js');
  } else if (type == 'people_counter') {
    this.database = require('./pcDB.js');
  }
  if (!this.database.hasDB()) {
    this.database.createFile(); // data base file creation
  } else {
    this.database.openFile();
  }

  this.databaseType = type;

}

DBManager.prototype.setTable = function (tableName) {

    this.database.createTable(tableName);// data base table creation if not exists
    this.database.setTableName(tableName);
}

DBManager.prototype.save = function (timestamp, obj) {
  // TODO:check database is ready
  if (this.database.getTableName() == '') {
    return false;
  }
  if (this.databaseType == 'ibeacon') {
        this.database.insert(timestamp, obj.uuid, obj.accuracy);
  } else {
      this.database.insert(timestamp, obj);
  }
  return true;
}

DBManager.prototype.list = function () {
    this.database.showTableNames();
}

DBManager.prototype.inquire = function (condition, cb) {
  // TODO:check database is ready
  if (this.database.getTableName() == '') {
    cb(false);
    return;
  }
  // TODO:creating appropriate condition required

  if (typeof condition === 'string') {
      this.database.find(function (rows) {
          cb(rows);
      }, condition);
  } else {
    this.database.find(function (rows) {
        cb(rows);
    });
  }

}
DBManager.prototype.close = function () {
    this.database.closeDB();
    console.log('database closed');
}

module.exports = new DBManager('people_counter');
