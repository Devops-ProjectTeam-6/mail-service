"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendBookingMailService = void 0;
const logger_1 = __importDefault(require("../config/logger"));
const booking_service_1 = require("./booking.service");
const auth_service_1 = require("./auth.service");
const config_1 = require("../config");
const utils_1 = require("../utils");
function sendBookingMailService(message) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        logger_1.default.info("Handling booking mail event");
        const payload = JSON.parse((_a = message.value) === null || _a === void 0 ? void 0 : _a.toString());
        const bookingData = yield (0, booking_service_1.getBookingDetails)(payload.bookingId);
        const userData = yield (0, auth_service_1.getUserDetails)(bookingData.uid);
        const bookingMessage = `
  <div>
    <h1>Booking Confirmation</h1>
    <p>Dear ${userData.name},</p>
    <p>Your booking with ID ${bookingData.id} has been confirmed!</p>
    <p>Booking Details:</p>
    <ul>
      <li>Check-in Date: ${(0, utils_1.formatShortDate)(new Date(bookingData.checkIn))}</li>
      <li>Check-out Date: ${(0, utils_1.formatShortDate)(new Date(bookingData.checkOut))}</li>
      <li>Room Details:
        <ul>
          <li>Room ID: ${bookingData.roomDetails.id}</li>
          <li>Room Title: ${bookingData.roomDetails.title}</li>
          <li>Price: ${bookingData.amount}${bookingData.roomDetails.prices.currency}</li>
        </ul>
      </li>
    </ul>
    <p>Thank you for choosing our service. We look forward to hosting you!</p>
    <p>Best regards,</p>
    <p>The MyRoom Team</p>
  </div>
  `;
        const mailData = {
            from: {
                name: "MyRoom",
                address: process.env.MAIL_USER,
            },
            to: userData.email,
            subject: `Booking Confirmed for ${bookingData.roomDetails.title}`,
            html: bookingMessage,
        };
        logger_1.default.info(`Sending a mail`);
        yield (0, config_1.sendMail)(mailData);
        logger_1.default.info(`Message sent successfully!`);
    });
}
exports.sendBookingMailService = sendBookingMailService;
