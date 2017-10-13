import system from './services/system';
import { createHack, updateSystemHealth } from './services/hack';

const initializeSockets = (io) => {
    io.on('connection', (socket) => { 
        console.log('Client connected');
        setTimeout(() => {socket.emit('health', system.health)}, 0);
        console.log(system.health)
        socket.on('disconnect', () => console.log('Client disconnected'));
        socket.emit('system1health', system.health +`/1000`)
        socket.emit('system2health', '1000/1000');
        socket.emit('system3health','1000/1000');
        socket.emit('target', 'Yaphet Deek');
        socket.on('hack', (data) => createHack(data)
            .then((success) => { 
                updateSystemHealth().then(res => {
                    io.sockets.emit('system1health', system.health + `/1000`)
                    console.log(system.health);
                });
             })
        )
    });
}

export default {initializeSockets};