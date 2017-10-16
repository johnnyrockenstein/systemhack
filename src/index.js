import mongoose from 'mongoose';
import express from 'express';
import https from 'https';
import socketIO from 'socket.io';
import bodyParser from 'body-parser';
import path from 'path';
import routes from './routes';
import Sockets from './sockets';
import { updateSystemHealth } from './services/hack';

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express();
server.use(express.static('./public'));
server.set('views', './views');
server.engine('html', require('ejs').renderFile);
const listenPort = server.listen(PORT, () => console.log(`Listening on ${PORT}`));

// Set up REST endpoints
server.use('', routes);

//Setting up Socket Connection
const io = socketIO(listenPort);
Sockets.initializeSockets(io);

// Setting up MongoDB
const uristring = process.env.MONGODB_URI;
mongoose.connect(uristring, function (err, res) {
    if (err) {
        console.log(`ERROR connecting to: ${uristring}. ${err}`);
    } 
    else {
        console.log(`Succeeded connected to: ${uristring}`);
        updateSystemHealth()
    }
});
// setInterval(() => io.emit('time',decrease(health).toString()+"/500"), 2000)