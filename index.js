import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createCountry ,createState, createCity, getCountries, getStateByCountryid, getCityByStateId  } from "./Controller/RegionController.js";
import { editProfile, changePassword, register, getProfile, login, OtpSender } from "./Controller/UserController.js";
import { authMiddleware } from "./middleware.js";


dotenv.config();
 const app = express();
app.use(cors());
app.use(express.json());

app.post("/countries", createCountry);
app.post("/states", createState);
app.post("/cities", createCity);
app.post("/register", register);
app.post("/login", login);

app.get("/countries", getCountries);
app.get("/states/:countryId", getStateByCountryid);
app.get("/cities/:stateId", getCityByStateId);
app.get("/profile", authMiddleware, getProfile);


app.put("/profile", authMiddleware, editProfile);
app.put("/change-password",authMiddleware, changePassword);

app.post("/send-otp", OtpSender);




mongoose.connect(process.env.DB_URL).then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT, () => {
       console.log("Server is running");
     });
     }).catch((err) => {
     console.log("Database error", err);
     });