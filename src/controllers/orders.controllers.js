require("dotenv").config();
const { Order, Users, Products } = require("../db.js");
const sendMail = require("./mailer.controllers.js");
const {orderSuccess} = require('../Templates/Order_Success')

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
      res.status(404).send({ error });
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
      res.status(404).send({ error });
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
      res.status(404).send({ error });
    }

  },

  postOrder: async (req, res) => {
    //products array de objetos con products ID + quantity
    const {  UserId, products,shipmentAddress,postalCode  } = req.body;
    console.log("here", UserId, products);

    let orderId = null;

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
          
          orderId = order.dataValues.id
          console.log("Flas order", orderId)

          // orderId = order.getDataValue("id")

          console.log("Flas orderID",orderId);

          for await  (let p of products) {
            let respuesta= await order.addProducts(p.id, { through: { unitPrice: p.price,quantity: p.amount}})
            arr.push(respuesta[0].dataValues)
            Products.update({stock:(Number(p.stock)-Number(p.amount))},{where:{id:p.id}})
      };

      Users.findOne({where: {id: UserId}}).then(user => {
        const email = user.dataValues.email

        console.log(orderSuccess(email,orderId))
        sendMail(email, orderSuccess(email,orderId))
      
      
      })


      res.send({msj: 'Order Created', arr})
      //Colocar sendMail(user, template)
    });
      })
    } catch (error) {
      res.status(403).send('Fail create order')
    }
  },
};
