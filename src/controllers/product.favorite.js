const {  Products,Users,Favorites } = require("../db.js");

module.exports = {
  favoritePost : async (req, res) => {
    const {idProducts,idUser}=req.body
    console.log(idUser)
    Users.findByPk(idUser).then((user) => {
      Products.findByPk(idProducts).then  (async(product) => {
        user.addProducts(product).then(respuesta=>{
          res.send({ respuesta}) } )
      }).catch((err) => {
        return res.status(404).send(err)
      });
 
    }).catch((err) => {
      return res.status(404).send(err)
    });
    
},
  deleteFavorite : async (req, res) => {
    const{idProducts,idUser}=req.body;
    await Favorites.destroy({ where: { ProductId: idProducts, UserId:idUser } });
    return res.send('the favorite was deleted')
},getUsersFavorite: async (req, res) => {
  const {id}=req.params
  if(!id){
    return res.status(404).send("ingrese id")
  }
  let user = await Users.findAll({
    attributes: { exclude: ["address", "postalCode","isAdmin","profileImage"] },
    where: { id: id },
    include: [
      { model: Products, 
        attributes: { exclude: ["description", "rating","disable","stock"] } ,
        through: { Favorites: [] } },
    ],
   
  });
  if (!user.length){
    return res.status(404).send("")
  }
  return res.send(user);
},
}