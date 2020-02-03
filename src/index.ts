const { ExceptionReply } = require('./exception');
const { LocationReply } = require('./location');
const { ReportReply, ReportStatusReply } = require('./report');

export default async function App(context: any) {
    if (context.event.isText) {
        return ExceptionReply;
    } else if (context.event.isFollow) {
        await context.send([
            {
              type: 'text',
              text: '大家好，我是口罩君，感謝你加我好友！買口罩時候請注意！',
            },
            {
              type: 'image',
              originalContentUrl: 'https://i.imgur.com/FIeUpnN.png',
              previewImageUrl: 'https://i.imgur.com/FIeUpnN.png'
            },
        ]);
    } else if (context.event.isLocation) {
        return LocationReply;
    } else if (context.event.isPayload) {
        const data = context.event.postback.data;
        let query = data.split("&")
        if (query[0] == "report"){
            return ReportReply
        } else if (query[0] == "report_status"){
            return ReportStatusReply
        }
    }
};