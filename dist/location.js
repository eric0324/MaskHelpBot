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
function LocationTemplate(data) {
    var mask_status = "未知";
    var mask_status_color = "#777777";
    var children_mask_status = "未知";
    var children_mask_status_color = "#777777";
    switch (data.MaskStatus) {
        case 'AVAILABLE':
            mask_status = "充足";
            mask_status_color = "#00ff00";
            break;
        case 'SHORTAGE':
            mask_status = "售完";
            mask_status_color = "#ff0000";
    }
    switch (data.childrenMaskStatus) {
        case 'AVAILABLE':
            children_mask_status = "充足";
            children_mask_status_color = "#00ff00";
            break;
        case 'SHORTAGE':
            children_mask_status = "售完";
            children_mask_status_color = "#ff0000";
    }
    return {
        type: 'bubble',
        body: {
            type: 'box',
            layout: 'vertical',
            contents: [
                {
                    type: 'text',
                    text: data.category + data.name,
                    weight: 'bold',
                    size: 'md',
                },
                {
                    type: 'box',
                    layout: 'vertical',
                    margin: 'lg',
                    contents: [
                        {
                            type: 'box',
                            layout: 'baseline',
                            contents: [
                                {
                                    type: 'text',
                                    text: '口罩供應狀態',
                                    color: '#aaaaaa',
                                    size: 'sm',
                                    flex: 4,
                                },
                                {
                                    type: 'text',
                                    text: mask_status,
                                    wrap: true,
                                    color: mask_status_color,
                                    size: 'sm',
                                    flex: 2,
                                },
                            ],
                        },
                    ],
                },
                {
                    type: 'box',
                    layout: 'vertical',
                    margin: 'lg',
                    contents: [
                        {
                            type: 'box',
                            layout: 'baseline',
                            contents: [
                                {
                                    type: 'text',
                                    text: '兒童口罩供應狀態',
                                    color: '#aaaaaa',
                                    size: 'sm',
                                    flex: 4,
                                },
                                {
                                    type: 'text',
                                    text: children_mask_status,
                                    wrap: true,
                                    color: children_mask_status_color,
                                    size: 'sm',
                                    flex: 2,
                                },
                            ],
                        },
                    ],
                },
            ]
        },
        footer: {
            type: 'box',
            layout: 'vertical',
            contents: [
                {
                    type: 'button',
                    action: {
                        type: 'uri',
                        label: 'Google Map',
                        uri: 'https://www.google.com/maps/@' + data.lat + ',' + data.lng,
                    },
                },
                {
                    type: 'button',
                    action: {
                        type: 'postback',
                        label: '回報供應狀態',
                        data: 'report&id=' + data.id,
                    },
                }
            ],
        },
    };
}
function getData(lat, lng) {
    return __awaiter(this, void 0, void 0, function () {
        var url;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = process.env.MASK_API_PATH + "/api/supply?page=0&size=10&lat=" + lat + "&lng=" + lng + "&radius=1000" || "";
                    return [4 /*yield*/, axios_1.default.get(url)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function LocationReply(context) {
    return __awaiter(this, void 0, void 0, function () {
        var latitude, longitude, response, resp, contents, index, place_bubble, carousel;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    latitude = context.event.message.latitude;
                    longitude = context.event.message.longitude;
                    return [4 /*yield*/, getData(latitude, longitude)];
                case 1:
                    response = _a.sent();
                    resp = response.data;
                    contents = [];
                    for (index in resp.content) {
                        place_bubble = LocationTemplate(resp.content[index]);
                        contents.push(place_bubble);
                    }
                    carousel = {
                        type: 'carousel',
                        contents: contents,
                    };
                    context.sendFlex('您傳送位址附近的商家', carousel);
                    return [2 /*return*/];
            }
        });
    });
}
module.exports = {
    LocationReply: LocationReply,
};
