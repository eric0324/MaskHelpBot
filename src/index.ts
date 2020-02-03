const { ExceptionReply } = require('./exception');
const { LocationReply } = require('./location');
const { ReportReply, ReportStatusReply } = require('./report');

export default async function App(context: any) {
    if (context.event.isText) {
        return ExceptionReply;
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