const express = require("express");
const router = express.Router();
const notifyController = require("../controller/controller.notify");

router.post("/notify", notifyController.sendNotification);
module.exports = router;
