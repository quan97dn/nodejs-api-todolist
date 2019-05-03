"use strict";
module.exports = (sequelize, DataTypes) => {
  var ProductVariant = sequelize.define(
    "productVariants",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      variantId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      variantValueId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    },
    {
      classMethods: {
        associate: function(models) {
          // associations can be defined here
          ProductVariant.belongsTo(models.product, {
            foreignKey: "productId",
            as: "product"
          });
          ProductVariant.belongsTo(models.variant, {
            foreignKey: "variantId",
            as: "variant"
          });
          ProductVariant.belongsTo(models.variantvalue, {
            foreignKey: "variantValueId",
            as: "variantValue"
          });
        }
      }
    }
  );
  return ProductVariant;
};