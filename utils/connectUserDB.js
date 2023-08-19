import mongoose from 'mongoose';
import UserModel from './User';
import AvAcModel from './AvailableAccounts';

let userDbConnection = null;
let userConnectionEstablishedPromise = null;

let User; 
let AvAc; // Declare AvAc outside the function to use it elsewhere

const connectUserDB = () => {
    if (!userConnectionEstablishedPromise) {
        userConnectionEstablishedPromise = new Promise(async (resolve, reject) => {
            try {
                userDbConnection = mongoose.createConnection(process.env.MONGODB_URI, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                });
                userDbConnection.once('open', () => {
                    console.log('USERS MongoDB Connected...');

                    // Associate the existing UserSchema with this connection
                    if (!userDbConnection.models.User) {
                        User = userDbConnection.model('User', UserModel.schema);
                    } else {
                        User = userDbConnection.models.User;
                    }

                    // Associate the existing AvAcSchema with this connection
                    if (!userDbConnection.models.avac) {
                        AvAc = userDbConnection.model('avac', AvAcModel.schema);
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
    return userConnectionEstablishedPromise;
};


export { connectUserDB, userDbConnection };