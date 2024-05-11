const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
const corsOptions = {
  origin: ["*"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true,
};

app.use(cors(corsOptions));
const notifyRoute = require("./router/route.notify");
app.use("/api", notifyRoute);
app.listen("9929", () => {
  console.log(`server running at : ${9929}`);
});
