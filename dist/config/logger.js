"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const logger = winston_1.default.createLogger({
    level: "info",
    format: winston_1.default.format.json(),
    defaultMeta: {
        service: "mail-service",
    },
    transports: [
        /**
         * Write all logs with importance level of `error` or less to `error.log`
         * Write all logs with importance level of `info` or less to `combined.log`
         */
        new winston_1.default.transports.File({
            filename: "error.log",
            level: "error",
        }),
        new winston_1.default.transports.File({
            filename: "combined.log",
        }),
    ],
});
/**
 * If we're not in production then log to the `console` with the format:
 * `${info.level}: ${info.message} JSON.stringify({ ...res })`
 */
if (process.env.NODE_ENV !== "prod") {
    logger.add(new winston_1.default.transports.Console({
        format: winston_1.default.format.simple(),
    }));
}
exports.default = logger;
