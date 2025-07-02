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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrationRunner = void 0;
var pg_1 = require("pg");
var fs = require("fs");
var path = require("path");
var logger_1 = require("../src/config/logger");
require("dotenv/config");
// Create logger instance
var logger = logger_1.Logger.getInstance();
var MigrationRunner = /** @class */ (function () {
    function MigrationRunner(config) {
        this.client = new pg_1.Client({
            host: config.host,
            port: config.port,
            database: config.database,
            user: config.username,
            password: config.password,
        });
        this.migrationFile = path.join(__dirname, "migrations.sql");
        this.undoFile = path.join(__dirname, "migrations-undo.sql");
    }
    /**
     * Connect to the PostgreSQL database
     */
    MigrationRunner.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client.connect()];
                    case 1:
                        _a.sent();
                        logger.info("Successfully connected to PostgreSQL database");
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        logger.error("Failed to connect to database", { error: error_1 });
                        throw new Error("Database connection failed: ".concat(error_1));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Disconnect from the PostgreSQL database
     */
    MigrationRunner.prototype.disconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client.end()];
                    case 1:
                        _a.sent();
                        logger.info("Database connection closed");
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        logger.error("Error closing database connection", { error: error_2 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Read SQL file content
     */
    MigrationRunner.prototype.readSqlFile = function (filePath) {
        try {
            if (!fs.existsSync(filePath)) {
                throw new Error("SQL file not found: ".concat(filePath));
            }
            var content = fs.readFileSync(filePath, "utf8");
            if (!content.trim()) {
                throw new Error("SQL file is empty: ".concat(filePath));
            }
            return content;
        }
        catch (error) {
            logger.error("Failed to read SQL file: ".concat(filePath), { error: error });
            throw error;
        }
    };
    /**
     * Execute SQL commands from a file
     */
    MigrationRunner.prototype.executeSqlFile = function (filePath, operation) {
        return __awaiter(this, void 0, void 0, function () {
            var startTime, sqlContent, duration, error_3, duration;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startTime = Date.now();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        logger.info("Starting ".concat(operation, "..."));
                        sqlContent = this.readSqlFile(filePath);
                        // Execute the SQL content
                        return [4 /*yield*/, this.client.query(sqlContent)];
                    case 2:
                        // Execute the SQL content
                        _a.sent();
                        duration = Date.now() - startTime;
                        logger.info("".concat(operation, " completed successfully"), {
                            duration: "".concat(duration, "ms"),
                            file: path.basename(filePath),
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        duration = Date.now() - startTime;
                        logger.error("".concat(operation, " failed"), {
                            error: error_3 instanceof Error ? error_3.message : error_3,
                            duration: "".concat(duration, "ms"),
                            file: path.basename(filePath),
                        });
                        throw error_3;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Run database migrations (create tables, indexes, etc.)
     */
    MigrationRunner.prototype.migrate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, 4, 6]);
                        return [4 /*yield*/, this.connect()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.executeSqlFile(this.migrationFile, "Database Migration")];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 3:
                        error_4 = _a.sent();
                        logger.error("Migration failed", { error: error_4 });
                        throw error_4;
                    case 4: return [4 /*yield*/, this.disconnect()];
                    case 5:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Rollback database migrations (drop tables, indexes, etc.)
     */
    MigrationRunner.prototype.rollback = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, 4, 6]);
                        return [4 /*yield*/, this.connect()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.executeSqlFile(this.undoFile, "Database Rollback")];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 3:
                        error_5 = _a.sent();
                        logger.error("Rollback failed", { error: error_5 });
                        throw error_5;
                    case 4: return [4 /*yield*/, this.disconnect()];
                    case 5:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Reset database (rollback then migrate)
     */
    MigrationRunner.prototype.reset = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, 5, 7]);
                        logger.info("Starting database reset...");
                        return [4 /*yield*/, this.connect()];
                    case 1:
                        _a.sent();
                        // First rollback
                        return [4 /*yield*/, this.executeSqlFile(this.undoFile, "Database Rollback")];
                    case 2:
                        // First rollback
                        _a.sent();
                        // Then migrate
                        return [4 /*yield*/, this.executeSqlFile(this.migrationFile, "Database Migration")];
                    case 3:
                        // Then migrate
                        _a.sent();
                        logger.info("Database reset completed successfully");
                        return [3 /*break*/, 7];
                    case 4:
                        error_6 = _a.sent();
                        logger.error("Database reset failed", { error: error_6 });
                        throw error_6;
                    case 5: return [4 /*yield*/, this.disconnect()];
                    case 6:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Check database connection
     */
    MigrationRunner.prototype.checkConnection = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, 4, 6]);
                        return [4 /*yield*/, this.connect()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.client.query("SELECT NOW() as current_time")];
                    case 2:
                        result = _a.sent();
                        logger.info("Database connection test successful", {
                            currentTime: result.rows[0].current_time,
                        });
                        return [2 /*return*/, true];
                    case 3:
                        error_7 = _a.sent();
                        logger.error("Database connection test failed", { error: error_7 });
                        return [2 /*return*/, false];
                    case 4: return [4 /*yield*/, this.disconnect()];
                    case 5:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return MigrationRunner;
}());
exports.MigrationRunner = MigrationRunner;
/**
 * Get database configuration from environment variables
 */
