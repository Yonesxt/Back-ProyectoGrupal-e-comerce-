const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  
  sequelize.define('Products_Orders', {
    quantity: {
        type : DataTypes.INTEGER,
        allowNull:false,
        defaultValue : 0
    },
    unitPrice : {
        type : DataTypes.FLOAT,
        allowNull : false,
    }
  },
  {
    timestamps: false ,
    
  }
  );
};