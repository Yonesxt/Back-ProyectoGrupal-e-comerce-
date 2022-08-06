const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  
  sequelize.define('Commentary', {
    text: {
        type: DataTypes.TEXT,
        allowNull:false,
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
  },
  {
    timestamps: false ,
    
  }
  );
};