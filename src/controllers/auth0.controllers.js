const { Users } = require('../db');
const sendMail = require('./mailer.controllers')
const {registerTemplate} = require('../Templates/register_Template.js')

module.exports = {
    infoProfile: async (req, res, next) => {
        const user = req.body;

        Users.findOne({where :{email:user.email}}).then(aux =>{
            if(!aux){
                Users.create({
                            firstname: user.given_name,
                            lastname: user.family_name,
                            username: user.nickname,
                            email: user.email,
                            profileImage: user.picture.toString(),
                }).then(userCreate => { 
                    res.send(userCreate)
                    sendMail(userCreate.email, registerTemplate)
                });
            } else {
                if(aux.getDataValue('disable')) return res.status(401).send({msj : `User disable : ${user}`})
                return res.send(aux.dataValues)
            }}).catch(error => res.send(error))
    }
}