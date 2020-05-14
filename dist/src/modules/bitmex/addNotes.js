"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_graphql_1 = require("type-graphql");
const connectionOptions_1 = require("../utils/connectionOptions");
const User_1 = require("../../entity/User");
const Trade_1 = require("../../entity/Trade");
const bitmexHelpers_1 = require("../../sentiment_modules/bitmex/bitmexHelpers");
let AddNotesResolver = class AddNotesResolver {
    addNotes(time, notes, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!ctx.req.session.userId) {
                return undefined;
            }
            let randId = bitmexHelpers_1.makeid(10);
            let connection = yield connectionOptions_1.createConn(randId);
            let tradeRepo = connection.getRepository(Trade_1.Trade);
            let userRepo = connection.getRepository(User_1.User);
            let thisUser = yield userRepo.find({
                where: { id: ctx.req.session.userId }
            });
            console.log(thisUser[0]);
            let findings = yield tradeRepo.find({
                where: [
                    {
                        user: thisUser[0],
                        relations: ["user"],
                        timestamp: time
                    }
                ],
                order: { tradeNum: "ASC" }
            });
            try {
                if (notes != "undefined") {
                    findings[0].notes = notes;
                }
                yield findings[0].save();
                yield connection.close();
                return true;
            }
            catch (err) {
                return false;
            }
        });
    }
};
__decorate([
    type_graphql_1.Mutation(() => String, { nullable: true }),
    __param(0, type_graphql_1.Arg("time")),
    __param(1, type_graphql_1.Arg("notes")),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AddNotesResolver.prototype, "addNotes", null);
AddNotesResolver = __decorate([
    type_graphql_1.Resolver()
], AddNotesResolver);
exports.AddNotesResolver = AddNotesResolver;
//# sourceMappingURL=addNotes.js.map