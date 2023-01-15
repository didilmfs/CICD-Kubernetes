const express = require("express");
const app = express();
const port = 2022;
const router = require("./router.js");
const passport = require("./lib/passport");
const swaggerJSON = require("./swagger.json");
const swaggerUI = require("swagger-ui-express");

app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(router);
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerJSON));

app.listen(port, () => console.log(`listening at http://localhost:${port}`));
