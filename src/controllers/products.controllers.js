const axios = require("axios");
require("dotenv").config();
const { conn } = require("../db.js");
const { Products, Categories_Products, Categories } = conn.models;
const { Op } = require('sequelize');
const productList = require('../asset/productList');

const reducer = (previousValue, currentValue) => previousValue.concat(currentValue);
module.exports = {
  getProducts: async (req, res) => {
    const { name } = req.query;

    if (!name) {
      const productsBd = await Products.findAll({
        where:{ disable:false},
        include: { model: Categories },
      });
    

      if (productsBd.length > 0) return res.send(productsBd);
      else return res.status(404).send('Products not found');


    } else {

      const productsBdByName = await Products.findAll({
        where : {
          name : { [Op.iLike]: `%${name}%`}},
        include : { model: Categories },
        limit : 15
      });
    
      if (productsBdByName.length > 0) return res.send(productsBdByName);
      else return res.status(404).send('Product not found');
    }
  },
  getFilter: async(req,res)=>{
    let arr=[]
    if(!req.body){
      return res.status(404).send('Products not found');
    }
    const {praice,brand,order,categorie}=req.body
    let min = 0;
    let max = 0;
    if(!!praice){
      if(!!praice.min){
        min=praice.min
      }
      if(!!praice.max){
        max=praice.max
      }
    }

    const productsBd = await Products.findAll({
      include: { model: Categories },
    });
    let auxproductsBd=productsBd
    brand?.length>0 && brand.map(e=>{
      if(e){
      arr.push(auxproductsBd.filter(elemt => elemt.brand== e ))
      } 
    })
     arr?.length>0 && (auxproductsBd= arr.reduce(reducer));
    if(!!order && order=="minor"){
      auxproductsBd.sort(function(a, b) {
      if (Number(a.price) > Number(b.price)) {
        return 1;
      }
      if (Number(a.price)  < Number(b.price)) {
        return -1;
      }
      return 0;
    });
     }
    else if(!!order && order=="higher"){
      auxproductsBd.sort(function(a, b) {
        if (Number(a.price) < Number(b.price)) {
          return 1;
        }
        if (Number(a.price)  > Number(b.price)) {
          return -1;
        }
        return 0;
      });
    }
    else if(!!order && order=="Asc"){
      auxproductsBd.sort(function(a,b){
        if(a.name > b.name){
          return 1;
        };
        if (a.name < b.name){
          return -1
        };
        return 0
      })
    }
    else if (!!order && order=="Desc") {
      auxproductsBd.sort(function (a,b){
        if(a.name> b.name){
          return -1;
        };
        if(a.name < b.name){
          return 1;
        };
        return 0
      })
    }
      if(min || max ){
        if(!!min){
          auxproductsBd = auxproductsBd.filter(elemt => Number(elemt.price) > Number(min));
        }
        if(!!max){
          auxproductsBd = auxproductsBd.filter(elemt => Number(elemt.price) < Number(max));
        }
      }
    
    if(!!categorie){
      auxproductsBd = auxproductsBd.filter(elemt => elemt.Categories?.map(elemt => elemt.name.toLowerCase()) == categorie.toLowerCase() )
    }
    if(!auxproductsBd.length){
      return res.status(404).send('Product not found');
    }
    else return res.send(auxproductsBd);
  },

  filterByCategories : async ( req, res) => {
    try {
        
      const productsBd = await Products.findAll({
        include: { model: Categories },
      });

      const categoryQuery = req.query.cat

      const filterCategory = productsBd.filter(el => el.Categories?.map(el => el.name.toLowerCase()) == categoryQuery.toLowerCase() )

      if(categoryQuery){
        res.status(202).send(filterCategory)
      }else res.status(200).send(productsBd)
    
    } catch (error) {
      console.log('Flag log filterByCategory', error) 
    }
  },

  getOrderByName : async (req, res) => {
    const {order} = req.query;

    try {
      const productsBd = await Products.findAll({
        include: { model: Categories },
      });

      let sortedByName = order === 'A-Z' ?
      productsBd.sort(function (a, b){
          if(a.name.toString() > b.name.toString()) return 1;
          if(b.name.toString() > a.name.toString()) return -1;
          return 0;
      }) : 
      productsBd.sort(function(a,b){
          if(a.name.toString() > b.name.toString()) return -1;
          if(b.name.toString() > a.name.toString()) return 1;
          return 0;
      });

      res.send(sortedByName);
      
    } catch (error) {
      console.log(error)
    }
  },

  postProduct: async (req, res) => {
    const {categories, ...products} = req.body;
    //name image price stock brand rating description 
    try {
      if (!products.name || !products.price || !products.brand||!products.image ||!products.stock||!products.description ||!categories){
        
        return res
        .status(400)
        .send({ error: "Not all fields are required, but..." });
      }

    const product = await Products.create({...products});
       categories.forEach(async (e) => {
        const newCat = await Categories.findAll({ 
          where:{
            name: e
          }

        })
        await product.addCategories(newCat, { through: Categories_Products })
    });
   
    

      res.send({ msj: `Product added`, data: product });
    } catch (error) {
      console.error(error);
    }
  },

  preLoadProducts : async () =>{
    const upToDb = productList.map( async(el) => {
      try {

      const categories = await Categories.findAll();
      const { id } = categories?.find(elemt => elemt.name == el.categories.toString())
      const product = await Products.create({
        
              name: el.name,
              image: el.image,
              price: el.price,
              stock: 300,
              brand: el.brand,
              rating: el.calification,
              description: el.description.trim(),
      });
      // console.log(conn.models)
      await product.addCategories(id, { through: Categories_Products })
    } catch (error) {
        console.log(error)
    }
    })
  },

  getProductsByBrand : async (req, res) => {
    try {
      const { name } = req.query;
      const products = await Products.findAll({
        where: {
          name: { [Op.iLike]: `%${name}%`}
        },
        include: {
          model: Categories,
        },
      });
      if (!products.length) return res.send(' Product not found');

      else return res.send(products);

    } catch (error) {
      console.log(error);
    }
  },

  getAllBrand : (req, res) => {
    let brandArr = [];
    let brandMap = productList.map((el) => {
        let brand = el.brand;
        
        brandArr.push(brand)
    });

    let brandFlat = brandArr.flat();

    const brandSet = new Set(brandFlat);
    const brandResult = Array.from(brandSet)

    res.send(brandResult)
  },
  updateProduct: async (req, res) => {
    const {id, update } =req.body;
    
    const { name, price, brand, stock, description, image }=update
    if(!name || !price || !brand || !stock || !description || !image){
      
      return res.status(404).send("fill in all the data")
    }
    await Products.update(
      { name, price, brand, stock, description, image },
      { where: { id } }
    );
    return res.status(200).send("the product was changed");
  },
  updateStock: async (req, res) => {
    const {id, stock } =req.body;
       
    let newStock = stock.stock 

    await Products.update(
      { stock: newStock},
      { where: { id } }
    );
    return res.status(200).send("stock was changed");
  }
};
