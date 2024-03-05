const express = require("express");
const mysql = require("mysql");

const app = express();
const port = 3000;

const config = {
  host: "db",
  user: "root",
  password: "root",
  database: "nodedb",
};
const connection = mysql.createConnection(config);

const dropTable = () => {
  const sql = `DROP TABLE IF EXISTS people`;
  connection.query(sql);
};

const createTable = () => {
  const sql = `CREATE TABLE IF NOT EXISTS people(id int not null auto_increment, name varchar(255), primary key(id));`;
  connection.query(sql);
};

const insertName = () => {
  const randomNumber = Math.floor(Math.random() * 100 + 1);
  const sql = `INSERT INTO people(name) values('Wagner ${randomNumber}')`;
  connection.query(sql);
};

const selectNames = async () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM people`;
    connection.query(sql, function (err, result) {
      if (err) return reject(err);
      resolve(Object.values(JSON.parse(JSON.stringify(result))));
    });
  });
};

app.get("/", async (req, res) => {
  // dropTable();
  createTable();
  insertName();

  const names = await selectNames();
  const fullCycleRocks = "<h1>Full Cycle Rocks!</h1>";
  const listNames = names.map((name) => `<li>${name.name}</li>`).join("");
  const html = `${fullCycleRocks} <ul>${listNames}</ul>`;

  res.send(html);
});

app.listen(port, () => {
  console.log("running on port" + port);
});
