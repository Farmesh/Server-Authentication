import countryModel from "../Models/Country.js";
import cityModel from "../Models/City.js";
import stateModel from "../Models/State.js";

// Create a Country
export const createCountry = async (req, res) => {
    try {
        const newCountry = new countryModel(req.body);
        const savedCountry = await newCountry.save();
        res.status(201).json(savedCountry);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a State
export const createState = async (req, res) => {
    try {
        const newState = new stateModel(req.body);
        const savedState = await newState.save();
        res.status(201).json(savedState);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a City
export const createCity = async (req, res) => {
    try {
        const newCity = new cityModel(req.body);
        const savedCity = await newCity.save();
        res.status(201).json(savedCity);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all Countries
export const getCountries = async (req, res) => {
  try {
    const countries = await countryModel.find();
    res.status(200).json(countries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get States by Country ID (using URL param)
export const getStateByCountryid = async (req, res) => {
    try {
        const { countryId } = req.params;  // changed to req.params
        const states = await stateModel.find({ countryId });
        res.status(200).json(states);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get Cities by State ID (using URL param)
export const getCityByStateId = async (req, res) => {
    try {
        const { stateId } = req.params;  // changed to req.params
        const cities = await cityModel.find({ stateId });
        res.status(200).json(cities);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
