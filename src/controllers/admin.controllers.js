const axios = require('axios');
require("dotenv").config();
const { User } = require('../db.js');

module.exports = {

    banUser : async (req, res) => {
        let { userId } = req.body;
        try{
            let userCheck = await User.findOne({
                where: {
                    id: userId,
                }
            })
            if(userCheck){
                await userCheck.update({
                    membership: 'Banned',
                })
                res.status(200).send(`User ${userCheck.name} has been banned from making reviews.`)
            } else {
                res.status(400).send('User not found.')
            }
        }catch(error){ 
            console.log(error)
        }
    },
    

    upgradeToAdmin : async (req, res) => {
        let { userId } = req.body;   
    try{
        let userCheck = await User.findOne({
            where:{
                id: userId,
            }
        })
        if(userCheck){
            await userCheck.update({
                membership: 'Admin',
            })
            res.status(200).send(`User ${userCheck.name} has been made an Admin.`)
        } else{
            res.status(400).send("User not found.")
        }
    }catch(error){
        console.log(error);
    }
    },



}