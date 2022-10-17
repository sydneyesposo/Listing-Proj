module.exports = (req, res, next) => {
    if (!req.session.user) {
      res.send("<h2> You're not allowed to view this content! please log in first! </h2>");
      return;
    }
    next();
  };
  