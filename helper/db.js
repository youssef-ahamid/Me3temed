import mongoose from 'mongoose';

export default () => {
    mongoose.connect(process.env.DB_CONNECTION, {useNewUrlParser:true, useUnifiedTopology: true});
    mongoose.connection.on('open', () => {
        console.log('MongoDb: Connected');
    });
    mongoose.connection.on('error', (err) => {
        console.log('MongoDb: Error', err);
    });
    mongoose.Promise=global.Promise;
};

