"use strict";
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const app = express();
const server = require("http").Server(app);
const bodyParser = require("body-parser");
const signale = require("signale");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("../swagger.json");
const routes = require("./routes");
const axios = require("axios");
const authenticate = require("./util/auth");

app.use(helmet());
app.disable("x-powered-by");

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerFile, {
    customCss: ".topbar{display: none}",
    customSiteTitle: "ISCE Events API",
    swaggerOptions: { filter: true, docExpansion: "none" },
  })
);

app.use("/assets", express.static("./src/storage"));

app.use(cors());

app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "50mb",
  })
);

app.use(
  bodyParser.json({
    limit: "50mb",
  })
);

app.use(async (req, res, next) => {
  await axios
    .post(
      "https://developer.isce.app/v1/auth/api/user-profile",
      {},
      {
        headers: {
          "Content-type": "application/json",
          Authorization: `${process.env.API_KEY}:${process.env.API_SECRET}`,
        },
      }
    )
    .then((response) => {
      const auth = response.data;
      req.isce_auth = auth?.data?.user;
      next();
    })
    .catch((err) => {
      res.json({
        success: "false",
        message: "Unauthorized",
      });
    });
});
app.use(routes);

//Handle error
app.use((err, req, res, next) => {
  signale.fatal(err.stack);
  res.status(500).send({
    success: false,
    status: false,
    error: "Something broken! Please contact the engineering team.",
    help: "Please check the docs.",
  });
});

//Handle 404
app.use((req, res, next) => {
  res.status(404).send({
    success: false,
    status: false,
    error: "Page not found or has been deleted.",
    help: "Please check the docs.",
  });
});

// Store the db connection and start listening on a port.
const startExpress = () => {
  server.listen(process.env.PORT);
};

// Start express gracefully
startExpress();
