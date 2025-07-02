"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
var pino_1 = require("pino");
var path_1 = require("path");
var fs_1 = require("fs");
var Logger = /** @class */ (function () {
    function Logger() {
        var logLevel = process.env.LOG_LEVEL || "info";
        var isProduction = process.env.NODE_ENV === "production";
        var enableFileLogging = process.env.LOG_FILE === "true";
        // Create logs directory if it doesn't exist
        var logsDir = (0, path_1.join)(process.cwd(), "logs");
        if (enableFileLogging && !(0, fs_1.existsSync)(logsDir)) {
            (0, fs_1.mkdirSync)(logsDir, { recursive: true });
        }
        if (isProduction) {
            if (enableFileLogging) {
                // Production with file logging: Log to both files and console
                // Note: Cannot use custom formatters with transport.targets
                var today = new Date().toISOString().split("T")[0];
                var appLogFile = (0, path_1.join)(logsDir, "app-".concat(today, ".log"));
                var errorLogFile = (0, path_1.join)(logsDir, "error-".concat(today, ".log"));
                this.logger = (0, pino_1.default)({
                    level: logLevel,
                    timestamp: pino_1.default.stdTimeFunctions.isoTime,
                    transport: {
                        targets: [
                            // Console output with simple formatting (no pino-pretty)
                            {
                                target: "pino/file",
                                level: logLevel,
                                options: {
                                    destination: 1, // stdout
                                },
                            },
                            // File output for all logs
                            {
                                target: "pino/file",
                                level: logLevel,
                                options: {
                                    destination: appLogFile,
                                },
                            },
                            // Separate error file
                            {
                                target: "pino/file",
                                level: "error",
                                options: {
                                    destination: errorLogFile,
                                },
                            },
                        ],
                    },
                });
            }
            else {
                // Production without file logging: Simple console output with formatters
                this.logger = (0, pino_1.default)({
                    level: logLevel,
                    timestamp: pino_1.default.stdTimeFunctions.isoTime,
                    formatters: {
                        level: function (label) {
                            return { level: label.toUpperCase() };
                        },
                    },
                });
            }
        }
        else {
            // Development: Pretty print to console with custom formatters
            this.logger = (0, pino_1.default)({
                level: logLevel,
                timestamp: pino_1.default.stdTimeFunctions.isoTime,
                formatters: {
                    level: function (label) {
                        return { level: label };
                    },
                },
                transport: {
                    target: "pino-pretty",
                    options: {
                        colorize: true,
                        ignore: "pid,hostname",
                        translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
                    },
                },
            });
        }
    }
    Logger.getInstance = function () {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    };
    Logger.prototype.info = function (message) {
        var _a;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        (_a = this.logger).info.apply(_a, __spreadArray([message], args, false));
    };
    Logger.prototype.error = function (message, error) {
        this.logger.error({ error: error }, message);
    };
    Logger.prototype.warn = function (message) {
        var _a;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        (_a = this.logger).warn.apply(_a, __spreadArray([message], args, false));
    };
    Logger.prototype.debug = function (message) {
        var _a;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        (_a = this.logger).debug.apply(_a, __spreadArray([message], args, false));
    };
    Logger.prototype.trace = function (message) {
        var _a;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        (_a = this.logger).trace.apply(_a, __spreadArray([message], args, false));
    };
    Logger.prototype.fatal = function (message, error) {
        this.logger.fatal({ error: error }, message);
    };
    Logger.prototype.getLogger = function () {
        return this.logger;
    };
    return Logger;
}());
exports.Logger = Logger;
