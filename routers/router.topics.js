const express = require("express");
const { getTopics, postTopic } = require("../controllers/controller.topics");

const topicsRouter = express.Router();

topicsRouter.route("/").get(getTopics).post(postTopic);

module.exports = topicsRouter;
