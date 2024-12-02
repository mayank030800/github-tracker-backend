"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userResolver = void 0;
const db_1 = require("../db");
const user_1 = __importDefault(require("../entities/user"));
exports.userResolver = {
    Query: {},
    Mutation: {
        addUser: async (_, { username }) => {
            const userRepo = db_1.AppDataSource.getRepository(user_1.default);
            const existingUser = await userRepo.findOne({ where: { username } });
            if (existingUser) {
                throw new Error('Username already exists');
            }
            // let userId = uuidv4();
            // console.log(userId);
            // userIdString = userId.stringify();
            const user = userRepo.create({ username: username });
            return userRepo.save(user);
        },
    },
};
