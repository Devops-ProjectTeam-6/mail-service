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
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const logger_1 = __importDefault(require("./config/logger"));
const eurekaClientConfig_1 = __importDefault(require("./config/eurekaClientConfig"));
const BookingMailConsumer_1 = __importDefault(require("./config/kafka/BookingMailConsumer"));
const mail_1 = require("./config/mail");
const cors = require("cors");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(cors());
const PORT = process.env.PORT;
const server = app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    const serverAddress = server.address();
    const serverPort = serverAddress.port;
    // Instantiate the Kafka consumer
    const bookingMailConsumer = new BookingMailConsumer_1.default({});
    // start the Kafka consumer
    try {
        yield bookingMailConsumer.startConsumer();
        logger_1.default.info(`Kafka consumer started successfully`);
    }
    catch (error) {
        logger_1.default.error(`Error occured during starting Kafka consumer: ${error}`);
    }
    // Start the mail server
    mail_1.transporter.verify(function (error, success) {
        if (error) {
            logger_1.default.error(`Error occurred while starting the mail server: `, error);
        }
        else {
            logger_1.default.info("Server is ready to take our messages!");
        }
    });
    // register the service to eureka server
    eurekaClientConfig_1.default.start((error) => {
        if (error) {
            logger_1.default.error(`Error occured during starting the eureka client: ${error}`);
        }
    });
    logger_1.default.info(`mail-service is running at http://localhost:${serverPort}`);
}));
