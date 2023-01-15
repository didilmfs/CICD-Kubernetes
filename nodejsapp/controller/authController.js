const { user } = require("../models");
// const passport = require("../lib/passport");

function format(user) {
  const { id, username, role } = user;
  return {
    id,
    username,
    role,
    accessToken: user.generateToken(),
  };
}

module.exports = {
  login: (req, res, next) => {
    user
      .authenticate(req.body)
      .then((user) => {
        console.log(user.username, "berhasil login!");
        let user_data = format(user);
        console.log(user_data);
        res.header("Authorization", user_data.accessToken);
        res.json({ token: user_data.accessToken });
      })
      .catch((err) => res.send(err));
  },
  register: (req, res, next) => {
    user
      .register(req.body)
      .then((user) => {
        res.send(user);
      })
      .catch((err) => next(err));
  },
  update: (req, res, next) => {
    if (req.user.role != "Admin") {
      res.statusCode = 403;
      res.send("403 Forbidden");
    } else {
      user.update(req.body).then((user) => {
        res.send(user);
      });
    }
  },
  get: (req, res, next) => {
    if (req.user.id != req.params.id) {
      if (req.user.role != "Admin") {
        res.statusCode = 403;
        res.send("403 Forbidden");
      } else {
        user.get(req.params.id).then((user) => {
          res.send(user);
        });
      }
    } else {
      user.get(req.params.id).then((user) => {
        res.send(user);
      });
    }
  },
  delete: (req, res, next) => {
    if (req.user.role != "Admin") {
      res.statusCode = 403;
      res.send("403 Forbidden");
    } else {
      user.delete(req.params.id).then((user) => {
        res.send(user);
      });
    }
  },
  whoami: (req, res) => {
    const currentUser = req.user;
    console.log(currentUser);
    res.json({
      id: currentUser.id,
      username: currentUser.username,
      fullname: currentUser.fullname,
      role: currentUser.role,
    });
  },
};
