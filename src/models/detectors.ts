import { Sequelize, Model, DataTypes, BuildOptions } from 'sequelize';
import sequelize from '../utils/sequilize';


interface MyModel extends Model {
    readonly id: number,
    readonly location: string;
};

  type MyModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): MyModel;
};

const detector = <MyModelStatic>sequelize.define("detector", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

export default detector;
