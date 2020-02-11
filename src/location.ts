import fs from 'fs';
import axios from 'axios';
var jsonQuery = require('json-query')
​
function LocationTemplate(data: any) {
    let mask_status_color          = "#777777"
    let children_mask_status_color = "#777777"
    if ( parseInt(data.adult_number) > 20 ) {
        mask_status_color = "#00ff00"
    }else{
        mask_status_color = "#ff0000"
    }
    if ( parseInt(data.childer_number) > 20 ) {
        children_mask_status_color = "#00ff00"
    }else{
        children_mask_status_color = "#ff0000"
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
                        uri: 'tel:'+data.phone,
                    },
                }
            ],
        },
    };
}

async function getData(lat: string, lng: string){
    
    let path: string= "point.json";
    let fileContent, jsonContent;

    new Promise(function() {
        fileContent = fs.readFileSync(path, {encoding: 'utf8'});
        jsonContent = JSON.parse(fileContent);
    });

    return await queryNearbyPoint(jsonContent, lat, lng);
}

async function queryNearbyPoint(data: any, lat: any, lng: any) {
    // Get nearby place
    var nearby_point_array:any = []

    data.forEach((element: { Response_X: any, Response_Y: any, lat_min: any, lat_mix: any })=> {
        if (distance(lat, lng, element.Response_Y, element.Response_X) <= 5) {
            nearby_point_array.push(element)
        }
    });
    let resp_data: any = [];


    
    let csv:any = await getNHIData();
    nearby_point_array.forEach((element: any) => {
        var wanted = jsonQuery('data[code='+element.醫事機構代碼+']', {
            data: csv
        })
        if (wanted.value != null) {
            var d = wanted.value
            d["lng"] = element.Response_X
            d["lat"] = element.Response_Y
            resp_data.push(d)
        }
    });
    return resp_data;
    
}

function distance(lat1: any, lon1: any, lat2: any, lon2: any) {
    var radlat1 = Math.PI * lat1 / 180
    var radlat2 = Math.PI * lat2 / 180
    var theta = lon1 - lon2
    var radtheta = Math.PI * theta / 180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
        dist = 1;
    }
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515 * 1.609344
    return dist
}



async function getNHIData(){
    // Get NHI Data
    let mask_path = "https://data.nhi.gov.tw/resource/mask/maskdata.csv"
    let allText: any = await axios.get(mask_path);
    let text = allText.data;
    let lines = text.split("\n");
    let results = [];

    for( var i=1 ; i<lines.length-1 ; i++){

        var currentline = lines[i].split(",");
        let obj = {
            code:          currentline[0],
            name:          currentline[1],
            address:       currentline[2],
            phone:         currentline[3], 
            adult_number:  currentline[4], 
            childer_number: currentline[5], 
            update:        currentline[6], 
        }
        results.push(obj);
    }
    return JSON.parse(JSON.stringify({
        'data': results
    }));
}


async function LocationReply(context: any) {
    let latitude  = context.event.message.latitude;
    let longitude = context.event.message.longitude;

    const response : any= await getData(latitude, longitude);

    if (response.length > 0) {
        let contents: any = [];
        var carousel_num = 1;

        for (var index in response) {
            var place_bubble = LocationTemplate(response[index]);
            contents.push(place_bubble);
            carousel_num++
            if (carousel_num == 10) {
                break;
            }
        }

        var carousel: any = {
            type: 'carousel',
            contents: contents,
        };
        context.sendFlex('您傳送位址附近的藥局', carousel);
    } else {
        context.sendText('您傳送位址附近沒有可用的藥局');
    }
}

module.exports = {
    LocationReply,
};
