module.exports = (req, res, next) => {
  if (req.user?.email !== "admin@app.com") {
    res.status(403).send({
      message:
        "You are not authorized to access these resources. You would need admin privileges.",
    });
  } else {
    next();
  }
};
