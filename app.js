var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

const mongoose = require("mongoose");
const multer = require("multer");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(
    "mongodb+srv://AkhilaP:cyg4elnmZYfslmqv@cluster0.mvva0vw.mongodb.net/Login?retryWrites=true&w=majority"
  );
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "./uploads")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

//image upload
const imageSchema = new mongoose.Schema({
  name: String,
  image: String,
});

const Image = mongoose.model("Image", imageSchema);

const Storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: Storage });

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const data = await Image({
      name: req.body.name,
      image:req.file.filename
    });
    data.save()
    res.json(data);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get("/", (req, res) => {
  res.json({ msg: "success" });
});

// app.get('/:id', (req, res) => {
//   const { id } = req.params;

//   Image.findById(id, (err, image) => {
//     if (err) {
//       console.error(err);
//       res.status(500).send('Server error');
//     } else if (!image) {
//       res.status(404).send('Image not found');
//     } else {
//       res.set('Content-Type', image.contentType);
//       res.send(image.image.data);
//     }
//   });
// });

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
