import dotenv from "dotenv";
import pkg from 'twilio';

dotenv.config();

const twilio = pkg;
const accountSid = process.env.TWILIO_ACCOUNT_SID; 
const authToken = process.env.TWILIO_AUTH_TOKEN;  
const fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER;  

const client = new  twilio(accountSid, authToken);

const sendSms = async (to, message) => {
  try {
    const messageResponse = await client.messages.create({
      body: message,
      from: fromPhoneNumber,
      to: to,
    });
    console.log(`Message sent to ${to}: ${messageResponse.sid}`);
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

export default sendSms;

