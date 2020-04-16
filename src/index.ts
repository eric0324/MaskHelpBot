import { LineContext } from 'bottender';

import { ExceptionReply } from './exception';
import { LocationReply } from './location';
import { TodayReply } from './today';

export default async function App(context: LineContext) {
  if (context.event.isText) {
    if (context.event.text == '今天誰可以買口罩') {
      return TodayReply;
    } else {
      return ExceptionReply;
    }
  } else if (context.event.isFollow) {
    await context.send([
      {
        type: 'text',
        text:
          '感謝您加我好友！這隻機器人主要會協助您找到附近有在販售口罩的藥局',
      },
      {
        type: 'image',
        originalContentUrl: 'https://i.imgur.com/eg5irdx.jpg',
        previewImageUrl: 'https://i.imgur.com/eg5irdx.jpg',
      },
    ]);
  } else if (context.event.isLocation) {
    return LocationReply;
  }
}
