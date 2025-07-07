const server = {
  serverHost: process.env.CLUSTER_API_SERVER_HOST || "localhost",
  localFrontend: process.env.REMOTE_FRONTEND ? "" : "http://localhost:3000",
  serverPort: process.env.CLUSTER_API_SERVER_PORT || 5001,
};
module.exports = server;
