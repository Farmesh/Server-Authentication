import mongoose from "mongoose";

const stateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  countryId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country', 
    required: true
  },
});

const stateModel = mongoose.model('State', stateSchema);

export default stateModel;
