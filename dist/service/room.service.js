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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRoomAvailability = exports.getRooms = exports.deleteRooms = exports.deleteRoom = exports.getRoom = exports.updateRoom = exports.createRoom = void 0;
const model_1 = require("../model");
const room_model_1 = __importDefault(require("../model/room.model"));
const ApiConstants_1 = __importDefault(require("../constants/ApiConstants"));
const logger_1 = __importDefault(require("../config/logger"));
const room_validation_service_1 = require("./room.validation.service");
const types_1 = require("../utils/types");
function createRoom(input) {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.default.info(`Attempting room creation with input: `, input);
        // validate createRoom data
        const valid = yield (0, room_validation_service_1.validateCreateRoomData)(input);
        if (valid === types_1.GenericValidInvalidEnum.VALID) {
            const newRoom = {
                organizationId: input.organizationId,
                title: input.title,
                description: input.description,
                availableDates: input.availableDates,
                prices: input.prices,
                createdBy: input.uid,
                updatedBy: input.uid,
                note: input.note,
                capacity: input.capacity,
                bookingStatus: model_1.BookingStatus[input.bookingStatus],
                amenities: input.amenities,
                mainImage: input.mainImage,
                images: input.images,
                features: input.features,
                city: input.city,
                address: input.address,
                checkInTypes: input.checkInTypes.map((value) => model_1.CheckInType[value]),
            };
            return yield room_model_1.default.create(newRoom);
        }
        else {
            throw {
                name: "AppError",
                errorCode: ApiConstants_1.default.INVALID_DATA,
                message: "Invalid room data",
                details: "",
                status: 400,
            };
        }
    });
}
exports.createRoom = createRoom;
function updateRoom(input) {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.default.info(`Attempting room updation with input: `, input);
        // validate uodateRoom data
        const valid = yield (0, room_validation_service_1.validateUpdateRoomData)(input);
        if (valid === types_1.GenericValidInvalidEnum.VALID) {
            let { uid } = input, userGivenData = __rest(input, ["uid"]);
            return yield room_model_1.default.findByIdAndUpdate(input.id, {
                $set: Object.assign(Object.assign({}, userGivenData), { updatedBy: uid }),
            }, { new: true });
        }
        else {
            throw {
                name: "AppError",
                errorCode: ApiConstants_1.default.INVALID_DATA,
                message: "Invalid room data",
                details: "",
                status: 400,
            };
        }
    });
}
exports.updateRoom = updateRoom;
function getRoom(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield room_model_1.default.findById(id);
    });
}
exports.getRoom = getRoom;
function deleteRoom(input) {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.default.info(`Attempting to delete room with id: ${input.id}`);
        // validate delete room data
        const valid = yield (0, room_validation_service_1.validateDeleteRoomData)(input);
        if (valid === types_1.GenericValidInvalidEnum.VALID) {
            return yield room_model_1.default.findByIdAndDelete(input.id);
        }
        else {
            throw {
                name: "AppError",
                errorCode: ApiConstants_1.default.INVALID_DATA,
                message: "Invalid roomId data",
                details: "",
                status: 400,
            };
        }
    });
}
exports.deleteRoom = deleteRoom;
function deleteRooms(input) {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.default.info(`Attempting to delete rooms with ids: ${input.ids}`);
        // validate delete room data
        const valid = yield (0, room_validation_service_1.validateDeleteRoomData)({
            id: input.ids[0],
            uid: input.uid,
        });
        if (valid === types_1.GenericValidInvalidEnum.VALID) {
            return yield room_model_1.default.deleteMany({
                _id: {
                    $in: input.ids,
                },
            });
        }
        else {
            throw {
                name: "AppError",
                errorCode: ApiConstants_1.default.INVALID_DATA,
                message: "Invalid roomId data",
                details: "",
                status: 400,
            };
        }
    });
}
exports.deleteRooms = deleteRooms;
function getRooms(page, limit, query) {
    return __awaiter(this, void 0, void 0, function* () {
        const { sort = {} } = query, findQuery = __rest(query, ["sort"]);
        const rooms = yield room_model_1.default.find(findQuery)
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
        const count = yield room_model_1.default.countDocuments(query);
        return {
            rooms,
            totalRecods: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        };
    });
}
exports.getRooms = getRooms;
function checkRoomAvailability(id, input) {
    return __awaiter(this, void 0, void 0, function* () {
        const givenCheckInDate = new Date(input.checkIn);
        const givenCheckOutDate = new Date(input.checkOut);
        const guests = Number(input.guests);
        const room = yield room_model_1.default.findById(id);
        if (!room) {
            const message = `couldn't find any room with this id: ${id}`;
            logger_1.default.error(message);
            throw {
                name: "AppError",
                errorCode: "RECORD_NOT_FOUND",
                message: `couldn't find any room with this id: ${id}`,
                details: `couldn't find any room with this id: ${id}`,
                status: 404,
            };
        }
        // check if room bookingStatus is AVAILABLE
        if (room.bookingStatus !== model_1.BookingStatus.AVAILABLE) {
            return {
                available: false,
                message: "Room is currently unavailable.",
            };
        }
        // check if given dates are within the range of record's startDate and endDate;
        const availableDates = room.availableDates;
        if (!(givenCheckInDate >= availableDates.startDate &&
            givenCheckOutDate <= availableDates.endDate)) {
            return {
                available: false,
                message: "Dates are outside the range",
            };
        }
        // check if given guests number within the range
        if (room.capacity < guests) {
            return {
                available: false,
                message: "Guests are outside the room's capacity",
            };
        }
        return {
            available: true,
            message: "available",
        };
    });
}
exports.checkRoomAvailability = checkRoomAvailability;
