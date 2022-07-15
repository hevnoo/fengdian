// 工控机
// const forwardUrl = "http://10.0.1.149:30410";
// const wsForwardUrl = "ws://10.0.1.149:30410";

// const forwardUrl = "http://10.0.5.172:30402";
// const wsForwardUrl = "ws://10.0.5.172:30402";

const forwardUrl = "http://10.0.5.104:30561";
const wsForwardUrl = "ws://10.0.5.104:30561";

const forVideoUrl = "http://10.0.1.194:4201";
const flowableUrl = "http://10.0.5.104:30561";
const ruleNodeUiforwardUrl = forwardUrl;

/**
 * @description: 视频监控代理
 * @param {*} /ISAPI /SDK
 * @return {*}
 */
const PROXY_CONFIG = {
  "/noise": {
    target: "http://10.35.103.181",
    secure: false,
    pathRewrite: { "^/api": "" },
  },
  "/ISAPI": {
    target: forVideoUrl,
    secure: false,
  },
  "/SDK": {
    target: forVideoUrl,
    secure: false,
  },
  "/api": {
    target: forwardUrl,
    secure: false,
  },
  "/api/gv_flowable": {
    target: flowableUrl,
    secure: false,
    pathRewrite: { "^/api": "" },
  },
  "/group1": {
    target: forwardUrl,
    secure: false,
  },
  "/static/rulenode": {
    target: ruleNodeUiforwardUrl,
    secure: false,
  },
  "/static/widgets": {
    target: forwardUrl,
    secure: false,
  },
  "/oauth2": {
    target: forwardUrl,
    secure: false,
  },
  "/login/oauth2": {
    target: forwardUrl,
    secure: false,
  },
  "/api/page_pattern": {
    target: forwardUrl,
    secure: false,
    pathRewrite: { "^/api": "" },
  },
  "/openapi": {
    target: forwardUrl,
    secure: false,
  },
  "/api/ws": {
    target: wsForwardUrl,
    ws: true,
    secure: false,
  },
  "/api/gv_main": {
    target: "http://10.0.5.92:30540",
    secure: false,
    // pathRewrite: { '^/api': '' }
  },
  "/api/gv_file": {
    target: "http://10.0.5.92:30580",
    secure: false,
    // pathRewrite: { '^/api': '' }
  },
};

module.exports = PROXY_CONFIG;
