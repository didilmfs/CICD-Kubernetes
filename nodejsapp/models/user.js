"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    // Method untuk enkripsi
    static #encrypt = (password) => bcrypt.hashSync(password, 10);

    static register = ({ username, password, fullname, role }) => {
      const encryptedPassword = this.#encrypt(password);
      return this.create({ username, password: encryptedPassword, fullname, role });
    };
    // Check password sama atau tidak
    checkPassword = (password) => bcrypt.compareSync(password, this.password);
    // Membuat jwt
    generateToken = () => {
      const payload = {
        id: this.id,
        username: this.username,
        role: this.role,
      };
      const secret = "rahasia";
      // Membuat token dari data-data diatas
      const token = jwt.sign(payload, secret);
      return token;
    };

    static authenticate = async ({ username, password }) => {
      try {
        console.log(username);
        const user = await this.findOne({ where: { username } });
        if (!user) return Promise.reject("User tidak ada, daftar dulu!");
        const isPasswordValid = user.checkPassword(password);
        if (!isPasswordValid) return Promise.reject("Password salah, cek lagi!");
        return Promise.resolve(user);
      } catch (err) {
        return Promise.reject(err);
      }
    };

    static update = async ({ username, password, fullname, role }) => {
      try {
        const user = await this.findOne({ where: { username } });
        if (!user) return Promise.reject("User tidak ada, daftar dulu!");
        const encryptedPassword = this.#encrypt(password);
        user.username = username;
        user.password = encryptedPassword;
        user.fullname = fullname;
        user.role = role;
        await user.save();
        return user;
      } catch (err) {
        return Promise.reject(err);
      }
    };

    static get = async (id) => {
      try {
        const user = await this.findOne({ where: { id } });
        if (!user) return Promise.reject("User tidak ada, daftar dulu!");
        return user;
      } catch (err) {
        return Promise.reject(err);
      }
    };

    static delete = async (id) => {
      try {
        const user = await this.findOne({ where: { id } });
        if (!user) return Promise.reject("User tidak ada, daftar dulu!");
        await this.destroy({ where: { id } });
        return user;
      } catch (err) {
        return Promise.reject(err);
      }
    };
  }
  user.init(
    {
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fullname: DataTypes.STRING,
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "User",
      },
    },
    {
      sequelize,
      modelName: "user",
    }
  );
  return user;
};
