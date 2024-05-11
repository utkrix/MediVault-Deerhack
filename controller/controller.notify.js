const sendNotification = async (req, res) => {
  try {
    let { notification } = req.body;
    console.log(notification);
    const response = await fetch("https://ntfy.sh/medical_dispenser", {
      method: "POST",
      body: notification,
    });
    return res.status(200).json({ status: true, msg: "Good Job" });
  } catch (err) {
    return res.status(400).json({ status: false, msg: err.message });
  }
};
module.exports = {
  sendNotification,
};
