const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');
const { Tour } = require('../../models/tourModel');
dotenv.config({ path: '../../config.env' });

const port = process.env.PORT || 3000;

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
};

connectDB();

const data = fs.readFileSync('./tours-simple.json', 'utf-8');

const tours = JSON.parse(data);
console.log(tours);

const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('data added');
    } catch (err) {
        console.log(err);
    }
};
const deleteAllDocumnets = async () => {
    try {
        await Tour.deleteMany();
        console.log('data deleted');
    } catch (err) {
        console.log(err);
    }
};

if (process.argv[2] === '--import') {
    importData();
}
if (process.argv[2] === '--delete') {
    deleteAllDocumnets();
}
