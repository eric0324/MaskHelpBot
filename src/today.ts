import { LineContext } from 'bottender';

export async function TodayReply(context: LineContext) {
  const d = new Date();
  const n = d.getDay();
  let reply_text = '';
  if (n == 2 || n == 4 || n == 6) {
    reply_text = '身分證末一碼是『偶數』的才可以買口罩。';
  } else if (n == 1 || n == 3 || n == 5) {
    reply_text = '身分證末一碼是『奇數』的才可以買口罩。';
  } else {
    reply_text = '今天大家都可以買口罩！';
  }
  await context.sendText(reply_text);
}
