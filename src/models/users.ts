import { Sequelize, Model, DataTypes, BuildOptions } from 'sequelize';
import sequelize from '../utils/sequilize';

interface ModelUser extends Model {
    readonly id: number,
    password: string,
    readonly email: string,
    resetTolen: string | undefined,
    resetTolenExp: number | undefined
};

  type MyModeUserlStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): ModelUser;
};

const user = <MyModeUserlStatic>sequelize.define("user", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    fio: {
        type: DataTypes.STRING,
        allowNull: false
    },
    login: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    avatarURL: {
        type: DataTypes.STRING
    },
    resetTolen: {
        type: DataTypes.STRING
    },
    resetTolenExp: {
        type: DataTypes.DATE
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    confirm: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

export default user;