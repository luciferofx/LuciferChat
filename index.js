import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { Sequelize, DataTypes } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server);

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAL_Jf6LTK6yndCdkzm_StawGjfD1g80O4",
  authDomain: "lucibrowser.firebaseapp.com",
  projectId: "lucibrowser",
  storageBucket: "lucibrowser.firebasestorage.app",
  messagingSenderId: "287528567693",
  appId: "1:287528567693:web:edc6545fe347a0aee7f3c4"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(__dirname));
app.use('/socket.io', express.static(path.join(__dirname, 'node_modules', 'socket.io', 'client-dist')));

// Database setup
const sequelize = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false
});

// Define the Server model
const ServerModel = sequelize.define('Server', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  ownerId: {
    type: DataTypes.STRING, // Store Firebase UID here
    allowNull: false,
  },
});

// Sync the database
(async () => {
  await sequelize.sync();
  console.log('Database synced');
})();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    await createUserWithEmailAndPassword(auth, email, password);
    res.status(201).send({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(400).send({ message: 'Registration failed' });
  }
});

app.post('/servers', async (req, res) => {
  try {
    const { name, description } = req.body;
    // Get the user's UID from the token
    // const uid = req.user.uid;
    // For now, just use a test uid
    const uid = 'testuid';

    const server = await ServerModel.create({ name, description, ownerId: uid });
    res.status(201).send({ message: 'Server created successfully', server });
  } catch (error) {
    console.error('Error creating server:', error);
    res.status(400).send({ message: 'Server creation failed' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User logged in:', user);
    // Generate a token (replace with your actual token generation logic)
    const token = 'testtoken';
    res.send({ message: 'Login successful', token: token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(400).send({ message: 'Login successful' });
  }
});

io.on('connection', (socket) => {
  console.log('User connected');

  socket.use((socket, next) => {
    if (socket.handshake.auth.token) {
      // Verify the token (replace with your actual verification logic)
      // For example, using Firebase Admin SDK:
      // admin.auth().verifyIdToken(socket.handshake.auth.token)
      //   .then((decodedToken) => {
      //     socket.user = decodedToken;
      //     next();
      //   })
      //   .catch((error) => {
      //     next(new Error('Authentication error'));
      //   });
      // For now, just skip authentication
      next();
    } else {
      next(new Error('Authentication error'));
    }
  });

  socket.on('new-message', (message) => {
    console.log('New message:', message);
    io.emit('new-message', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
