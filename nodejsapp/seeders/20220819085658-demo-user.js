const bcrypt = require("bcrypt");
("use strict");

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    return queryInterface.bulkInsert("users", [
      {
        username: "admin",
        password: bcrypt.hashSync("admin", 10),
        fullname: "Administrator",
        role: "Admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "didil",
        password: bcrypt.hashSync("didil", 10),
        fullname: "Muhammad Fadhilah Sukmojatmiko",
        role: "User",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
