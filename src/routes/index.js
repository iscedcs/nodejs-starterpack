const { default: axios } = require("axios");
const { Router } = require("express");
const controllers = require("../controllers");
const config = require("../config");

const authenticate = (req, res, next) => {
  async function authenticateCheck() {
    const token = req.header("Authorization");
    try {
      const { data: auth } = await axios.post(
        config.auth.url + "/api/user-profile",
        {},
        {
          headers: {
            "Content-type": "application/json",
            Authorization: token,
          },
        }
      );

      if (auth.success === "true") {
        req.isce_auth = auth?.data?.user;
        next();
      } else {
        res.status(401).send({
          success: "false",
          message: "Unauthorized",
        });
      }
    } catch (error) {
      res.status(500).send({
        error,
        success: "false",
        message: "Unauthorized",
      });
    }
  }
  authenticateCheck();
};

const route = Router();

//Event routes

route.post("/api/events/create", authenticate, controllers.createEvent);
route.get("/api/events", authenticate, controllers.getEvents);
route.get("/api/events/search", authenticate, controllers.searchEvents);

route.get("/api/events/:id", authenticate, controllers.getEvent);
route.post("/api/events/:id", authenticate, controllers.updateEvent);
route.delete("/api/events/:id", authenticate, controllers.deleteEvent);
route.post("/api/events/:id/get-cards", controllers.getRequestedCards);

//route.post("/api/events/:id/card", authenticate, controllers.get);


//Card Event Routes
//route.get("/api/card/events", controllers.getPastEvents);
//route.get("/api/card/events/:id", controllers.getEvents);

//Attendee routes
route.post("/api/attendee/create", controllers.createAttendee);
//route.post("/api/attendee/update", controllers.updateAttendee);
route.get("/api/attendees/:id", controllers.getAttendees);

module.exports = route;
