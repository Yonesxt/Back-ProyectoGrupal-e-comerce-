require('dotenv').config();
const Stripe = require('stripe');


const stripe = new Stripe('sk_test_51LPdB5H9O09Vk58exIPgGzJJgrwQB0kAQ13aX3fy3Cbbfqy15M3tHnQErMFEzWudeknF9cWbmvPiQLyxdmkRTeOV00iBPBZOeQ')



// Ahora creamos la ruta a la que vamos a recibir los datos del post en el 
// frontend
module.exports ={ 
    stripe : async (req, res) => {
        const { id, amount } = req.body;
        try {
            const payment = await stripe.paymentIntents.create({
                currency: "USD",
                amount,
                description: "",  // lo que nos traiga desde la base de datos.
                payment_method: id,
                confirm: true
            });
            res.json({ msg: "Successful payment" })
        } catch(error) {
            res.json({ message: error.row.message })
        }
    }

};





