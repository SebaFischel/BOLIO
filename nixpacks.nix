{
  setup = [
    "nodejs-16_x",
    "npm-9_x"
  ];

  install = "npm ci";

  build = "npm start";

  start = "npm run dev";
}