const { error } = require("console");
const express = require("express");
const path = require("path");

const UPLOADS_FOLDER = "./uploads/";

const multer = require('multer');

// Define the storahge
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_FOLDER);
  },
  filename: (req, file, cb) => {
    // Important File.
    const fileExt = path.extname(file.originalname);
    const fileName =
      file.originalname
        .replace(fileExt, "")
        .toLowerCase()
        .split(" ")
        .join("-") +
      "" +
      Date.now();
    cb(null, fileName + fileExt);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000,
  },
  fileFilter: (req, file, cb) => {
    console.log(file);
    if (file.fieldname === "avatar") {
      if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
      ) {
        cb(null, true);
      } else {
        // cb(null, false)
        // or
        cb(new Error(" only .jpg, .png or .jpeg format allowed ! "));
      }
    } else if (file.fieldname === "doc") {
      if (file.mimetype === "application/pdf") {
        cb(null, true);
      } else {
        cb(new Error(" only .Pdf format allowed ! "));
      }
    } else {
      cb(new Error(" There was an unknown error "));
    }
  },
});

const app = express();

// For single file
// app.post('/', upload.single("avatar"), (req, res, next) => {
//   res.send('File Submitted successfully ')
// })

// // For multiple file upload
// app.post('/', upload.array("avatar",3), (req, res, next) => {
//   res.send('File Submitted successfully ')
// })

// For multiple uploads from multiple input filed
app.post(
  "/",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "doc", maxCount: 1 },
  ]),
  (req, res, next) => {
    console.log(req.files)
    res.send("File Submitted successfully ");
  }
);

// // For single file
// app.post("/", upload.single("avatar"), (req, res, next) => {
//   res.send("File Submitted successfully ");
// });

//  Error handling
app.use((err, req, res, next) => {
  if (err) {
    if (err instanceof multer.MulterError) {
      res.status(500).send("There was an uploas error !");
    } else {
      res.status(500).send(err.message);
    }
  } else {
    res.send(" success ");
  }
});

app.listen(3000, () => {
  console.log(` app is listen on port 3000`);
});
