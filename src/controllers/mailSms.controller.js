import nodemailer from 'nodemailer';
import twilio from 'twilio';
import dotenv from 'dotenv';
import { Router } from "express";

const router = Router();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: 'fischel.sebastian@gmail.com',
        pass: 'vazwbjtzlzpfpsep'
    }
});

const mail = async (req, res) => {
    await transporter.sendMail({
        from: 'CorderHouse 39760',
        to: 'sebadelgm@gmail.com',
        subject: 'Correo de prueba 39760',
        html: `<div><h1>Hola, esto es una prueba de envio de correo usando gmail</h1>`
    });
    res.send('Correo enviado');
};

dotenv.config();

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER
)

const smsCustom = async (req, res) => {
  const { name, product } = req.body;
  await client.messages.create({
      from: TWILIO_PHONE_NUMBER,
      to: '+59893656610',
      body: `Hola ${name} gracias por tu compra. Tu producto es ${product}`
  });

  res.send('SMS sent')
};

const whatsapp = async(req, res) => {
  const { name, product } = req.body;
  await client.messages.create({
      body: `Hola ${name} gracias por tu compra. Tu producto es ${product}`,
      from: 'whatsapp:+14155238886',
      to: 'whatsapp:+59893656610',
  });

  res.send('Whatsapp sent')
};

export default router;

export {
    whatsapp,
    mail,
    smsCustom
}