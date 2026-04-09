const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/* DATABASE CONNECTION */

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "pass123",
  database: "blood_bank",
});

db.connect((err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("MySQL connected");
});


/* ================= LOGIN ================= */

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email=? AND password=?";

  db.query(sql, [email, password], (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ status: "error" });
    }

    if (result.length > 0) {
      res.json({
        status: "success",
        user: result[0],
      });
    } else {
      res.json({ status: "fail" });
    }
  });
});


/* ================= REGISTER ================= */

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  const sql = "INSERT INTO users (name,email,password) VALUES (?,?,?)";

  db.query(sql, [name, email, password], (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ status: "error" });
    }

    res.json({ status: "success" });
  });
});


/* ================= DONOR REGISTER ================= */

app.post("/donor", (req, res) => {
  const {
    user_id,
    name,
    email,
    age,
    gender,
    blood_group,
    location,
    phone,
    last_donation,
    notes,
    units,       // ✅ FIX 1: was missing from destructuring — caused ReferenceError
  } = req.body;

  console.log("DONOR DATA:", req.body);

  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 90); // 90 days validity

  // ✅ FIX 2: SQL had 12 columns but only 11 placeholders (?,?,?,?,?,?,?,?,?,?,?)
  // Added the missing 12th ? so column count matches placeholder count
  const sql = `
  INSERT INTO donors
  (user_id,name,email,blood_group,location,phone,last_donation,expiry_date,age,gender,notes,units)
  VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
  `;

  db.query(
    sql,
    [
      user_id,
      name,
      email,
      blood_group,
      location,
      phone,
      last_donation,
      expiry,
      age,
      gender,
      notes,
      units,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ status: "error" });
      }

      res.json({ status: "success" });
    }
  );
});


/* ================= SEARCH DONORS ================= */

app.post("/search-donors", (req, res) => {
  const { blood_group, units } = req.body;

  const sql = `
  SELECT * FROM donors
  WHERE blood_group = ?
  AND units >= ?
  AND expiry_date > CURDATE()
  ORDER BY expiry_date DESC
  `;

  db.query(sql, [blood_group, units], (err, result) => {
    if (err) {
      console.log(err);
      return res.json([]);
    }

    res.json(result);
  });
});


/* ================= REQUEST BLOOD ================= */

app.post("/request-blood", (req, res) => {
  const {
    name,
    bg,
    units,
    hospital,
    city,
    phone,
    date,
    urgency,
    notes,
  } = req.body;

  const sql = `
  INSERT INTO request_blood
  (patient_name,blood_group,units,hospital,city,contact,date_required,urgency,notes)
  VALUES (?,?,?,?,?,?,?,?,?)
  `;

  db.query(
    sql,
    [name, bg, units, hospital, city, phone, date, urgency, notes],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ status: "error" });
      }

      res.json({ status: "success" });
    }
  );
});


/* ================= SERVER ================= */

app.listen(5000, () => {
  console.log("Server running on port 5000");
});