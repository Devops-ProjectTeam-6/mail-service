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
const kafkajs_1 = require("kafkajs");
const logger_1 = __importDefault(require("../logger"));
const service_1 = require("../../service");
class BookingMailConsumer {
    constructor(messageProcessor) {
        this.messageProcessor = messageProcessor;
        this.kafkaConsumer = this.createKafkaConsumer();
    }
    startConsumer() {
        return __awaiter(this, void 0, void 0, function* () {
            const topic = {
                topics: ["booking.mail"],
                fromBeginning: false,
            };
            try {
                yield this.kafkaConsumer.connect();
                yield this.kafkaConsumer.subscribe(topic);
                yield this.kafkaConsumer.run({
                    eachMessage: (messagePayload) => __awaiter(this, void 0, void 0, function* () {
                        logger_1.default.info(`Received booking mail event (kafka topic: 'booking.mail') with payload: `, messagePayload);
                        const { topic, partition, message } = messagePayload;
                        yield (0, service_1.sendBookingMailService)(message);
                    }),
                });
            }
            catch (error) {
                logger_1.default.error("Error: ", error);
            }
        });
    }
    shutdown() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.kafkaConsumer.disconnect();
        });
    }
    createKafkaConsumer() {
        const kafka = new kafkajs_1.Kafka({
            clientId: "booking.mail",
            brokers: ["ec2-34-234-196-243.compute-1.amazonaws.com:9092"],
        });
        const consumer = kafka.consumer({ groupId: "booking.mail-group" });
        return consumer;
    }
}
exports.default = BookingMailConsumer;
