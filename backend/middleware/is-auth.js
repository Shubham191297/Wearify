module.exports = (req, res, next) => {
  if (!req.user) {
    res.status(401).send({
      message: "Not Authenticated. Please log in to continue.",
    });
  } else {
    next();
  }
};
