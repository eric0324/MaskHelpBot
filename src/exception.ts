import { LineContext, LineTypes } from 'bottender';

export async function ExceptionReply(context: LineContext): Promise<void> {
  const bubble: LineTypes.FlexBubble = {
    type: 'bubble',
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'text',
          margin: 'sm',
          text: '無法理解',
          weight: 'bold',
          size: 'lg',
        },
        {
          type: 'text',
          margin: 'sm',
          wrap: true,
          text: '我無法理解您的內容，試著直接傳送位址看看！',
          color: '#777777',
          size: 'md',
          flex: 1,
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
            label: '傳送位址',
            uri: 'line://nv/location',
          },
        },
      ],
    },
  };
  await context.sendFlex('我無法理解你想表達的內容', bubble);
}
