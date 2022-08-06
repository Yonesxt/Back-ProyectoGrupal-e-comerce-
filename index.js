const server = require('./src/app.js');
const {preLoadCategories} = require('./src/controllers/categories.controllers.js')
const {preLoadProducts} = require('./src/controllers/products.controllers.js')
const { conn } = require('./src/db.js');
const { Categories, Products, Categories_Products } = conn.models;




const port= process.env.PORT || 3001;
// Syncing all the models at once.
conn.sync({ force: false }).then(() => {
  server.listen(port, async () => {
    const products = await Products.findAll()
    if(!products.length){ 
    try {
      preLoadCategories();

    } finally{
      preLoadProducts();
    }
  }  
    console.log('%s listening at 3001'); // eslint-disable-line no-console
  });
});