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
var fs_1 = __importDefault(require("fs"));
var axios_1 = __importDefault(require("axios"));
var jsonQuery = require('json-query');
function LocationTemplate(data) {
    var mask_status_color = "#777777";
    var children_mask_status_color = "#777777";
    if (parseInt(data.adult_number) > 20) {
        mask_status_color = "#00ff00";
    }
    else {
        mask_status_color = "#ff0000";
    }
    if (parseInt(data.childer_number) > 20) {
        children_mask_status_color = "#00ff00";
    }
    else {
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
                    text: data.name,
                    weight: 'bold',
                    size: 'lg',
                },
                {
                    type: 'text',
                    margin: 'lg',
                    text: data.address,
                    weight: 'bold',
                    color: '#aaaaaa',
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
                                    text: '成人口罩剩下',
                                    color: '#aaaaaa',
                                    size: 'md',
                                    flex: 4,
                                },
                                {
                                    type: 'text',
                                    text: data.adult_number,
                                    wrap: true,
                                    color: mask_status_color,
                                    size: 'md',
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
                                    text: '兒童口罩剩下',
                                    color: '#aaaaaa',
                                    size: 'md',
                                    flex: 4,
                                },
                                {
                                    type: 'text',
                                    text: data.childer_number,
                                    wrap: true,
                                    color: children_mask_status_color,
                                    size: 'md',
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
                        uri: 'https://www.google.com/maps/search/?api=1&query=' + data.lat + ',' + data.lng,
                    },
                },
                {
                    type: 'button',
                    action: {
                        type: 'uri',
                        label: '緊急聯繫電話',
                        uri: 'tel:' + data.phone,
                    },
                }
            ],
        },
    };
}
function getData(lat, lng) {
    return __awaiter(this, void 0, void 0, function () {
        var path, fileContent, jsonContent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    path = "point.json";
                    new Promise(function () {
                        fileContent = fs_1.default.readFileSync(path, { encoding: 'utf8' });
                        jsonContent = JSON.parse(fileContent);
                    });
                    return [4 /*yield*/, queryNearbyPoint(jsonContent, lat, lng)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function queryNearbyPoint(data, lat, lng) {
    return __awaiter(this, void 0, void 0, function () {
        var nearby_point_array, resp_data, csv;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nearby_point_array = [];
                    data.forEach(function (element) {
                        if (distance(lat, lng, element.Response_Y, element.Response_X) <= 5) {
                            nearby_point_array.push(element);
                        }
                    });
                    resp_data = [];
                    return [4 /*yield*/, getNHIData()];
                case 1:
                    csv = _a.sent();
                    nearby_point_array.forEach(function (element) {
                        var wanted = jsonQuery('data[code=' + element.醫事機構代碼 + ']', {
                            data: csv
                        });
                        if (wanted.value != null) {
                            var d = wanted.value;
                            d["lng"] = element.Response_X;
                            d["lat"] = element.Response_Y;
                            resp_data.push(d);
                        }
                    });
                    return [2 /*return*/, resp_data];
            }
        });
    });
}
function distance(lat1, lon1, lat2, lon2) {
    var radlat1 = Math.PI * lat1 / 180;
    var radlat2 = Math.PI * lat2 / 180;
    var theta = lon1 - lon2;
    var radtheta = Math.PI * theta / 180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
        dist = 1;
    }
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515 * 1.609344;
    return dist;
}
function getNHIData() {
    return __awaiter(this, void 0, void 0, function () {
        var mask_path, allText, text, lines, results, i, currentline, obj;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mask_path = "https://data.nhi.gov.tw/resource/mask/maskdata.csv";
                    return [4 /*yield*/, axios_1.default.get(mask_path)];
                case 1:
                    allText = _a.sent();
                    text = allText.data;
                    lines = text.split("\n");
                    results = [];
                    for (i = 1; i < lines.length - 1; i++) {
                        currentline = lines[i].split(",");
                        obj = {
                            code: currentline[0],
                            name: currentline[1],
                            address: currentline[2],
                            phone: currentline[3],
                            adult_number: currentline[4],
                            childer_number: currentline[5],
                            update: currentline[6],
                        };
                        results.push(obj);
                    }
                    return [2 /*return*/, JSON.parse(JSON.stringify({
                            'data': results
                        }))];
            }
        });
    });
}
function LocationReply(context) {
    return __awaiter(this, void 0, void 0, function () {
        var latitude, longitude, response, contents, carousel_num, index, place_bubble, carousel;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    latitude = context.event.message.latitude;
                    longitude = context.event.message.longitude;
                    return [4 /*yield*/, getData(latitude, longitude)];
                case 1:
                    response = _a.sent();
                    if (response.length > 0) {
                        contents = [];
                        carousel_num = 1;
                        for (index in response) {
                            place_bubble = LocationTemplate(response[index]);
                            contents.push(place_bubble);
                            carousel_num++;
                            if (carousel_num == 10) {
                                break;
                            }
                        }
                        carousel = {
                            type: 'carousel',
                            contents: contents,
                        };
                        context.sendFlex('您傳送位址附近的藥局', carousel);
                    }
                    else {
                        context.sendText('您傳送位址附近沒有可用的藥局');
                    }
                    return [2 /*return*/];
            }
        });
    });
}
module.exports = {
    LocationReply: LocationReply,
};
