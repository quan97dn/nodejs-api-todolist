"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      "rolePermissions",
      {
        roleId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        permissionId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW
        }
      },
      {
        charset: "utf8mb4",
        collate: "utf8mb4_unicode_ci"
      }
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("rolePermissions");
  }
};
