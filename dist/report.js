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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
function ReportReply(context) {
    return __awaiter(this, void 0, void 0, function () {
        var data, id, quickReply;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    data = context.event.postback.data.split("&");
                    id = data[1].split("=")[1];
                    quickReply = {
                        items: [
                            {
                                type: 'action',
                                action: {
                                    type: 'postback',
                                    label: '充足',
                                    data: 'report_status&status=AVAILABLE&id=' + id
                                },
                            },
                            {
                                type: 'action',
                                action: {
                                    type: 'postback',
                                    label: '短缺',
                                    data: 'report_status&status=SHORTAGE&id=1' + id
                                },
                            },
                            {
                                type: 'action',
                                action: {
                                    type: 'postback',
                                    label: '未知',
                                    data: 'report_status&status=UNKNOWN&id=1' + id
                                },
                            },
                        ],
                    };
                    return [4 /*yield*/, context.send([
                            {
                                type: 'text',
                                text: '請問該店的口罩使用狀態？',
                                quickReply: quickReply,
                            },
                        ])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function sendData(status, id) {
    return __awaiter(this, void 0, void 0, function () {
        var url, readyData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = process.env.MASK_API_PATH + "/api/supply/" + id || "";
                    readyData = {
                        maskStatus: status
                    };
                    return [4 /*yield*/, axios_1.default.patch(url, readyData)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function ReportStatusReply(context) {
    return __awaiter(this, void 0, void 0, function () {
        var data, status, id, resp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    data = context.event.postback.data.split("&");
                    status = data[1].split("=")[1];
                    id = data[2].split("=")[1];
                    return [4 /*yield*/, sendData(status, id)];
                case 1:
                    resp = _a.sent();
                    return [4 /*yield*/, context.send([
                            {
                                type: 'text',
                                text: '感謝您的回報！口罩夠用就好！請不要囤貨喔！',
                            },
                        ])];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
module.exports = {
    ReportReply: ReportReply,
    ReportStatusReply: ReportStatusReply
};