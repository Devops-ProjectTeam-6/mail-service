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
exports.validateDeleteRoomData = exports.validateUpdateRoomData = exports.validateCreateRoomData = void 0;
const logger_1 = __importDefault(require("../config/logger"));
const ApiConstants_1 = __importDefault(require("../constants/ApiConstants"));
const types_1 = require("../utils/types");
const organization_service_1 = require("./organization.service");
function validateCreateRoomData(input) {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.default.info("Validating createRoomInput input");
        // Get organization data
        const organizationData = yield (0, organization_service_1.getOrganizationDataById)(input.organizationId);
        // verify current user is allowed to create room or not
        const isAllowed = verifyUserPermission(input.uid, organizationData);
        // verify available start should be greater that than current date
        // room capacity should not be more than 100
        // verify prices should not be 0
        // currency should bot be other than INR
        return isAllowed === true
            ? types_1.GenericValidInvalidEnum.VALID
            : types_1.GenericValidInvalidEnum.INVALID;
    });
}
exports.validateCreateRoomData = validateCreateRoomData;
function validateUpdateRoomData(input) {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.default.info("Validating updateRoomInput input");
        // Get organization data
        const organizationData = yield (0, organization_service_1.getOrganizationDataByRoomId)(input.id);
        // verify current user is allowed to update room or not
        const isAllowed = verifyUserPermission(input.uid, organizationData);
        return isAllowed === true
            ? types_1.GenericValidInvalidEnum.VALID
            : types_1.GenericValidInvalidEnum.INVALID;
    });
}
exports.validateUpdateRoomData = validateUpdateRoomData;
function validateDeleteRoomData(input) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get organization data
        const organizationData = yield (0, organization_service_1.getOrganizationDataByRoomId)(input.id);
        // verify current user is allowed to delete room or not
        const isAllowed = verifyUserPermission(input.uid, organizationData);
        return isAllowed === true
            ? types_1.GenericValidInvalidEnum.VALID
            : types_1.GenericValidInvalidEnum.INVALID;
    });
}
exports.validateDeleteRoomData = validateDeleteRoomData;
function verifyUserPermission(currentUserId, organizationData) {
    var _a, _b;
    logger_1.default.info("Checking if the current user has the permissions.");
    logger_1.default.info(`Getting all organization admins`);
    const superAdmin = (_a = organizationData.superAdmin) === null || _a === void 0 ? void 0 : _a.uid;
    const admins = ((_b = organizationData.admins) !== null && _b !== void 0 ? _b : []).map((data) => {
        return data.uid;
    });
    const allAdmins = [superAdmin, ...admins];
    logger_1.default.info(`All organization admins: ${allAdmins}`);
    // Checking if the current user is an organization admin
    const isAdminIdExists = allAdmins.includes(currentUserId);
    if (isAdminIdExists) {
        logger_1.default.info(`The current user have permission.`);
        return true;
    }
    else {
        logger_1.default.error(`The current user does not have permission.`);
        throw {
            name: "AppError",
            errorCode: ApiConstants_1.default.UNAUTHORIZED,
            message: "Only admin have permission to create or update rooms.",
            details: "The current user is not recognized as an organization admin",
            status: 401,
        };
    }
}
