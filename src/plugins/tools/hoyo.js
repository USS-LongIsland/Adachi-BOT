import { isValidCookie } from "#utils/cookie";
import { filterWordsByRegex, getWordByRegex } from "#utils/tools";
import db from "#utils/database";
function hoyo(msg) {
  var ckformat = msg.uid 
  db.init(ck);
  const HW = 'HelloWorld';
  const get = filterWordsByRegex(msg.text, 'ck');
  const message = get+"\n";
  if (get !== 'unmatch'){
    switch (isValidCookie(get)){
      case true:
        msg.bot.say(msg.sid,message+HW, msg.type, msg.uid);
        if (!db.includes(ck,msg.uid,{ cookie })){
          db.push(ck,msg.uid,{ cookie: get })
        } else{
          msg.bot.say(msg.sid,'already', msg.type, msg.uid);
        }
        break;
      case false:
        msg.bot.say(msg.sid,'笨蛋吧你', msg.type, msg.uid);
        break;
    }
  }
}
export { hoyo }