module.exports = {
  // lintOnSave: false,
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "高仙机器人任务管理平台";
      return args;
    });
  },
};
