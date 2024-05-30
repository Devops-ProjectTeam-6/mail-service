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
exports.getUserDetails = void 0;
const axios_1 = __importDefault(require("axios"));
const logger_1 = __importDefault(require("../config/logger"));
const utils_1 = require("../utils");
const ApiConstants_1 = __importDefault(require("../constants/ApiConstants"));
const AppConstants_1 = __importDefault(require("../constants/AppConstants"));
function getUserDetails(id) {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.default.info(`Attempting to get user details for id:`, id);
        // Get the URI for the auth server
        const authServiceURI = (0, utils_1.getInstanceURI)(AppConstants_1.default.AUTH_SERVICE);
        // Configure the Axios request
        const config = {
            method: "GET",
            url: `${authServiceURI}${ApiConstants_1.default.AUTH_SERVER}/users/${id}`,
        };
        try {
            const userData = (yield axios_1.default.request(config)).data;
            logger_1.default.info(`User data retrived successfully: `, userData);
            return userData;
        }
        catch (error) {
            logger_1.default.error(`Error occurred while retrieving the User data: `, error);
            if (axios_1.default.isAxiosError(error)) {
                (0, utils_1.handleAxiosError)(error);
            }
            throw error;
        }
    });
}
exports.getUserDetails = getUserDetails;
