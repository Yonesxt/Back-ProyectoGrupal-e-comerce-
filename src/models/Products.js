const sequelize = require('sequelize');
const {
    DataTypes
} = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('Products', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
          },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            // unique: true
        },
        image: {
            type: DataTypes.STRING,
        },
        price: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        stock: {
            type: DataTypes.INTEGER,
            defaultValue : 300,
        },
        brand: {
            type: DataTypes.STRING,
            allowNull: false,
        }, 
        rating: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
        },
        description: {
            type: DataTypes.TEXT,
        },
        disable: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        }
    }, {
        timestamps: false,

    });
};


