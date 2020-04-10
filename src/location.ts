import fs from 'fs';
import axios from 'axios';
import { LineContext, LineTypes } from 'bottender';
import jsonQuery from 'json-query';
function locationTemplate(data: any): LineTypes.FlexBubble {
  let mask_status_color = '#777777';
  let children_mask_status_color = '#777777';
  if (parseInt(data.adult_number) > 20) {
    mask_status_color = '#00ff00';
  } else {
    mask_status_color = '#ff0000';
  }
  if (parseInt(data.childer_number) > 20) {
    children_mask_status_color = '#00ff00';
  } else {
    children_mask_status_color = '#ff0000';
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
      ],
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
            uri:
              'https://www.google.com/maps/search/?api=1&query=' +
              data.lat +
              ',' +
              data.lng,
          },
        },
        {
          type: 'button',
          action: {
            type: 'uri',
            label: '緊急聯繫電話',
            uri: 'tel:' + data.phone,
          },
        },
      ],
    },
  };
}

async function getData(lat: string, lng: string) {
  const path = 'point.json';
  let fileContent, jsonContent;

  new Promise(function() {
    fileContent = fs.readFileSync(path, { encoding: 'utf8' });
    jsonContent = JSON.parse(fileContent);
  });

  return await queryNearbyPoint(jsonContent, lat, lng);
}

async function queryNearbyPoint(data: any, lat: any, lng: any) {
  // Get nearby place
  const nearby_point_array: any = [];

  data.forEach(
    (element: {
      Response_X: any;
      Response_Y: any;
      lat_min: any;
      lat_mix: any;
    }) => {
      if (distance(lat, lng, element.Response_Y, element.Response_X) <= 5) {
        nearby_point_array.push(element);
      }
    }
  );
  const resp_data: any = [];

  const csv: any = await getNHIData();
  nearby_point_array.forEach((element: any) => {
    const wanted = jsonQuery('data[code=' + element.醫事機構代碼 + ']', {
      data: csv,
    });
    if (wanted.value != null) {
      const d = wanted.value;
      d['lng'] = element.Response_X;
      d['lat'] = element.Response_Y;
      resp_data.push(d);
    }
  });
  return resp_data;
}

function distance(lat1: any, lon1: any, lat2: any, lon2: any) {
  const radlat1 = (Math.PI * lat1) / 180;
  const radlat2 = (Math.PI * lat2) / 180;
  const theta = lon1 - lon2;
  const radtheta = (Math.PI * theta) / 180;
  let dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  if (dist > 1) {
    dist = 1;
  }
  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515 * 1.609344;
  return dist;
}

async function getNHIData() {
  // Get NHI Data
  const mask_path = 'https://data.nhi.gov.tw/resource/mask/maskdata.csv';
  const allText: any = await axios.get(mask_path);
  const text = allText.data;
  const lines = text.split('\n');
  const results = [];

  for (let i = 1; i < lines.length - 1; i++) {
    const currentline = lines[i].split(',');
    const obj = {
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
  return JSON.parse(
    JSON.stringify({
      data: results,
    })
  );
}

export async function LocationReply(context: LineContext): Promise<void> {
  const latitude = context.event.message.latitude;
  const longitude = context.event.message.longitude;

  const response = await getData(latitude, longitude);

  if (response.length > 0) {
    const contents: LineTypes.FlexBubble[] = [];
    let carouselNum = 1;

    for (const index in response) {
      const placeBubble: LineTypes.FlexBubble = locationTemplate(
        response[index]
      );
      contents.push(placeBubble);
      carouselNum++;
      if (carouselNum == 10) {
        break;
      }
    }

    const carousel: LineTypes.FlexCarousel = {
      type: 'carousel',
      contents: contents,
    };
    await context.sendFlex('您傳送位址附近的藥局', carousel);
  } else {
    await context.sendText('您傳送位址附近沒有可用的藥局');
  }
}
