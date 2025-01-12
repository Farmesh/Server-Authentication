import mongoose from "mongoose";

const registerSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Address: {
        type: String,
        required: true
    },
    Phonenumber: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true,
        unique: true
    },
    Password: {
        type: String,
        required: true
    },
    countryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country'
    },
    stateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'State'
    },
    cityId: { type: mongoose.Schema.Types.ObjectId,
         ref: 'City' },
    Gender: {
        type: String,
        required: true
    },
    isSubscribe: {
        type: Boolean,
        default: false
    }

});

const registerModel = mongoose.model('Register', registerSchema);

export default registerModel;