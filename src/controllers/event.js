"use strict";

const { Op } = require("sequelize");
const { Event } = require("../models");
const logger = require("../util/log");

const createEvent = async (req, res) => {
  const data = await Event.create({
    user_id: req.isce_auth.user_id,
    image: req.body.image,
    title: req.body.title,
    description: req.body.description,
    start_date: req.body.start_date,
    end_date: "2022-04-10"
  });
  if(!data){
    res.json({ success: 'false', message: 'Unable to save event' })
  }
  res.json({ success: 'true', message: 'Event created successfully', data: req.body });
};

const updateEvent = async (req, res) => {
  const data = await Event.update(req.body, {
    where: {
      id: req.body.id,
    },
  });
  if(!data){
    res.json({
      success: 'false',
      message: 'Unable to update event'
    });
  }

  res.json({
    success: 'true',
    message: 'Event updated successfully!',
    data,
  });
};

const getEvents = async (req, res) => {
  /*
    #swagger.tags = ["Event"]
    #swagger.description = 'Get Events'
     #swagger.security = [{
               "apikey": []
        }]
  */
  let offset = 0,
    page = Number(req.query.page) || 1,
    limit = Number(req.query.limit) || 100;
  if (page > 1) {
    offset = limit * page;
    offset = offset - limit;
  }

  const all_events = await Event.findAll({ limit, offset });
  if(!all_events){
    res.json({ 
      success: 'false', 
      message: 'Unable to retrieve data'
    })
  }

  res.json({
    success: 'true',
    message: 'Data retrieved successfully',
    data: all_events
  })
};

const getEvent = async (req, res) => {
  /*
    #swagger.tags = ["Event"]
    #swagger.description = 'Get Event by id'
     #swagger.security = [{
               "apikey": []
        }]
  */

  const data = await Event.findOne({ where: { id: req.body.id } });
  if (!data) {
    res.json({ success: 'false', message: 'Unable to get event!' });
  } 

  res.json({ success: 'true', message: "Event retrieved successfully!" });
};

module.exports = {
  createEvent,
  updateEvent,
  getEvents,
  getEvent,
};
