const mongoose = require('mongoose');

const connectionString = 'mongodb://localhost/myCanvas';

mongoose.connect(connectionString);

mongoose.connection.on('connected', () => {
  console.log(`Mongoose connected to ${connectionString}`);
});

mongoose.connection.on('error', (err) => {
  console.log(`Mongoose connected err ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('mongoose disconnected');
});
