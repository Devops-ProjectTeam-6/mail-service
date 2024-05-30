"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInstanceURI = void 0;
const eurekaClientConfig_1 = __importDefault(require("../config/eurekaClientConfig"));
const logger_1 = __importDefault(require("../config/logger"));
const ApiConstants_1 = __importDefault(require("../constants/ApiConstants"));
function getInstanceURI(serviceName) {
    logger_1.default.info(`fetching ${serviceName} URI from discovery server`);
    const instances = eurekaClientConfig_1.default.getInstancesByAppId(serviceName);
    let URI = null;
    if (instances && instances.length > 0) {
        const instance = instances[0];
        const isSecure = instance.securePort["@enabled"] === "true";
        const protocol = isSecure ? "https" : "http";
        const ipAddr = instance.ipAddr;
        const port = instance.port.$;
        URI = `${protocol}://${ipAddr}:${port}`;
        // Alternatively, we can use the instance's homePageUri
        // URI = instance["homePageUrI"];
    }
    else {
        logger_1.default.error(`Service ${serviceName} is not available.`);
        throw {
            name: "AppError",
            errorCode: ApiConstants_1.default.SERVICE_UNAVAILABLE,
            message: `Service ${serviceName} is not available.`,
            details: "Not registered on the Eureka server",
            status: 500,
        };
    }
    logger_1.default.info(`fetched ${serviceName} URI: ${URI}`);
    return URI;
}
exports.getInstanceURI = getInstanceURI;
