export const config = {
  github: {
    login: "brightmann", // github login name, not user name
    repo: "urd", //"urodele",
    logInUrl: "",
    logInAuthUrl: "",
  },
  head: {
    title: "Urodele",
    brand: "Urodele",
    description: "A self-owned full-static blog system",
  },
  footer: {
    copyright: "© Glink",
    copyrightUrl: "https://github.com/glink25",
  },
  pagination: {
    size: 5,
  },
  giscus: false as object | false,
} as const;

export default config;
