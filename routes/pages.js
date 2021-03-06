const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const nodemailer = require("nodemailer");
const Cryptr = require("cryptr");
const cryptr = new Cryptr("myTotalySecretKey");

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

router.get("/", (req, res) => {
    res.render("index", {
      email: req.session.emailAddress,
    });
});
router.get("/register", (req, res) => {
  res.render("register", {
    email: req.session.emailAddress,
    loginn: req.session.loggedinUser,
    message: req.session.message,
  });
});

router.get("/login", (req, res) => {
  res.render("login", {
    loginn: req.session.loggedinUser,
    email: req.session.emailAddress,
    message: req.session.message,
  });
});

router.get("/forgetPassword", (req, res) => {
  res.render("forgetPassword", {
    loginn: req.session.loggedinUser,
    email: req.session.emailAddress,
    message: req.session.message,
  });
});

router.get("/logout", function (req, res) {
  req.session.destroy();
  res.redirect("/");
});

router.get("/contactus", (req, res) => {
  res.render("contactus", {
    email: req.session.emailAddress,
    loginn: req.session.loggedinUser,
    adminn: req.session.adminUser,
    ownerr: req.session.ownerUser,
  });
});

router.get("/Useragreement", (req, res) => {
  res.render("Useragreement", {
    email: req.session.emailAddress,
    loginn: req.session.loggedinUser,
    adminn: req.session.adminUser,
    ownerr: req.session.ownerUser,
  });
});



router.get("/aboutus", (req, res) => {
  res.render("aboutus", {
    email: req.session.emailAddress,
    loginn: req.session.loggedinUser,
    adminn: req.session.adminUser,
    ownerr: req.session.ownerUser,
  });
});

router.get("/privacypolicy", (req, res) => {
  res.render("privacypolicy", {
    email: req.session.emailAddress,
    loginn: req.session.loggedinUser,
    adminn: req.session.adminUser,
    ownerr: req.session.ownerUser,
  });
});



router.get("/profile", async (req, res) => {
  if (req.session.emailAddress) {
    const Detail = [];
    db.query(
      "SELECT * FROM Users join Ticket ON Users.email = Ticket.user_email",
      [req.session.emailAddress],
      (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result.length > 0) {
          for (var i = 0; i < result.length; i++) {
            if (result[i].email == req.session.emailAddress) {
              var a = {
                ticket_id: result[i].ticket_id,
                event_name: result[i].event_name,
              };
              Detail.push(a);
            }
          }
        }
      }
    );
    db.query(
      "SELECT * FROM Users WHERE Users.email = ?",
      [req.session.emailAddress],
      (err, result) => {
        const User = [];
        if (err) {
          console.log(err);
        }
        if (result.length > 0) {
          for (var i = 0; i < result.length; i++) {
            var x = [
              {
                firstname: result[i].firstname,
                lastname: result[i].lastname,
                email: result[i].email,
                role: result[i].role,
              },
            ];
            User.push(x);
          }
          var length = User.length;
          for (var j = 0; j < length - 1; j++) {
            console.log(j, User.length);
            User.pop();
          }

          res.render("profile", {
            User,
            Detail,
            email: req.session.emailAddress,
            loginn: req.session.loggedinUser,
            adminn: req.session.adminUser,
            ownerr: req.session.ownerUser,
          });
        }
      }
    );
  } else {
    res.redirect("/notFound");
  }
});




router.get("/registerSuccess", (req, res) => {
  res.render("registerSuccess", {
    loginn: req.session.loggedinUser,
    email: req.session.emailAddress,
    name: req.session.name,
    lastname: req.session.lname,
  });
});
router.get("/contactusSuccess", (req, res) => {
  res.render("contactusSuccess", {
    loginn: req.session.loggedinUser,
    email: req.session.emailAddress,
    contactname: req.session.contactname,
  });
});

router.get("/notFound", (req, res) => {
  res.render("notFound", {
    email: req.session.emailAddress,
    loginn: req.session.loggedinUser,
  });
});



//Easter Egg
router.get("/PandanınPanı", (req, res) => {
  const encryptedString = cryptr.encrypt("Pandanın_Panı_Atılayın_Amı");
  console.log(encryptedString);
  const decryptedString = cryptr.decrypt(encryptedString);
  console.log(decryptedString);

  console.log("Şile soğuktur xd");

  res.redirect("/");
});
module.exports = router;
