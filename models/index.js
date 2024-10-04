const Sequelize = require('sequelize');
const process = require('process');
const db = {};
require('dotenv').config();
const { DataTypes } = require('sequelize');


let sequelizeOptions = {
  dialect: 'sqlite',
  logging: true, 
  storage: './database.sqlite',  // Specify the file to store the SQLite database
};

if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);
    const dialect = url.protocol.replace(':', ''); // Remove the trailing colon

    sequelizeOptions = {
      ...sequelizeOptions,
      dialect,
      ssl: true, 
      dialectOptions: {
        ssl: {
          require: true, 
          rejectUnauthorized: false,
        },
      },
    };
} else {
  // Local development database, configure SQLite storage location here
  sequelizeOptions = {
    ...sequelizeOptions,
    dialect: 'sqlite',
    storage: process.env.SQLITE_STORAGE || './database.sqlite',
  };
}

const sequelize = new Sequelize(sequelizeOptions);

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user.models')(sequelize, DataTypes);
db.Project = require('./projects.model')(sequelize, DataTypes);


//database relation between the user table and the project table
db.User.hasMany(db.Project, { foreignKey: 'agency', as: 'projects' });
db.Project.belongsTo(db.User, { foreignKey: 'agency', as: 'user' });

module.exports = db;
