const axios = require('axios');
require('dotenv').config();
const { conn } = require('../db.js');
const {Products, Categories} = conn.models;

module.exports = {
    getProductDetail : async (req, res) =>{
        const {id} = req.params;
       
            try {
                const product = await Products.findOne({
                    where: {id},
                    include : {
                        model :Categories
                    }
                });

                 res.send(product);

            } catch (error) {
                res.status(404).send('Product not found');
            }
        
    },

    deleteProduct : async (req, res) =>{
        const {id} = req.params;
        try {
           
            await Products.update({disable: true},{              
                where: {
                    id:id
                 }
                })
                      
            res.status(200).send('Product deleted!')

        } catch (error) {
            res.status(404).send(error);
        }

    }
};