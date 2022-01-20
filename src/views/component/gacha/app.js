const containerTemplate = `
<div class="gacha-title">@{{userName}} 在 {{userDrawTime}} 抽取了 {{wishType}} 卡池 {{drawCount}} 次</div>
<div class="container-gacha-box">
  <gachaBox v-for="pull in gachaDataToShow" :data="pull" :fives="fives" :isStat="isStatisticalData" />
</div>
`;

// eslint-disable-next-line no-undef
const { defineComponent } = Vue;

import gachaBox from "./gacha-box.js";
import { getParams } from "../common/param.js";

export default defineComponent({
  name: "GenshinGachaInfinity",
  template: containerTemplate,
  components: {
    gachaBox,
  },
  setup() {
    const params = getParams(window.location.href);

    function get_time() {
      const date = new Date();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      let hour = date.getHours();
      let minute = date.getMinutes();
      let second = date.getSeconds();

      if (hour < 10) hour = "0" + hour;
      if (minute < 10) minute = "0" + minute;
      if (second < 10) second = "0" + second;

      return `${month}月${day}日${hour}:${minute}:${second}`;
    }

    function get_wish_type(type) {
      switch (type) {
        case "indefinite":
          return "常驻祈愿";
        case "character":
          return "角色祈愿";
        case "character2":
          return "角色祈愿2";
        case "weapon":
          return "武器祈愿";
        case "eggs":
          return "彩蛋";
      }
    }

    const userName = params.user;
    const userDrawTime = get_time();
    const wishType = get_wish_type(params.type);
    const drawCount = params.data.length;

    function quickSortByRarity(m, n) {
      const mv = "角色" === m.item_type;
      const nv = "角色" === n.item_type;

      return m.star === n.star ? nv - mv : n.star - m.star;
    }

    const isStatisticalData = params.data.length > 10;

    const gachaDataToShow =
      params.data.length > 10
        ? params.count.sort((x, y) => quickSortByRarity(x, y))
        : params.data.sort((x, y) => quickSortByRarity(x, y));

    return {
      userName,
      userDrawTime,
      wishType,
      drawCount,
      fives: params.five,
      gachaDataToShow,
      isStatisticalData,
    };
  },
});
