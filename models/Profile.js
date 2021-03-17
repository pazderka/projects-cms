const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

class Profile extends Model { }

Profile.init({
  // Model attributes are defined here
  office: {
    type: DataTypes.STRING,
    allowNull: false
  },

  position: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  teamLeader: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  tasksToday: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

}, {
  sequelize, // We need to pass the connection instance
  modelName: "Profile" // We need to choose the model name
});

module.exports = Profile;
