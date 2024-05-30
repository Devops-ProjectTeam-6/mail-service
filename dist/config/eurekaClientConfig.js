"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppConstants_1 = __importDefault(require("../constants/AppConstants"));
const Eureka = require("eureka-js-client").Eureka;
const eurekaClient = new Eureka({
    instance: {
        app: AppConstants_1.default.MAIL_SERVICE,
        hostName: "localhost",
        ipAddr: "3.229.47.37",
        status: "UP",
        port: {
            $: 8089,
            "@enabled": true,
        },
        vipAddress: AppConstants_1.default.MAIL_SERVICE,
        dataCenterInfo: {
            "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
            name: "MyOwn",
        },
    },
    eureka: {
        host: "3.229.47.37",
        port: 8761,
        servicePath: "/eureka/apps",
    },
});
exports.default = eurekaClient;
