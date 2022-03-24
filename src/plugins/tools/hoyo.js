import { isValidCookieStr,getCookieItem } from "#utils/cookie";
import { filterWordsByRegex } from "#utils/tools";
import db from "#utils/database";
import * as fs from 'fs'
function hoyo(msg) {
  const basename = 'ck'
  const struct = { user: []}
  db.init(basename,struct);
  const get = filterWordsByRegex(msg.text, 'ck');
  if (get !== 'unmatch'){
    switch (isValidCookieStr(get)){
      case true:
        //msg.bot.say(msg.sid,message+HW, msg.type, msg.uid);
        const token = getCookieItem(get, "cookie_token") || "";
        const id = getCookieItem(get, "account_id") || "";
        const final = 'cookie_token='+token+'; account_id='+id
        const path = '/home/lg/git/Adachi-BOT/config/cookies.yml'
        console.log(final);
        if (!db.includes(basename,"user",{ id: msg.uid })){
          db.push(basename, "user", { id: msg.uid, ck: final });
          fs.appendFile(path, '   - '+final+'\n',function (err) {

            if (err) throw err;
          
            console.log('ERR');
          
          })
          msg.bot.say(msg.sid,'get到了', msg.type, msg.uid);
        } else{
          msg.bot.say(msg.sid,'你已添加cookie(单QQ号只允许添加一个cookie)', msg.type, msg.uid);
        }
        break;
      case false:
        msg.bot.say(msg.sid,'笨蛋吧你', msg.type, msg.uid);
        break;
    }
  }
}
export { hoyo }