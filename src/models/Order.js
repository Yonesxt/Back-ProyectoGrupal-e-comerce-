const { DataTypes, NOW } = require('sequelize');

module.exports = (sequelize) => {
  
  sequelize.define('Order', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: NOW
    },
    paymentMethod: {
      type: DataTypes.ENUM("creditCard"),
      allowNull: false,
      defaultValue: "creditCard"
      
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    state: {
      type: DataTypes.ENUM("completed", "canceled"),
      allowNull: false
    },
    paid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    shipmentAddress: {
        type: DataTypes.STRING,
        allowNull: false
    },
    postalCode : {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    timestamps: false ,
    
  }
  );
};