import registerModel from "../Models/Register.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; 
import sendSms from "../TwilioService.js";

export const OtpSender = async (req, res) => {
  const { Phonenumber } = req.body;
  try {
    const otpGenerated = Math.floor(1000 + Math.random() * 9000); 
    const message = `Your OTP is ${otpGenerated}`;
    const number = `+91${Phonenumber}`; 
    
    const user = await registerModel.findOneAndUpdate(
      { Phonenumber },
      { otp: otpGenerated, otpExpires: Date.now() + 300000 },
      { upsert: true, new: true }
    );

    await sendSms(number, message);
    res.status(200).json({ message: 'OTP sent successfully.' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: error.message });
  }
};

export const register = async (req, res) => {
  const {
    Name,
    Address,
    Phonenumber,
    Email,
    Password,
    countryId,
    stateId,
    cityId,
    Gender,
    isSubscribe,
    otp
  } = req.body;

  try {
    
    const user = await registerModel.findOne({ Phonenumber });

    if (!user) {
      return res.status(404).json({ message: 'User not found. Please request an OTP first.' });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    
    const existingUser = await registerModel.findOne({ Email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }

    
    const hashedPassword = await bcrypt.hash(Password, 10);
    user.Name = Name;
    user.Address = Address;
    user.Email = Email;
    user.Phonenumber = Phonenumber;
    user.Password = hashedPassword;
    user.countryId = countryId;
    user.stateId = stateId;
    user.cityId = cityId;
    user.Gender = Gender;
    user.isSubscribe = isSubscribe;
    user.otp = undefined; 
    user.otpExpires = undefined;

    await user.save();

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ error: err.message });
  }
};


export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Find user by email
      const user = await registerModel.findOne({ Email: email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password.' });
      }
  
      // Compare password with hashed password in the database
      const isMatch = await bcrypt.compare(password, user.Password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password.' });
      }
  
      // Create JWT token
      const token = jwt.sign(
        { id: user._id, email: user.Email },
        process.env.JWT_SECRET,  
        { expiresIn: '1h' }
      );
  
      res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          _id: user._id,
          Name: user.Name,
          Email: user.Email,
        },
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };


 
  export const getProfile = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await registerModel.findById(userId).populate('countryId stateId cityId');
        if (!user) return res.status(404).json({ message: 'User not found.' });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const editProfile = async (req, res) => {
    try {
        const { name, address, phoneNumber, gender, isSubscribe } = req.body;

        // Find user by ID from token
        const user = await registerModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Update user fields
        if (name) user.Name = name;
        if (address) user.Address = address;
        if (phoneNumber) user.Phonenumber = phoneNumber;
        if (gender) user.Gender = gender;
        if (isSubscribe !== undefined) user.isSubscribe = isSubscribe;

        await user.save();

        res.status(200).json({ message: 'Profile updated successfully.', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
  




export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long." });
    }

    const user = await registerModel.findById(req.user.id);
    if (!user || !(await bcrypt.compare(oldPassword, user.Password))) {
      return res.status(400).json({ message: "Incorrect old password or user not found." });
    }

    // Hash and save the new password
    const salt = await bcrypt.genSalt(10);
    user.Password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.status(200).json({ message: "Password changed successfully." });
  } catch (err) {
    console.error("Error changing password:", err);
    res.status(500).json({ error: err.message });
  }
};


