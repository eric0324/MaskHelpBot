import axios from 'axios';

async function ReportReply(context: any) {
    let data = context.event.postback.data.split("&");
    let id   = data[1].split("=")[1];
    const quickReply = {
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
              data: 'report_status&status=SHORTAGE&id=' + id
            },
          }
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

async function sendData(status: string ,id: any){
    let url: string = (process.env.MASK_API_PATH + "/api/supply/" + id) || ""
    var readyData = {
        "maskStatus": status
    };

    return await axios.patch(url, readyData)
}

async function ReportStatusReply(context: any) {
    let data = context.event.postback.data.split("&");
    let status   = data[1].split("=")[1];
    let id   = data[2].split("=")[1];
    var resp = await sendData(status, id);
    await context.send([
        {
          type: 'text',
          text: '感謝您的回報！口罩夠用就好！請不要囤貨喔！',
        },
    ]);
}

module.exports = {
    ReportReply,
    ReportStatusReply
};