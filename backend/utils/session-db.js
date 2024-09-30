const session = require("express-session");
const genFunc = require("connect-pg-simple");

const PostgresqlStore = genFunc(session);

const sessionStore = new PostgresqlStore({
  conString: "postgres://sthapliyal:1319@localhost:5432/wearify",
  tableName: "session",
});

module.exports = session({
  secret: "My secret key",
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
});
