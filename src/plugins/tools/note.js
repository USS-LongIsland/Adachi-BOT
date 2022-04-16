import fetch from "node-fetch";
import db from "#utils/database";
import { getCookieByID, isValidCookieStr } from "#utils/cookie"
import { baseDetail } from "#utils/detail"
import { getDS } from "#utils/ds"
function getnote(role_id, server, cookie) {
    const query = { role_id, server };
    const m_HEADERS = {
        "User-Agent":
            "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) miHoYoBBS/2.11.1",
        Referer: "https://webstatic.mihoyo.com/",
        "x-rpc-app_version": "2.11.1",
        "x-rpc-client_type": 5,
        DS: "",
        Cookie: "",
    };

    return fetch(`https://api-takumi.mihoyo.com/game_record/app/genshin/api/dailyNote?${new URLSearchParams(query)}`, {
        method: "GET",
        headers: { ...m_HEADERS, DS: getDS(query), Cookie: cookie },
    })
        .then((res) => res.json());
}
function getRegion(first) {
    switch (first) {
        case "1": return "cn_gf01";
        case "2": return "cn_gf01";
        case "5": return "cn_qd01";
        default: return "unknown";
    }
}
function time(value) {
    var secondTime = parseInt(value);// 秒
    var minuteTime = 0;// 分
    var hourTime = 0;// 小时
    if (secondTime > 60) {//如果秒数大于60，将秒数转换成整数
        //获取分钟，除以60取整数，得到整数分钟
        minuteTime = parseInt(secondTime / 60);
        //获取秒数，秒数取佘，得到整数秒数
        secondTime = parseInt(secondTime % 60);
        //如果分钟大于60，将分钟转换成小时
        if (minuteTime > 60) {
            //获取小时，获取分钟除以60，得到整数小时
            hourTime = parseInt(minuteTime / 60);
            //获取小时后取佘的分，获取分钟除以60取佘的分
            minuteTime = parseInt(minuteTime % 60);
        }
    }
    var time = "" + parseInt(secondTime) + "秒";

    if (minuteTime > 0) {
        time = "" + parseInt(minuteTime) + "分" + time;
    }
    if (hourTime > 0) {
        time = "" + parseInt(hourTime) + "小时" + time;
    }
    return time;
}
async function note(msg) {
    if (db.includes('map', 'user', { userID: msg.uid })) {
        const base = db.get('map', 'user', { userID: msg.uid })
        const { UID } = base
        const ckobj = getCookieByID(UID);
        const server = 'cn_gf01'
        //const server = getRegion(UID+''.charAt(0))
        if (ckobj != undefined) {
            const cookiestr = ckobj.cookie;
            const { retcode, data, message } = await getnote(UID, server, cookiestr)
            console.log(UID + server + cookiestr)
            if (retcode == 0) {
                console.log(JSON.stringify(data))
                let { current_resin, max_resin, resin_recovery_time, finished_task_num, total_task_num, is_extra_task_reward_received, max_home_coin, current_home_coin, home_coin_recovery_time, remain_resin_discount_num, resin_discount_num_limit, transformer } = data
                let { obtained, recovery_time } = transformer
                let { Day, Hour, Minute, reached } = recovery_time
                resin_recovery_time = time(resin_recovery_time)
                home_coin_recovery_time = time(home_coin_recovery_time)
                switch (is_extra_task_reward_received) {
                    case true: is_extra_task_reward_received = '已领取'
                    case false: is_extra_task_reward_received = '未领取'
                }
                let trans
                let transtime
                if (reached) {
                    trans = '已经可以使用'
                } else {
                    if (Day != 0) {
                        transtime = `约${Day}天后可用`
                    } else {
                        transtime = `约${Hour}小时${Minute}分后可用`
                    }
                    trans = (obtained ? transtime : "未获取,先去璃月完成「天遒宝迹」任务吧")
                }
                let tell =
                    `[Dev]
获取当前树脂:${current_resin}/${max_resin}
树脂将在${resin_recovery_time}后回满
完成委托数量:${finished_task_num}/${total_task_num}
每日委托奖励:${is_extra_task_reward_received}
周本减半次数剩余:${remain_resin_discount_num}/${resin_discount_num_limit}
洞天宝钱:${current_home_coin}/${max_home_coin}
洞天宝钱将在${home_coin_recovery_time}后集满
参量质变仪:${trans}`
                msg.bot.say(msg.sid, tell, msg.type, msg.uid)
            } else {
                msg.bot.say(msg.sid, '米游社接口报错:' + message, msg.type, msg.uid)
                console.log(UID + server + cookiestr)
            }
        }
        else { msg.bot.say(msg.sid, `未绑定cookie或uid未更新,请使用【#ck】获取绑定cookie的操作方式,或尝试使用【#米游社】指令更新数据`, msg.type, msg.uid) }
    } else { msg.bot.say(msg.sid, `您还未绑定米游社通行证，请使用 【${global.command.functions.name.save} 您的米游社通行证ID（非UID）】来关联米游社通行证。`, msg.type, msg.uid) }
}

export { note }
