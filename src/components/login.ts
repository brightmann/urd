import { config } from "urodele.config";
import { login } from "./Auth/auth";
import { withBase } from "@/utils/base";

export const mount = async () => {
  const url = new URL(location.href);
  const params = Object.fromEntries(Array.from(url.searchParams.entries()));
  // This page is ONLY the GitHub OAuth callback: it exchanges the ?code=
  // GitHub redirected back with for a token via logInAuthUrl. With direct
  // token login (logInAuthUrl is "") there is no exchange to run — and
  // fetch("") fetches this page itself as HTML, so response.json() throws
  // "unexpected character at line 1 column 1". Skip straight home; the
  // token login lives in the header button (Auth component) instead.
  const hasOAuthCallback = Boolean(config.github.logInAuthUrl) && Boolean(params.code);
  if (!hasOAuthCallback) {
    location.replace(withBase("/"));
    return;
  }
  try {
    const response = await fetch(config.github.logInAuthUrl, {
      method: "POST",
      mode: "cors",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(params),
    });
    const result = await response.json();
    if (result.error) {
      return alert(JSON.stringify(result, null, 2));
    }
    await login(result.token);
  } catch (error: any) {
    alert(error.message);
    console.error(error);
  } finally {
    location.replace(withBase("/"));
  }
};
