const Sequelize = require('sequelize');
var config = require(__dirname + '/../config.json');

// Option 1: Passing parameters separately
const connection = new Sequelize(config.db.dbname, config.db.username, config.db.password, {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

connection.authenticate()
    .then(()=>{
        console.log('success : db connection established')
    })
    .catch(err=>{
        console.log('fail : Unable to connect to db\n',err)
    })

connection.sync({
  //force:true
});

module.exports = connection;