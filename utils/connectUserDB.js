import { connect } from 'mongoose';

const connectDB = async () => {
    try {
      await connect(process.env.MONGODB_URI)
      console.log('MongoDB Connected...')
    } catch (err) {
      console.error(err.message)
      // Exit process with failure
      process.exit(1)
    }
}

module.exports = connectDB;








/*
import mongoose from 'mongoose';
import UserModel from './User';
import AvAcModel from './AvailableAccounts';

let userDbConnection = null;
let userConnectionEstablishedPromise = null;

let User; 
let AvAc;

const connectUserDB = async () => {
    if (!userConnectionEstablishedPromise) {
        userConnectionEstablishedPromise = new Promise(async (resolve, reject) => {
            try {
                userDbConnection = mongoose.createConnection(process.env.MONGODB_URI, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                });
                userDbConnection.once('open', () => {
                    console.log('USERS MongoDB Connected...');

                    if (!userDbConnection.models.User) {
                        User = userDbConnection.model('User', UserModel.schema);
                    } else {
                        User = userDbConnection.models.User;
                    }

                    if (!userDbConnection.models.avac) {
                        AvAc = userDbConnection.model('AvAc', AvAcModel.schema);
                    } else {
                        AvAc = userDbConnection.models.avac;
                    }

                    resolve(userDbConnection);
                });
                userDbConnection.on('error', (err) => {
                    console.error('Error connecting to USERS MongoDB:', err);
                    reject(err);
                });
            } catch (err) {
                console.error(err.message);
                reject(err);
            }
        });
    }
    await userConnectionEstablishedPromise;
    return {
        connection: userDbConnection,
        User: User,
        AvAc: AvAc
    };
};

export { connectUserDB, userDbConnection };
*/