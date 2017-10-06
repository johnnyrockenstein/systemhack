const mongoose = require('mongoose');
const express = require('express');
const https = require('https');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;
const path = require('path');
const INDEX = path.join(__dirname, 'index.html');

const server = express();
    server.use(express.static('./public'));
    server.set('views', './views');
    server.engine('html', require('ejs').renderFile);
    // .use((req, res) => res.sendFile(INDEX) )
    let listenPort = server.listen(PORT, () => console.log(`Listening on ${ PORT }`));

server.get('/', (req, res) =>
    res.render('index.html'));

server.get('/hack', (req, res) =>
    res.render('hacker.html'));

//GAME START VARIABLES
let system = {
    name: 'SYSTEM1',
    startHealth : 1000,
    health: 1000,
    status: `ONLINE`  
}

//Setting up Socket Connection
const io = socketIO(listenPort);

io.on('connection', (socket) => { 
    console.log('Client connected');
    setTimeout(() => {socket.emit('health', system.health)}, 0);
    console.log(system.health)
    socket.on('disconnect', () => console.log('Client disconnected'));
    socket.emit('system1health', system.health+`/1000`)
    socket.emit('system2health', '1000/1000');
    socket.emit('system3health','1000/1000');
    socket.emit('target', 'Yaphet Deek');
    socket.on('hack', (data) => writeToMongoDB(data)
        .then((success) => { 
            updateSystemHealth().then(res => {
                io.sockets.emit('system1health', system.health+`/1000`)
                console.log(system.health);
            });
         })
    )
});

// Setting up MongoDB
const uristring = process.env.MONGODB_URI;
mongoose.connect(uristring, function (err, res) {
  if (err) {
  console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
  console.log ('Succeeded connected to: ' + uristring);
  updateSystemHealth()
  }
});

// MongoDB Schema & Model Setup
const hackSchema = new mongoose.Schema({
    ip: String,
    city: String,
    country: String
});
const HackModel = mongoose.model('system1', hackSchema);

//Function to writes OBJ to DB
function writeToMongoDB(item){
    let hackAttempt = new HackModel(item);
    return hackAttempt.save((err, hack) => console.log(hack+'Mongo Errors:' +err));
};

function updateSystemHealth(){
    let searchResults = HackModel.find();
    return searchResults.exec(function (err, entry) {
        if (err) return handleError(err);
        let hacks = parseInt(entry.length);
        system.health = system.startHealth - hacks;
     });
};
// setInterval(() => io.emit('time',decrease(health).toString()+"/500"), 2000)