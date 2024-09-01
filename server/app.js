const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const session = require("express-session");
const mongoStore = require("connect-mongo");
const bodyParser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const User = require('./userSchema.js');
const SpreadsheetModel = require("./spd.js");

dotenv.config();

const app = express();
const server2 = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server2, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const dburl = process.env.ATLAS_URL;

const connectdb = async () => {
  try {
    const conn = await mongoose.connect(dburl);
    console.log("Connected to DB");
  } catch (e) {
    console.log(e);
  }
};

connectdb();

const Store = mongoStore.create({
  mongoUrl: dburl,
  crypto: {
    secret: process.env.SECRET,
    touchAfter: 24 * 3600
  }
});

app.use(session({
  store: Store,
  resave: false,
  saveUninitialized: false,
  secret: process.env.SECRET
}));

// Socket.IO event handling
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('crt-room', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  socket.on('save-data', ({ data, uuid }) => {
    console.log(`Saving data with UUID: ${uuid}`);
    // Emit to the room to update data
    socket.to(uuid).emit('data-updated', data);
  });

  socket.on('update-data', (data) => {
    console.log('Updating data:', data);
    // Emit to the room to update data
    socket.to(data.uuid).emit('data-updated', data);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });

  // Error handling for socket
  socket.on('error', (err) => {
    console.error('Socket error:', err);
  });
});




// Passport.js authentication setup
passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return done(null, false, { message: 'No user with that email' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return done(null, user);
    } else {
      return done(null, false, { message: 'Password incorrect' });
    }
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Routes
app.post('/register', async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.send("err");
    }
    const newUser = new User({ name, email, password, phoneNumber });
    await newUser.save();
    res.json("OK");
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/login', async (req, res, next) => {
  passport.authenticate('local', async (err, user, info) => {
    if (err) {
      return res.send("err");
    }
    if (!user) {
      return res.send("err");
    }
    req.logIn(user, async (err) => {
      if (err) {
        return res.send("err");
      }
      return res.json(user);
    });
  })(req, res, next);
});

app.get('/logout', (req, res) => {
  req.logout();
  res.send('Logged out');
});

app.post('/save', async (req, res) => {
  try {
    const { uuid, email, data, accessOption } = req.body;

    const result = await SpreadsheetModel.findOneAndUpdate(
      { uid: uuid }, 
      { email, data, accessOption }, 
      { new: true, upsert: true }
    );

    res.status(200).json({ message: 'Data saved successfully!' });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/data/:id', async (req, res) => {
  try {
    const sheet = await SpreadsheetModel.findOne({ uid: req.params.id });
    if (sheet) {
      res.json({ data: sheet.data });
    } else {
      res.status(404).json({ message: 'Sheet not found' });
    }
  } catch (error) {
    console.error('Error retrieving sheet:', error);
    res.status(500).json({ message: 'Error retrieving sheet', error });
  }
});

app.post("/spd", async (req, res) => {
  const userEmail = req.body.user;
  try {
    const sheet = await SpreadsheetModel.findOne({ uid: req.body.id });

    if (!sheet) {
      return res.json('Sheet not found');
    }

    if (sheet.accessOption === 'everyone') {
      return res.json("OK");
    } else if (sheet.accessOption === 'personal') {
      if (userEmail === sheet.email) {
        return res.json("OK");
      } else {
        return res.json("Access denied");
      }
    } else if (sheet.accessOption === userEmail.split('@')[1]) {
      return res.json("OK");
    } else {
      return res.json("Access denied");
    }

  } catch (error) {
    console.error('Error retrieving sheet:', error);
    res.json('Error retrieving sheet');
  }
});

app.post("/crtdSheet", async (req, res) => {
  try {
    const sheets = await SpreadsheetModel.find({ email: req.body.email });
    if (sheets.length > 0) {
      const uids = sheets.map(sheet => sheet.uid);  
      res.json({ success: true, uids });
    } else {
      res.json('error');
    }
  } catch (error) {
    res.json({ success: false, message: 'Error retrieving sheets', error: error.message });
  }
});

// Start the server
server2.listen(1313, () => {
  console.log("Listening on port 1313");
});
