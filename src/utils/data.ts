import type { ShortPageData } from "../shared/type";
import { withBase } from "./base";

let globalData: ShortPageData[] | undefined;
export const getGlobalData = async () => {
  if (globalData) return globalData;
  // NOTE: do NOT build this URL from import.meta.env.BASE_URL by hand —
  // BASE_URL has no trailing slash ('/urd'), so `${BASE_URL}api/...`
  // becomes '/urdapi/...' (404 HTML) and .json() throws. withBase joins
  // the slash correctly.
  globalData = await (await fetch(`${location.origin}${withBase("/api/post/list")}`)).json();
  return globalData!;
};
