import * as fs from "fs";
import { createRequire } from "module";
import { readConfig } from "#utils/config";
import { getCookieItem, isValidCookieStr } from "#utils/cookie";
import db from "#utils/database";
import { filterWordsByRegex } from "#utils/tools";

const require = createRequire(import.meta.url);

function hoyo(msg) {
  const basename = "ck";
  const struct = { user: [] };
  const get = filterWordsByRegex(msg.text, "ck");

  db.init(basename, struct);
  if (get !== "") {
    let token = "";
    let id = "";
    let final = "";
    const path = "/home/lg/git/Adachi-BOT/config/cookies.yml";
    switch (isValidCookieStr(get)) {
      case true:
        token = getCookieItem(get, "cookie_token") || "";
        id = getCookieItem(get, "account_id") || "";
        final = "cookie_token=" + token + "; account_id=" + id;
        console.log(final);

        if (!db.includes(basename, "user", { id: msg.uid })) {
          db.push(basename, "user", { id: msg.uid, ck: final, mhyid: id });
          fs.appendFile(path, "   - " + final + "\n", function (err) {
            if (err) throw err;
            console.log("OK");
          });

          var myJSON = require("/home/lg/genshin/config.json");
          myJSON.COOKIE_MIHOYOBBS = myJSON.COOKIE_MIHOYOBBS + "#" + final;

          fs.writeFileSync("/home/lg/genshin/config.json", JSON.stringify(myJSON, "", "\t"));

          msg.bot.say(msg.sid, "get到了", msg.type, msg.uid);
          readConfig();
        } else {
          msg.bot.say(msg.sid, "你已添加cookie(单QQ号只允许添加一个cookie)", msg.type, msg.uid);
        }
        break;
      case false:
        msg.bot.say(msg.sid, "笨蛋吧你", msg.type, msg.uid);
        break;
    }
  } else {
    msg.bot.say(
      msg.sid,
      '米游社自动签到功能指引:私聊 私聊 私聊(不私聊号没了不关我事)输入 #ck空格你的cookie来添加,请像保护密码一样保护你的cookie\n获取教程:https://www.bilibili.com/video/BV1d3411p7e3/\n添加则视为同意加入机器人查询功能(诸如"米游社","深渊")所需的公共cookie池,扫码登陆米游社或更改米哈游通行证密码会使当前cookie直接失效',
      msg.type,
      msg.uid
    );
  }
}
export { hoyo };