function getDatabaseConfig() {
    var requiredEnvVars = [
        "DB_HOST",
        "DB_PORT",
        "DB_NAME",
        "DB_USERNAME",
        "DB_PASSWORD",
    ];
    var missingVars = requiredEnvVars.filter(function (varName) { return !process.env[varName]; });
    if (missingVars.length > 0) {
        throw new Error("Missing required environment variables: ".concat(missingVars.join(", ")));
    }
    return {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        database: process.env.DB_NAME,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
    };
}
/**
 * Main function to handle command line arguments
 */
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var args, command, config, runner, _a, isConnected, error_8;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    args = process.argv.slice(2);
                    command = args[0];
                    if (!command) {
                        console.log("\nUsage: npx ts-node scripts/migration-runner.ts <command>\n\nCommands:\n  migrate    - Run database migrations\n  rollback   - Rollback database migrations\n  reset      - Rollback then migrate (complete reset)\n  check      - Test database connection\n\nExamples:\n  npx ts-node scripts/migration-runner.ts migrate\n  npx ts-node scripts/migration-runner.ts rollback\n  npx ts-node scripts/migration-runner.ts reset\n  npx ts-node scripts/migration-runner.ts check\n    ");
                        process.exit(1);
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 12, , 13]);
                    config = getDatabaseConfig();
                    runner = new MigrationRunner(config);
                    _a = command;
                    switch (_a) {
                        case "migrate": return [3 /*break*/, 2];
                        case "rollback": return [3 /*break*/, 4];
                        case "reset": return [3 /*break*/, 6];
                        case "check": return [3 /*break*/, 8];
                    }
                    return [3 /*break*/, 10];
                case 2: return [4 /*yield*/, runner.migrate()];
                case 3:
                    _b.sent();
                    return [3 /*break*/, 11];
                case 4: return [4 /*yield*/, runner.rollback()];
                case 5:
                    _b.sent();
                    return [3 /*break*/, 11];
                case 6: return [4 /*yield*/, runner.reset()];
                case 7:
                    _b.sent();
                    return [3 /*break*/, 11];
                case 8: return [4 /*yield*/, runner.checkConnection()];
                case 9:
                    isConnected = _b.sent();
                    process.exit(isConnected ? 0 : 1);
                    return [3 /*break*/, 11];
                case 10:
                    logger.error("Unknown command: ".concat(command));
                    process.exit(1);
                    _b.label = 11;
                case 11:
                    logger.info("Command '".concat(command, "' completed successfully"));
                    process.exit(0);
                    return [3 /*break*/, 13];
                case 12:
                    error_8 = _b.sent();
                    logger.error("Command '".concat(command, "' failed"), {
                        error: error_8 instanceof Error ? error_8.message : error_8,
                    });
                    process.exit(1);
                    return [3 /*break*/, 13];
                case 13: return [2 /*return*/];
            }
        });
    });
}
// Run main function if this file is executed directly
if (require.main === module) {
    main();
}
