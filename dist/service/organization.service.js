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
exports.getOrganizationDataByRoomId = exports.getOrganizationDataById = void 0;
const axios_1 = __importDefault(require("axios"));
const logger_1 = __importDefault(require("../config/logger"));
const ApiConstants_1 = __importDefault(require("../constants/ApiConstants"));
const AppConstants_1 = __importDefault(require("../constants/AppConstants"));
const eurekaClientUtil_1 = require("../utils/eurekaClientUtil");
const room_model_1 = __importDefault(require("../model/room.model"));
const utils_1 = require("../utils/utils");
function getOrganizationDataById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.default.info(`Fetching organization data for organizationId: ${id}`);
        // Get the URI for the organization service
        const organizationServiceURI = (0, eurekaClientUtil_1.getInstanceURI)(AppConstants_1.default.ORGANIZATION_SERVICE);
        logger_1.default.info(`Calling Service ${AppConstants_1.default.ORGANIZATION_SERVICE} for fetching organization data`);
        // Configure the Axios request
        const config = {
            method: "GET",
            url: `${organizationServiceURI}${ApiConstants_1.default.ORGANIZATION_SERVICE_API_V1}/org/${id}`,
        };
        try {
            const organizatinData = (yield axios_1.default.request(config))
                .data;
            logger_1.default.info(`Organization data Fetched successfully: `, organizatinData);
            return organizatinData;
        }
        catch (error) {
            logger_1.default.error(`Error fetching organization data: `, error);
            if (axios_1.default.isAxiosError(error)) {
                (0, utils_1.handleAxiosError)(error);
            }
            throw error;
        }
    });
}
exports.getOrganizationDataById = getOrganizationDataById;
function getOrganizationDataByRoomId(id) {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.default.info(`Attempting to get organization data using room id:`, id);
        try {
            logger_1.default.info("Fetching organizationId of room");
            const room = yield room_model_1.default.findById(id).select("organizationId");
            if (!room) {
                const message = `couldn't find any room with this id: ${id}`;
                logger_1.default.error(message);
                throw {
                    name: "RECORD_NOT_FOUND",
                    message: message,
                    description: `Invalid room id:${id}`,
                };
            }
            const organizationId = room.organizationId;
            logger_1.default.info(`Fetched organizationId: ${organizationId}`);
            return yield getOrganizationDataById(organizationId);
        }
        catch (error) {
            logger_1.default.error(`Error while fetching organization data by room id: ${id}`);
            throw error;
        }
    });
}
exports.getOrganizationDataByRoomId = getOrganizationDataByRoomId;
