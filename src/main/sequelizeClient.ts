import { Sequelize } from "sequelize";
import env from "@main/config/env";
import ApiError from "@presentation/error-handling/api-error";

let sequelize: Sequelize;

sequelize = new Sequelize(env.postgressURL, {
  logging: false,
});
if (sequelize === undefined) {
  console.log("undefine error pass siliently");
}

sequelize.authenticate()
  .then(() => {
    console.log('connected..')
  })
  .catch(err => {
    console.log('Error' + err)
  })

const db = {};



export default sequelize;
