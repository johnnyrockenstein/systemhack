import HackModel from '../models/hack';
import system, { setSystemHealth } from '../services/system';

export function saveHack(item) {
    let hackAttempt = new HackModel(item);
    return hackAttempt.save((err, hack) => {
        if(err)
            console.error(`Error saving hack attempt ${err}`);
        else
            console.log(`Hack successful: ${hack}`);
    });
}

export function updateSystemHealth() {
    let searchResults = HackModel.find();
    return searchResults.exec(function (err, entry) {
        if (err) return handleError(err);
        
        let hacks = parseInt(entry.length);
        setSystemHealth(system.startHealth - hacks);
     });
}