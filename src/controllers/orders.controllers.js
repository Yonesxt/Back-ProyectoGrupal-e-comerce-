const axios = require("axios");
require("dotenv").config();
const { Order, Users, Products, Products_Orders } = require("../db.js");

module.exports = {
  getOrderById: async (req, res) => {
    const { id } = req.params;
    try {
      const order = await Order.findOne({
        where: { id },
        include: [{
          model: Users
        },{
          model: Products
        }
      ],
      });

      res.send(order);
    } catch (error) {
      console.log(error);
    }
  },
  getAllOrder: async (req, res) => {
    try {
      const order = await Order.findAll({
        include: [{
          model: Users
        },{
          model: Products
        }
      ],
      });
      res.send(order);
    } catch (error) {
      console.log(error);
    }

  },
  getAllByidUser: async (req, res) => {
    const { UserId } = req.body;
    console.log(UserId)
    try {
      const order = await Order.findAll({
        where:{UserId},
        include: [{
          model: Users
        },{
          model: Products
        }
      ],
      });
      res.send(order);
    } catch (error) {
      console.log(error);
    }

  },

  postOrder: async (req, res) => {
    //products array de objetos con products ID + quantity
    const {  UserId, products,shipmentAddress,postalCode  } = req.body;
    console.log("here", UserId, products)
    const arr=[]
    try {
      if (!UserId || !Object.keys(products))
        res.status(403).send({ msj: "Invalid params" });
      Users.findAll({ where: { id : UserId } }).then(user=>{
        const aux = {
        UserId,
        amount: products
          .map((e) => e.amount * e.price)
          .reduce((prev, next) => prev + next),
        shipmentAddress: shipmentAddress,
        postalCode:  postalCode,
        state:"completed",
        paid:true,
         };
        Order.create(aux).then(async(order)=>{
          for await  (let p of products) {
            let respuesta= await order.addProducts(p.id, { through: { unitPrice: p.price,quantity: p.amount}})
            arr.push(respuesta[0].dataValues)
            Products.update({stock:(Number(p.stock)-Number(p.amount))},{where:{id:p.id}})
      };
      res.send({msj: 'Order Created', arr})
    });
      })
    } catch (error) {
      res.status(403).send('Fail create order')
    }
  },
};
