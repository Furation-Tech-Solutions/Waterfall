import { DataTypes } from "sequelize";
import sequelize from "@main/sequelizeClient";
import Realtors from "@data/realtors/model/realtor-model";
import Jobs from "@data/job/models/job-model";

const FeedBacks = sequelize.define('FeedBacks', {
  fromRealtor: { type: DataTypes.STRING, allowNull: false, },
  toRealtor: { type: DataTypes.STRING, allowNull: false  },
  jobId: { type: DataTypes.STRING, allowNull: false  },
  rating: { type: DataTypes.INTEGER, allowNull: false,  validate: { len: [1, 5] }   },
  description: { type: DataTypes.STRING, allowNull: false  }
});

// Define the association between FeedBacks and Realtor
// FeedBacks.belongsTo(Realtors, {
//   foreignKey: 'fromRealtor', // The name of the foreign key column in FeedBacks
//   targetKey: 'id' // The name of the target key column in Realtor
// });

// Define the association between FeedBacks and Realtor
// FeedBacks.belongsTo(Realtors, {
//   foreignKey: 'toRealtor', // The name of the foreign key column in FeedBacks
//   targetKey: 'id' // The name of the target key column in Realtor
// });

// Define the association between FeedBacks and Realtor
// FeedBacks.belongsTo(Jobs, {
//   foreignKey: 'jobId', // The name of the foreign key column in FeedBacks
//   targetKey: 'id' // The name of the target key column in Realtor
// });

(async () => {
  await sequelize.sync({ force: false });
  // Code here
})();

export default FeedBacks;