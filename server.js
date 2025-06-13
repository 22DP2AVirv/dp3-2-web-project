const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
const app = express();
const PORT = 3009;

app.use(cors());
app.use(express.json());

const USERS_FILE = path.join(__dirname, 'user_data.json');
const APPOINTMENTS_FILE = path.join(__dirname, 'pieteikties_data.json');

const dbConfig = {
  host: "185.253.219.98",
  user: "aleksis",
  password: "Parole290306",
  database: "medicinas_centrs"
};

function getLatviaDateTime() {
  const options = {
    timeZone: 'Europe/Riga',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };

  const formatter = new Intl.DateTimeFormat('en-GB', options);
  const parts = formatter.formatToParts(new Date());
  
  const dateParts = {};
  parts.forEach(({ type, value }) => {
    dateParts[type] = value;
  });

  return `${dateParts.year}-${dateParts.month}-${dateParts.day} ${dateParts.hour}:${dateParts.minute}:${dateParts.second}`;
}

app.get('/', (req, res) => {
  res.send('Reģistrācijas serveris darbojas!');
});


app.post('/register', async (req, res) => {
  console.log("➡️ Jauna reģistrācija:", req.body);
  const { name, surname, email, phone, password } = req.body;

  if (!name || !surname || !email || !phone || !password) {
    return res.status(400).json({ message: 'Visi lauki ir obligāti aizpildāmi!' });
  }

  let users = [];
  if (fs.existsSync(USERS_FILE)) {
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    users = JSON.parse(data || '[]');
  }

  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(409).json({ message: 'E-pasts jau ir reģistrēts!' });
  }

  const create_data = getLatviaDateTime();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { name, surname, email, phone, password: hashedPassword, create_data};
    users.push(newUser);
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    console.log(`💾 Saglabāts users.json: ${email}`);

    const connection = await mysql.createConnection(dbConfig);
    const sql = `INSERT INTO users (name, surname, email, phone, password, create_data) VALUES (?, ?, ?, ?, ?, ?)`;
    await connection.execute(sql, [name, surname, email, phone, hashedPassword, create_data]);
    await connection.end();
    console.log(`✅ Saglabāts MySQL: ${email}`);

    res.status(201).json({ message: 'Lietotājs veiksmīgi reģistrēts!' });
  } catch (err) {
    console.error('❌ Kļūda saglabājot:', err);
    res.status(500).json({ message: 'Servera kļūda!' });
  }
});
let db;



async function startServer() {
  try {
      db = await mysql.createConnection({
      host: "185.253.219.98",
      user: "aleksis",
      password: "Parole290306",
      database: "medicinas_centrs"
    });
    

    console.log('Savienots ar datubāzi.');

    app.post('/login', async (req, res) => {
      const { email, password } = req.body;
    
      try {
        const [results] = await db.execute(
          'SELECT * FROM users WHERE email = ?',
          [email]
        );
    
        if (results.length === 0) {
          return res.status(401).send('Šāds lietotājs neeksistē.');
        }
    
        const user = results[0];
    
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return res.status(401).send('Nepareiza parole.');
        }
    
        res.json({ name: user.name });
      } catch (err) {
        console.error(err);
        res.status(500).send('Kļūda serverī');
      }
    });

} catch (err) {
console.error('Datubāzes pieslēgšanās kļūda:', err);
}
}



app.get('/me', async (req, res) => {
  const email = req.headers['x-email']; // Klients padod e-pastu headerī
  console.log(email);
  if (!email) return res.status(401).send('Nepieejams');
  
  try {
    const [results] = await db.execute(
      'SELECT name, password FROM users WHERE email = ?',
      [email]
    );
    console.log(results);

    if (results.length === 0) return res.status(404).send('Lietotājs nav atrasts');

    const user = results[0];
    res.json({
      name: user.name,
      password: user.password // tas ir bcrypt hash
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Kļūda serverī');
  }
});


app.post('/update-password', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).send('Trūkst dati');

  const modified_data_password = getLatviaDateTime();
  try {
    const hash = await bcrypt.hash(password, 10);
    await db.execute(
      'UPDATE users SET password = ?, modified_data_password = ? WHERE email = ?',
      [hash, modified_data_password, email]
    );

    // Atjaunojam arī failu, ja nepieciešams
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf-8');
      const users = JSON.parse(data || '[]');
      const updatedUsers = users.map(u => {
        if (u.email === email) {
          return {
            ...u,
            password: hash,
            modified_data_password
          };
        }
        return u;
      });
      fs.writeFileSync(USERS_FILE, JSON.stringify(updatedUsers, null, 2));
    }

    res.send('Parole atjaunināta');
  } catch (err) {
    console.error(err);
    res.status(500).send('Kļūda serverī');
  }
});



startServer();


app.post('/pieteikties', async (req, res) => {
  const {name, surname, phone, email, procedura, datums, laiks, adrese} = req.body;

  if (!name || !surname || !phone || !email || !procedura || !datums || !laiks || !adrese) {
    return res.status(400).json({ message: 'Visi lauki ir obligāti aizpildāmi!' });
  }

  const create_data = getLatviaDateTime(); // Pārcelts iekšā
  const fixedTime = laiks.length === 5 ? laiks + ':00' : laiks;

  try {
    let appointments = [];
    if (fs.existsSync(APPOINTMENTS_FILE)) {
      const data = fs.readFileSync(APPOINTMENTS_FILE, 'utf-8');
      appointments = JSON.parse(data || '[]');
    }

    const newAppointment = {name, surname, phone, email, procedura, datums, laiks, adrese, create_data};

    appointments.push(newAppointment);
    fs.writeFileSync(APPOINTMENTS_FILE, JSON.stringify(appointments, null, 2));

    // Saglabāšana DB
    await db.execute(
      'INSERT INTO pieteikties_data (name, surname, phone, email, procedura, datums, laiks, adrese, create_data) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, surname, phone, email, procedura, datums, fixedTime, adrese, create_data]
    );

    return res.status(201).json({ message: 'Pieteikums ir veiksmīgi saglabāts!' });
  } catch (err) {
    console.error('❌ DB kļūda:', err);
    return res.status(500).json({ message: 'Kļūda saglabājot datubāzē.' });
  }
});

app.get('/pieteikties', async (req, res) => {
  try {
      const [rows] = await db.execute('SELECT * FROM pieteikties_data');
      res.json(rows);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Neizdevās ielādēt pieteikumus' });

  }
});

app.get('/register', async (req, res) => {
  try {
      const [rows] = await db.execute('SELECT name, email, phone, create_data, modified_data_password FROM users');
      res.json(rows);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Neizdevās ielādēt datus' });

  }
});

app.get('/pakalpojumi', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT id, pakalpojums, apraksts FROM pakalpojumi');
    res.json(rows);
  } catch (error) {
    console.error('❌ Kļūda iegūstot pakalpojumus:', error);
    res.status(500).json({ error: 'Neizdevās ielādēt pakalpojumus' });
  }
});

app.get('/pakalpojumu_cenas', async (req, res) => {
  try {
    const [results, fields] = await db.query('SELECT * FROM price');
    res.json(results);
  } catch (err) {
    console.error('Kļūda pieprasot datus:', err);
    res.status(500).json({ error: 'Kļūda serverī' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveris darbojas uz: http://localhost:${PORT}`);
});

