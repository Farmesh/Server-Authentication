import mongoose from "mongoose";

const citySchema = new mongoose.Schema({
  name: { type: String, required: true },
  stateId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'State', 
    required: true 
  }
});

const cityModel = mongoose.model('City', citySchema);

export default cityModel;
