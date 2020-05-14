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
const typeorm_1 = require("typeorm");
const Candle_1 = require("../../entity/Candle");
const bitmexHelpers_1 = require("../../sentiment_modules/bitmex/bitmexHelpers");
let OneDayCandleHistoryResolver = class OneDayCandleHistoryResolver {
    fetchOneDayCandleHistory(start, end, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!ctx.req.session.userId) {
                return undefined;
            }
            let randId = bitmexHelpers_1.makeid(10);
            let connection = yield connectionOptions_1.createConn(randId);
            let newStart = new Date(start);
            let newEnd = new Date(end);
            var MS_PER_MINUTE = 60000;
            let timeframe = "1d";
            newStart = new Date(newStart - 4 * 24 * 60 * MS_PER_MINUTE);
            newEnd = new Date(newEnd.getTime() + 4 * 24 * 60 * MS_PER_MINUTE);
            const findings = yield typeorm_1.getRepository(Candle_1.Candle)
                .createQueryBuilder("candle")
                .where("timestamp >= :timestamp AND timestamp < :timestamptwo AND timeframe = :timeframe", {
                timestamp: newStart.toISOString(),
                timestamptwo: newEnd.toISOString(),
                timeframe: timeframe
            })
                .orderBy("candle.timestamp", "DESC")
                .getMany();
            connection.close();
            console.log(newStart, newEnd, timeframe);
            return findings;
        });
    }
};
__decorate([
    type_graphql_1.Query(() => [Candle_1.Candle]),
    __param(0, type_graphql_1.Arg("start")),
    __param(1, type_graphql_1.Arg("end")),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], OneDayCandleHistoryResolver.prototype, "fetchOneDayCandleHistory", null);
OneDayCandleHistoryResolver = __decorate([
    type_graphql_1.Resolver()
], OneDayCandleHistoryResolver);
exports.OneDayCandleHistoryResolver = OneDayCandleHistoryResolver;
//# sourceMappingURL=dayCandles.js.map