require('dotenv').config();
const { Categories } = require('../db.js');


module.exports = {
    
    getCategories : async (req, res) =>{
        try {
            // Find all categories
            const categories = await Categories.findAll();

            return res.send(categories);
        
        } catch (error) {
            console.error(error);
            res.status(404).send({ error });
        }

    },
    
    preLoadCategories : async (req, res) => {
        try {
            const {data}=await axios("https://api.jsonstorage.net/v1/json/19873e5d-80e0-40cc-a575-5723cc2e4084/62a6ce49-696b-4e87-87e4-c9b7c74fbc7c")
            
            let cateArr = [];
            data.map((el) => {
                let cate = el.categories; 
                
                cateArr.push(cate)
            });
    
            let cateFlat = cateArr.flat();
    
            const cateSet = new Set(cateFlat);
            const cateResult = Array.from(cateSet)
    
            cateResult.map(async el => {
                await Categories.findOrCreate({
                    where:{name: el}
                })
            })
    
    
    
        } catch (error) {
            res.status(404).send({ error });
        }
    
    }
};