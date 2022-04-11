import fetch from "node-fetch";
import db from "#utils/database";
import { getCookieByID } from "#utils/cookie"
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
async function note (msg) {
    const { mhyid } = db.get('ck', 'user', { id: msg.uid }) || {}
    const role_id = await baseDetail(mhyid, msg.uid, msg.bot)[0];
    const cookie = getCookieByID(role_id);
    if (cookie != undefined) {
        const server = getRegion(role_id[0]);
        const data = await getnote(role_id, server, cookie)
        console.log(data)
        msg.bot.say(msg.sid, '[Dev]获取当前树脂:' + data.data.current_resin, msg.type, msg.uid)
    }

}

export { note }
