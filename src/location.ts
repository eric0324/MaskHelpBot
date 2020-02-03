import axios from 'axios';

function LocationTemplate(data: any) {
    let mask_status                = "未知"
    let mask_status_color          = "#777777"
    let children_mask_status       = "未知"
    let children_mask_status_color = "#777777"

    switch (data.MaskStatus) {
        case 'AVAILABLE':
            mask_status       = "充足"
            mask_status_color = "#00ff00"
            break;
        case 'SHORTAGE':
            mask_status       = "售完"
            mask_status_color = "#ff0000"
    }
    switch (data.childrenMaskStatus) {
        case 'AVAILABLE':
            children_mask_status       = "充足"
            children_mask_status_color = "#00ff00"
            break;
        case 'SHORTAGE':
            children_mask_status       = "售完"
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
                        data: 'report&id='+data.id,
                    },
                }
            ],
        },
    };
}

async function getData(lat: string, lng: string){
    let url: string = process.env.MASK_API_PATH + "/api/supply?page=0&size=10&lat=" + lat + "&lng=" + lng + "&radius=1000" || ""
    return await axios.get(
        url
    )
}

async function LocationReply(context: any) {
    let latitude  = context.event.message.latitude;
    let longitude = context.event.message.longitude;

    const response = await getData(latitude, longitude);
    var resp = response.data

    let contents: any = [];

    for (var index in resp.content) {
        var place_bubble = LocationTemplate(resp.content[index]);
        contents.push(place_bubble);
    }

    var carousel: any = {
        type: 'carousel',
        contents: contents,
    };
    context.sendFlex('您傳送位址附近的商家', carousel);
}

module.exports = {
    LocationReply,
};