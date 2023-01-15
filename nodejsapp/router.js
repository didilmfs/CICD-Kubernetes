const express = require("express");
const router = express.Router();
const auth = require("./controller/authController");
const restrict = require("./middlewares/restrict");

router.post("/api/user/login", auth.login);
router.post("/api/user/register", auth.register);
router.put("/api/user/update", restrict, auth.update);
router.get("/api/user/data/:id", restrict, auth.get);
router.delete("/api/user/delete/:id", restrict, auth.delete);
router.get("/api/user/whoami", restrict, auth.whoami);

module.exports = router;
