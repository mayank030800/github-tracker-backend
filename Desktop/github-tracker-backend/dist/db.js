"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const user_1 = __importDefault(require("./entities/user"));
const repository_1 = __importDefault(require("./entities/repository"));
const release_1 = __importDefault(require("./entities/release"));
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'myuser', // Replace with your DB username
    password: 'mypassword', // Replace with your DB password
    database: 'mydb', // Ensure this DB exists
    synchronize: true, // Auto-create tables in development
    logging: true,
    entities: [user_1.default, repository_1.default, release_1.default],
});
