const mongoURL = `mongodb://${
  process.env.CLUSTER_MONGO_URL || "localhost"
}:27017`;

exports.mongoURL = mongoURL;
