import { Sequelize, Model, DataTypes, BuildOptions } from 'sequelize';

const sequelize = new Sequelize('MinskCentralCustom', 'root', '1234', {
    host: "localhost",
    dialect: "mysql",
    define: {
        timestamps: false
    }
});

export default sequelize;