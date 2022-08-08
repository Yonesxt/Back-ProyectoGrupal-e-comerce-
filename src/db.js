require('dotenv').config();
const { Sequelize, Op  } = require('sequelize');
const fs = require('fs');
const path = require('path');
const {
  DB_USER, DB_PASSWORD, DB_HOST,
} = process.env;
const sequelize = new Sequelize(`postgresql://ufjhsqppkc388rhoxopz:ZL5kMIlaMfxYPAtMGgtp@bajqed84sjwktsnobxem-postgresql.services.clever-cloud.com:5432/bajqed84sjwktsnobxem`, {
  logging: false, // set to console.log to see the raw SQL queries
  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
});
const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach(model => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);


// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Products,Categories,Commentary,Users,Order, Products_Orders } = sequelize.models;

// Aca vendrian las relaciones
// Product.hasMany(Reviews);


// Character - n*n-> Role
const Categories_Products = sequelize.define('Categories_Products', {}, { timestamps: false });
Products.belongsToMany(Categories, { through: Categories_Products });
Categories.belongsToMany(Products, { through: Categories_Products });

Commentary.belongsTo(Products);
Products.hasMany(Commentary);

Commentary.belongsTo(Users);
Users.hasMany(Commentary);

Order.belongsTo(Users);
Users.hasMany(Order);

Products.belongsToMany(Order, { through: Products_Orders });
Order.belongsToMany(Products, { through: Products_Orders });

const Favorites = sequelize.define('Favorites', {}, { timestamps: false });
Products.belongsToMany(Users, { through: Favorites });
Users.belongsToMany(Products, { through: Favorites });
module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize,     // para importart la conexión { conn } = require('./db.js');
};
