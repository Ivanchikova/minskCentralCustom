import { Sequelize, Model, DataTypes, BuildOptions } from 'sequelize';
import sequelize from '../utils/sequilize';


interface MyModel extends Model {
    readonly id: number,
    readonly jobVacancy: string,
    readonly description: string,
    readonly wage: string
};

  type MyModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): MyModel;
};

const freeVacancy = <MyModelStatic>sequelize.define("freeVacancy", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    jobVacancy: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    wage: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

export default freeVacancy;
