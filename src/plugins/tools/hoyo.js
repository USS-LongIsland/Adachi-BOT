import { isValidCookieStr,getCookieItem } from "#utils/cookie";
import { filterWordsByRegex } from "#utils/tools";
import db from "#utils/database";
function hoyo(msg) {
  const basename = 'ck'
  const struct = { user: []}
  db.init(basename,struct);
  const HW = 'HelloWorld';
  const get = filterWordsByRegex(msg.text, 'ck');
  const message = get+"\n";
  if (get !== 'unmatch'){
    switch (isValidCookieStr(get)){
      case true:
        //msg.bot.say(msg.sid,message+HW, msg.type, msg.uid);
        const token = getCookieItem(get, "cookie_token") || "";
        const id = getCookieItem(get, "account_id") || "";
        
        if (!db.includes(basename,"user",{ id: msg.uid })){
          db.push(basename, "user", { id: msg.uid, ck: token+id+"#" });
          msg.bot.say(msg.sid,'get到了', msg.type, msg.uid);
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