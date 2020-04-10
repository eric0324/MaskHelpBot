import axios from 'axios';
import { LineContext, LineTypes } from 'bottender';

export async function ReportReply(context: LineContext): Promise<void> {
  const data = context.event.postback.data.split('&');
  const id = data[1].split('=')[1];
  const quickReply: LineTypes.QuickReply = {
    items: [
      {
        type: 'action',
        action: {
          type: 'postback',
          label: '充足',
          data: 'report_status&status=AVAILABLE&id=' + id,
        },
      },
      {
        type: 'action',
        action: {
          type: 'postback',
          label: '短缺',
          data: 'report_status&status=SHORTAGE&id=' + id,
        },
      },
    ],
  };
  await context.send([
    {
      type: 'text',
      text: '請問該店的口罩使用狀態？',
      quickReply,
    },
  ]);
}

async function sendData(status: string, id: any) {
  const url = process.env.MASK_API_PATH + '/api/supply/' + id;
  const readyData = {
    maskStatus: status,
  };

  return await axios.patch(url, readyData);
}

export async function ReportStatusReply(context: LineContext): Promise<void> {
  const data = context.event.postback.data.split('&');
  const status = data[1].split('=')[1];
  const id = data[2].split('=')[1];
  await sendData(status, id);
  await context.send([
    {
      type: 'text',
      text: '感謝您的回報！口罩夠用就好！請不要囤貨喔！',
    },
  ]);
}
