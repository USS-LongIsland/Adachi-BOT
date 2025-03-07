import { doSave } from "#plugins/save/save";
import { checkAuth } from "#utils/auth";
import { hasEntrance } from "#utils/config";

("use strict");

async function Plugin(msg) {
  switch (true) {
    case hasEntrance(msg.text, "save", "save"):
      if (checkAuth(msg, "save")) {
        doSave(msg);
      }
      break;
  }
}

export { Plugin as run };
