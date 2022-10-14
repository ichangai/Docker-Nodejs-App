const express = require("express");
const mongoose = require("mongoose");
const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
  SESSION_SECRET,
  REDIS_URL,
  REDIS_PORT,
} = require("./config/config");
const app = express();
const cors = require("cors");
const session = require("express-session");
const redis  =  require ( 'redis' );
let RedisStore = require("connect-redis")(session);


mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
  mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch((e) => {
    console.log(e);
    setTimeout(connectWithRetry, 5000);
  });
}

connectWithRetry();

const port = process.env.PORT || 3000;


const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");

let redisClient = redis.createClient({
  host: REDIS_URL,
  port: REDIS_PORT,
});
app.enable("trust proxy");
app.use(express.json());
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    cookie: {
      resave: false,
      saveUninitialized: false,
      secure: false,
      httpOnly: true,
      maxAge: 30000,
    },
  })
);
app.use(cors({}));
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/users", userRoutes);

app.get("/api/v1", (req, res) => {
  res.send("Docker Compose for Dev ENV");
  console.log("Glorious Purpose"); 
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
