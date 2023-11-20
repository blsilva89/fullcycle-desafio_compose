const express = require('express');
const app = express();
const port = 3000;
const config = {
  host: 'db',
  user: 'root',
  password: 'root',
  database: 'nodedb'
};

const mysql = require('mysql');
const connection = mysql.createConnection(config);
const verify_table_query = `SELECT count(*) as table_exists FROM information_schema.tables WHERE table_schema = 'nodedb' AND table_name = 'people';`;
const create_table_query = `CREATE TABLE people ( id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL );`;
const insert_into_query = `INSERT INTO nodedb.people(name) values ('Full Cycle')`;

function create_table(error, result) {
  if (error) throw error;
  if (result[0].table_exists) insert_into();
  else connection.query(create_table_query, insert_into);
}

function insert_into(error) {
  if (error) throw error;
  connection.query(insert_into_query);
}

function table_exists() {
  connection.query(verify_table_query, create_table);
}

table_exists();


// Rota básica
app.get('/', async (req, res) => {
  const select_query = 'SELECT name FROM people;';
  connection.query(select_query, (error, result) => {
    console.log(result);
    const html = `<h1>Full Cycle Rocks!</h1><ul>${result.map((row) => `<li>${row.name}</li>`).join('')}</ul>`;
    res.send(html);
  });
});

app.get('/health/', async (req, res) => {  
    res.send('ok');
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
