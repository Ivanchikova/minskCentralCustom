import { Sequelize, Model, DataTypes, BuildOptions } from 'sequelize';

const sequelize = new Sequelize('Weather', 'root', '1234', {
    host: "localhost",
    dialect: "mysql"
});

export default sequelize;