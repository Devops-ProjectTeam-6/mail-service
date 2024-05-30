"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatShortDate = exports.handleAxiosError = void 0;
const logger_1 = __importDefault(require("../config/logger"));
function handleAxiosError(error) {
    logger_1.default.error(`Handling AxiosError: `, error);
    if (error.response) {
        logger_1.default.error(`Request failed with status ${error.response.status}`);
        if (error.response.data) {
            const { errorCode, message, details } = error.response.data;
            throw {
                name: "AppError",
                errorCode: errorCode,
                message: message,
                details: details,
                status: 500,
            };
        }
    }
    else if (error.request) {
        logger_1.default.error(`Request failed to reach to server`);
    }
    else {
        logger_1.default.error(`Unexpected Axios error occured`);
    }
    throw error;
}
exports.handleAxiosError = handleAxiosError;
function formatShortDate(date) {
    date = new Date(date);
    return date
        .toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    })
        .replace(/ /g, "-");
}
exports.formatShortDate = formatShortDate;
