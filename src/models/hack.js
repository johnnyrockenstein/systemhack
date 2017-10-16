import mongoose from 'mongoose';

const hackSchema = new mongoose.Schema({
    ip: String,
    city: String,
    country: String
});

const HackModel = mongoose.model('system1', hackSchema);

export default HackModel;