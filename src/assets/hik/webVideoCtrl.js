! function() {
	if (!window.WebVideoCtrl) {
		var e = function() {
				function e(e, t, n) {
					return (e << 16 | t << 8 | n).toString(16)
				}

				function n(e, t) {
					return (Array(t).join("0") + e).slice(-t)
				}

				function r(e) {
					var t = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
					if (e && t.test(e)) {
						if (4 === e.length) {
							for (var n = "#", r = 1; 4 > r; r += 1) n += e.slice(r, r + 1).concat(e.slice(r, r + 1));
							e = n
						}
						for (var s = [], r = 1; 7 > r; r += 2) s.push(parseInt("0x" + e.slice(r, r + 2)));
						return "[" + s.join(",") + ",0.6]"
					}
					return e
				}

				function s() {
					return void 0 !== s.unique ? s.unique : (this.szIP = "", this.szHostName = "", this.szAuth = "", this.szHttpProtocol = "http://", this.iCGIPort = 80, this.szDeviceIdentify = "", this.iDevicePort = -1, this.iHttpPort = -1, this.iHttpsPort = -1, this.iRtspPort = -1, this.iWSPort = -1, this.iAudioType = 1, this.m_iAudioBitRate = -1, this.m_iAudioSamplingRate = -1, this.iDeviceProtocol = x, this.oProtocolInc = null, this.iAnalogChannelNum = 0, this.szDeviceType = "", this.bVoiceTalk = !1, this.oAuthType = {}, this.oStreamCapa = {
						bObtained: !1,
						bSupportShttpPlay: !1,
						bSupportShttpPlayback: !1,
						bSupportShttpsPlay: !1,
						bSupportShttpsPlayback: !1,
						bSupportShttpPlaybackTransCode: !1,
						bSupportShttpsPlaybackTransCode: !1,
						iIpChanBase: 1
					}, s.unique = this, void 0)
				}

				function o() {
					this.id = this.createUUID()
				}
				var a = "100%",
					u = "100%",
					c = "",
					l = "";
				oSecurityCap = {}, szAESKey = "";
				var d = {
						szversion: "websdk3.220200429",
						szContainerID: "",
						szColorProperty: "",
						szOcxClassId: "clsid:FDF0038A-CF64-4634-81AB-80F0A7946D6C",
						szMimeTypes: "application/webvideo-plugin-kit",
						szBasePath: "",
						iWndowType: 1,
						iPlayMode: 2,
						bWndFull: !0,
						iPackageType: 2,
						bDebugMode: !1,
						bNoPlugin: !0,
						cbSelWnd: null,
						cbDoubleClickWnd: null,
						cbEvent: null,
						cbRemoteConfig: null,
						cbInitPluginComplete: null,
						proxyAddress: null
					},
					p = null,
					f = 0,
					h = !1,
					P = [],
					I = [],
					m = null,
					v = null,
					C = null,
					S = null,
					y = this,
					g = null;
				this.w_options = d, this.w_deviceSet = P, this.w_wndSet = I, this.w_xmlLocalCfg = g;
				var x = 1,
					D = 2,
					z = 200,
					b = 0,
					T = 1,
					A = 2,
					M = 3,
					L = 4,
					q = 5,
					R = 6,
					w = 0,
					G = 2,
					W = 3,
					X = 21,
					_ = -1,
					H = 0,
					k = "IPCamera",
					E = "IPDome",
					Z = "IPZoom",
					B = "<?xml version='1.0' encoding='utf-8'?><FileVersion><Platform name='win32'><npWebVideoKitPlugin.dll>3,0,6,2</npWebVideoKitPlugin.dll><WebVideoKitActiveX.ocx>3,0,6,2</WebVideoKitActiveX.ocx><PlayCtrl.dll>7,3,3,61</PlayCtrl.dll><StreamTransClient.dll>1,1,3,6</StreamTransClient.dll><SystemTransform.dll>2,5,2,8</SystemTransform.dll><NetStream.dll>1,0,5,59</NetStream.dll></Platform></FileVersion>";
				window.GetSelectWndInfo = function(e) {
					if (ct()) {
						f = e;
						var n = [];
						n.push("<RealPlayInfo>"), n.push("<SelectWnd>" + e + "</SelectWnd>"), n.push("</RealPlayInfo>"), d.cbSelWnd && d.cbSelWnd(S.loadXML(n.join("")))
					} else {
						var r = S.loadXML(e);
						if (t.$XML(r).find("SelectWnd", !0).length > 0) {
							f = parseInt(t.$XML(r).find("SelectWnd").eq(0).text(), 10), null === g && Y();
							var n = [];
							n.push("<RealPlayInfo>"), n.push("<SelectWnd>" + f + "</SelectWnd>"), n.push("</RealPlayInfo>"), d.cbSelWnd && d.cbSelWnd(S.loadXML(n.join("")))
						} else if (t.$XML(r).find("DoubleClickWnd", !0).length > 0) {
							var s = parseInt(t.$XML(r).find("DoubleClickWnd").eq(0).text(), 10);
							h = "0" === t.$XML(r).find("IsFullScreen").eq(0).text(), d.cbDoubleClickWnd && d.cbDoubleClickWnd(s, h)
						}
					}
				}, window.WindowDblClick = function(e) {
					h = e, d.cbDoubleClickWnd && d.cbDoubleClickWnd(f, h)
				}, window.ZoomInfoCallback = function(e) {
					var t = y.findWndIndexByIndex(f);
					if (-1 != t) {
						var n = I[t];
						if (t = y.findDeviceIndexByIP(n.szDeviceIdentify), -1 != t) {
							var r = P[t];
							r.oProtocolInc.set3DZoom(r, n, e, {
								success: function() {},
								error: function() {}
							})
						}
					}
				}, window.PluginEventHandler = function(e, t, n) {
					ct() ? d.cbEvent && d.cbEvent(e, t, n) : (w == t || G == t ? y.I_Stop(e) : X == t ? y.I_StopRecord(e) : W == t && y.I_StopVoiceTalk(), d.cbEvent && d.cbEvent(t, e, n))
				}, window.GetHttpInfo = function(e, t) {
					Pt.prototype.processCallback(e, t)
				}, window.RemoteConfigInfo = function(e) {
					d.cbRemoteConfig && d.cbRemoteConfig(e)
				}, window.KeyBoardEventInfo = function(e) {
					100 === parseInt(e, 10) && (h = !1, d.cbDoubleClickWnd && d.cbDoubleClickWnd(f, h))
				};
				var N = function() {
						if (d.bDebugMode) {
							var e = F(arguments);
							m._alert(e)
						}
					},
					F = function() {
						for (var e = arguments[0], t = 1; t < arguments.length; t++) e = e.replace("%s", arguments[t]);
						return e
					},
					V = function(e) {
						var t = e.indexOf(":");
						return t > -1 ? e.substring(0, t) : e
					},
					U = function(e) {
						return "undefined" == typeof e
					},
					j = function(e) {
						return "[object Object]" === Object.prototype.toString.call(e)
					},
					O = function(e, t) {
						var n = "",
							r = {
								type: "GET",
								async: !1,
								success: function(e) {
									e && e.Token && (n = e.Token.value)
								}
							},
							s = "ISAPI/Security/token?format=json";
						return y.I_SendHTTPRequest(t, s, r), n
					},
					J = function(e, n, r) {
						y.I_GetSecurityVersion(e, {
							success: function(e) {
								oSecurityCap.iKeyIterateNum = parseInt(t.$XML(e).find("keyIterateNum").eq(0).text(), 10), oSecurityCap.oIrreversibleEncrypt = {
									bSupport: "true" === t.$XML(e).find("isIrreversible").eq(0).text(),
									salt: t.$XML(e).find("salt").eq(0).text()
								}, szAESKey = S.strToAESKey(n, r)
							}
						})
					},
					K = function() {
						var e = "";
						if (S.browser().msie) e = "<object classid='" + d.szOcxClassId + "' codebase='' standby='Waiting...' " + "id='" + c + "' width='" + a + "' height='" + u + "' align='center' >" + "<param name='wndtype' value='" + d.iWndowType + "'>" + "<param name='playmode' value='" + d.iPlayMode + "'>" + "<param name='colors' value='" + d.szColorProperty + "'></object>";
						else
							for (var t = navigator.mimeTypes.length, n = 0; t > n; n++) navigator.mimeTypes[n].type.toLowerCase() == d.szMimeTypes && (e = "<embed align='center' type='" + d.szMimeTypes + "' width='" + a + "' height='" + u + "' name='" + l + "' wndtype='" + d.iWndowType + "' playmode='" + d.iPlayMode + "' colors='" + d.szColorProperty + "'>");
						return e
					},
					Y = function() {
						if (!ct() && null !== p) {
							var e = p.HWP_GetLocalConfig();
							g = S.loadXML(e)
						}
					},
					Q = function(e) {
						y.I_GetDeviceInfo(e.szIP, {
							success: function(n) {
								e.szDeviceType = t.$XML(n).find("deviceType").eq(0).text()
							}
						}), y.I_GetAnalogChannelInfo(e.szIP, {
							success: function() {},
							error: function() {}
						}), y.I_GetAudioInfo(e.szIP, {
							success: function(n) {
								var r = t.$XML(n).find("audioCompressionType", !0);
								if (r.length > 0) {
									var s = t.$XML(r).eq(0).text(),
										o = 0;
									"G.711ulaw" == s ? o = 1 : "G.711alaw" == s ? o = 2 : "G.726" == s ? o = 3 : "MP2L2" == s || "MPEL2" == s ? o = 4 : "G.722.1" == s ? o = 0 : "AAC" == s ? o = 5 : "PCM" == s && (o = 6), e.iAudioType = o
								}
								e.m_iAudioBitRate = "" !== t.$XML(n).find("audioBitRate").eq(0).text() ? 1e3 * parseInt(t.$XML(n).find("audioBitRate").eq(0).text(), 10) : 0, e.m_iAudioSamplingRate = "" !== t.$XML(n).find("audioSamplingRate").eq(0).text() ? 1e3 * parseInt(t.$XML(n).find("audioSamplingRate").eq(0).text(), 10) : 0
							}
						})
					},
					et = function(e) {
						e.bSupportWebsocket = !1, e.bSupportSubStreamPlayback = !1, e.oProtocolInc.getSystemCapa(e, {
							success: function(n) {
								var r = t.$XML(n).find("NetworkCap").eq(0).find("isSupportWebsocket", !0);
								r.length > 0 && (e.bSupportWebsocket = "true" === t.$XML(n).find("NetworkCap").eq(0).find("isSupportWebsocket").eq(0).text()), e.bSupportWebsocket = !0, r = t.$XML(n).find("RacmCap").eq(0).find("isSupportMainAndSubRecord", !0), r.length > 0 && (e.bSupportSubStreamPlayback = "true" === t.$XML(n).find("RacmCap").eq(0).find("isSupportMainAndSubRecord").eq(0).text()), e.bSupportSubStreamPlayback = !0
							}
						})
					},
					tt = function() {
						var e = d.bWndFull ? 1 : 0;
						p.HWP_SetCanFullScreen(e), p.HWP_SetPackageType(d.iPackageType)
					},
					nt = function(e) {
						var t = -1,
							n = -1,
							r = -1,
							s = null;
						if (it(e)) s = rt(e), t = s.iRtspPort, r = s.iDevicePort;
						else {
							for (var o = ot(e), i = !1, a = 0; a < o.length; a++)
								if (o[a].ipv4 == e.szIP || o[a].ipv6 == e.szIP) {
									i = !0;
									break
								}
							i ? s = rt(e) : (s = st(e), -1 == s.iRtspPort && -1 == s.iDevicePort && (s = rt(e))), t = s.iRtspPort, n = s.iHttpPort, r = s.iDevicePort
						}
						return s
					},
					rt = function(e) {
						var n = -1,
							r = -1,
							s = -1;
						return e.oProtocolInc.getPortInfo(e, {
							async: !1,
							success: function(e) {
								var o = t.$XML(e).find("AdminAccessProtocol", !0);
								n = 554;
								for (var i = 0, a = o.length; a > i; i++) "rtsp" === t.$XML(o).eq(i).find("protocol").eq(0).text().toLowerCase() && (n = parseInt(t.$XML(o).eq(i).find("portNo").eq(0).text(), 10)), "http" === t.$XML(o).eq(i).find("protocol").eq(0).text().toLowerCase() && (r = parseInt(t.$XML(o).eq(i).find("portNo").eq(0).text(), 10)), "dev_manage" === t.$XML(o).eq(i).find("protocol").eq(0).text().toLowerCase() && (s = parseInt(t.$XML(o).eq(i).find("portNo").eq(0).text(), 10))
							},
							error: function() {
								n = -1, r = -1, s = -1
							}
						}), {
							iRtspPort: n,
							iHttpPort: r,
							iDevicePort: s
						}
					},
					st = function(e) {
						var n = -1,
							r = -1,
							s = -1;
						return e.oProtocolInc.getUPnPPortStatus(e, {
							async: !1,
							success: function(e) {
								for (var o = t.$XML(e).find("portStatus", !0), i = 0, a = o.length; a > i; i++) "rtsp" == t.$XML(o).eq(i).find("internalPort").eq(0).text().toLowerCase() && (n = parseInt(t.$XML(o).eq(i).find("externalPort").eq(0).text(), 10)), "http" == t.$XML(o).eq(i).find("internalPort").eq(0).text().toLowerCase() && (r = parseInt(t.$XML(o).eq(i).find("externalPort").eq(0).text(), 10)), "admin" == t.$XML(o).eq(i).find("internalPort").eq(0).text().toLowerCase() && (s = parseInt(t.$XML(o).eq(i).find("externalPort").eq(0).text(), 10))
							},
							error: function() {
								n = -1, r = -1, s = -1
							}
						}), {
							iRtspPort: n,
							iHttpPort: r,
							iDevicePort: s
						}
					},
					ot = function(e) {
						var n = [];
						return e.oProtocolInc.getNetworkBond(e, {
							async: !1,
							success: function(r) {
								"true" == t.$XML(r).find("enabled").eq(0).text() ? n.push({
									ipv4: t.$XML(r).find("ipAddress").eq(0).text(),
									ipv6: t.$XML(r).find("ipv6Address").eq(0).text()
								}) : e.oProtocolInc.getNetworkInterface(e, {
									async: !1,
									success: function(e) {
										for (var r = t.$XML(e).find("NetworkInterface", !0), s = 0, o = r.length; o > s; s++) {
											n.push({
												ipv4: t.$XML(e).find("ipAddress").eq(0).text(),
												ipv6: t.$XML(e).find("ipv6Address").eq(0).text()
											});
											break
										}
									},
									error: function() {}
								})
							},
							error: function() {
								e.oProtocolInc.getNetworkInterface(e, {
									async: !1,
									success: function(e) {
										for (var r = t.$XML(e).find("NetworkInterface", !0), s = 0, o = r.length; o > s; s++) {
											n.push({
												ipv4: t.$XML(e).find("ipAddress").eq(0).text(),
												ipv6: t.$XML(e).find("ipv6Address").eq(0).text()
											});
											break
										}
									},
									error: function() {}
								})
							}
						}), n
					},
					it = function(e) {
						var n = !1;
						return e.oProtocolInc.getPPPoEStatus(e, {
							async: !1,
							success: function(e) {
								n = t.$XML(e).find("ipAddress", !0).length > 0 ? !0 : t.$XML(e).find("ipv6Address", !0).length > 0 ? !0 : !1
							},
							error: function() {
								n = !1
							}
						}), n
					},
					at = function(e) {
						e.oProtocolInc instanceof It && e.oProtocolInc.getSDKCapa(e, {
							async: !1,
							success: function(n) {
								e.oStreamCapa.bObtained = !0, e.oStreamCapa.bSupportShttpPlay = "true" === t.$XML(n).find("isSupportHttpPlay").eq(0).text(), e.oStreamCapa.bSupportShttpPlayback = "true" === t.$XML(n).find("isSupportHttpPlayback").eq(0).text(), e.oStreamCapa.bSupportShttpsPlay = "true" === t.$XML(n).find("isSupportHttpsPlay").eq(0).text(), e.oStreamCapa.bSupportShttpsPlayback = "true" === t.$XML(n).find("isSupportHttpsPlayback").eq(0).text(), e.oStreamCapa.bSupportShttpPlaybackTransCode = "true" === t.$XML(n).find("isSupportHttpTransCodePlayback").eq(0).text(), e.oStreamCapa.bSupportShttpsPlaybackTransCode = "true" === t.$XML(n).find("isSupportHttpsTransCodePlayback").eq(0).text(), e.oStreamCapa.iIpChanBase = t.$XML(n).find("ipChanBase", !0).length > 0 ? parseInt(t.$XML(n).find("ipChanBase").eq(0).text(), 10) : 1
							},
							error: function() {
								e.oStreamCapa.bObtained = !0
							}
						})
					},
					ut = function(e) {
						var t = {
							TransFrameRate: "",
							TransResolution: "",
							TransBitrate: ""
						};
						if (S.extend(t, e), "" == t.TransFrameRate || "" == t.TransResolution || "" == t.TransBitrate) return "";
						var n = [];
						return n.push("<?xml version='1.0' encoding='UTF-8'?>"), n.push("<CompressionInfo>"), n.push("<TransFrameRate>" + t.TransFrameRate + "</TransFrameRate>"), n.push("<TransResolution>" + t.TransResolution + "</TransResolution>"), n.push("<TransBitrate>" + t.TransBitrate + "</TransBitrate>"), n.push("</CompressionInfo>"), n.join("")
					},
					ct = function() {
						if (d.bNoPlugin) {
							var e = S.browser();
							return e.chrome && parseInt(e.version, 10) > 45 || e.mozilla && parseInt(e.version, 10) > 52 ? !0 : !1
						}
						return !1
					},
					lt = function(e) {
						var t = location.hostname,
							n = location.port || "80";
						return d.proxyAddress && (t = d.proxyAddress.ip, n = d.proxyAddress.port), /^(http|https):\/\/([^\/]+)(.+)$/.test(e) && (e = e.replace(RegExp.$2, t + ":" + n)), S.cookie("webVideoCtrlProxy", RegExp.$2, {
							raw: !0
						}), e
					},
					dt = function(e) {
						var t = location.hostname,
							n = location.port || "80";
						return /^(ws):\/\/([^\/:]+):(\d+)\/(.+)$/.test(e) && (e = e.replace(RegExp.$2 + ":" + RegExp.$3, t + ":" + n)), e.indexOf("ws") > -1 ? S.cookie("webVideoCtrlProxyWs", RegExp.$2 + ":" + RegExp.$3, {
							raw: !0
						}) : S.cookie("webVideoCtrlProxyWss", RegExp.$2 + ":" + RegExp.$3, {
							raw: !0
						}), S.cookie("webVideoCtrlProxyWsChannel", RegExp.$4, {
							raw: !0
						}), e + "/webSocketVideoCtrlProxy"
					},
					pt = function() {
						var e = "<ResponseStatus>";
						return e += "<requestURL></requestURL>", e += "<statusCode>4</statusCode>", e += "<statusString>Invalid Operation</statusString>", e += "<subStatusCode>notSupport</subStatusCode>", e += "</ResponseStatus>", S.loadXML(e)
					};
				this.I_SupportNoPlugin = function() {
					return ct()
				}, this.I_DestroyWorker = function() {
					null !== p && ct() && p.JS_DestroyWorker()
				}, this.I_Resize = function(e, t) {
					null !== p && ct() && (a = e, u = t, p.JS_Resize(e, t))
				}, this.I_InitPlugin = function(e, t, n) {
					if (a = e, u = t, S.extend(d, n), ct()) {
						var r = S.getDirName();
						r && ("object" == typeof exports && "undefined" != typeof module || ("function" == typeof define && define.amd ? require([r + "/jsPlugin-1.2.0.min.js"], function(e) {
							window.JSPlugin = e.JSPlugin, n.cbInitPluginComplete && n.cbInitPluginComplete()
						}) : S.loadScript(r + "/jsPlugin-1.2.0.min.js", function() {
							n.cbInitPluginComplete && n.cbInitPluginComplete()
						}))), window.addEventListener("resize", function() {
							null !== p && ct() && p.JS_Resize($("#divPlugin").width(), $("#divPlugin").height())
						}), U(document.fullScreen) ? U(document.webkitIsFullScreen) ? U(document.mozFullScreen) || document.addEventListener("mozfullscreenchange", function() {
							var e = document.fullscreen || document.webkitIsFullScreen || document.mozFullScreen || !1;
							h && !e && window.KeyBoardEventInfo(100)
						}) : document.addEventListener("webkitfullscreenchange", function() {
							var e = document.fullscreen || document.webkitIsFullScreen || document.mozFullScreen || !1;
							h && !e && window.KeyBoardEventInfo(100)
						}) : document.addEventListener("fullscreenchange", function() {
							var e = document.fullscreen || document.webkitIsFullScreen || document.mozFullScreen || !1;
							h && !e && window.KeyBoardEventInfo(100)
						}), window.addEventListener("unload", function() {
							null !== p && p.JS_DestroyWorker()
						})
					} else n.cbInitPluginComplete && n.cbInitPluginComplete()
				}, this.I_InsertOBJECTPlugin = function(e) {
					if (U(e) || (d.szContainerID = e), null == document.getElementById(d.szContainerID)) return -1;
					if (null != document.getElementById(c) || 0 != document.getElementsByName(c).length) return -1;
					if (ct()) {
						var t = {
								szId: e,
								iType: 1,
								iWidth: a,
								iHeight: u,
								iMaxSplit: 4,
								iCurrentSplit: d.iWndowType,
								szBasePath: S.getDirName()
							},
							n = d.szColorProperty;
						if ("" != n) {
							for (var r = {}, s = n.split(";"), o = "", i = 0, f = s.length; f > i; i++) o = s[i], o.indexOf("sub-background") > -1 ? r.background = "#" + o.split(":")[1] : o.indexOf("sub-border-select") > -1 ? r.borderSelect = "#" + o.split(":")[1] : o.indexOf("sub-border") > -1 && (r.border = "#" + o.split(":")[1]);
							t.oStyle = r
						}
						p = new JSPlugin(t)
					} else document.getElementById(d.szContainerID).innerHTML = K(), p = S.browser().msie ? document.getElementById(c) : document.getElementsByName(l)[0];
					return null == p && null == p.object ? -1 : ("object" == typeof window.attachEvent && S.browser().msie && (p.attachEvent("GetSelectWndInfo", GetSelectWndInfo), p.attachEvent("ZoomInfoCallback", ZoomInfoCallback), p.attachEvent("GetHttpInfo", GetHttpInfo), p.attachEvent("PluginEventHandler", PluginEventHandler), p.attachEvent("RemoteConfigInfo", RemoteConfigInfo), p.attachEvent("KeyBoardEventInfo", KeyBoardEventInfo)), Y(), 0)
				}, this.I_WriteOBJECT_XHTML = function() {
					return ct() ? -1 : (document.writeln(K()), p = S.browser().msie ? document.getElementById(c) : document.getElementsByName(l)[0], null == p && null == p.object ? -1 : ("object" == typeof window.attachEvent && S.browser().msie && (p.attachEvent("GetSelectWndInfo", GetSelectWndInfo), p.attachEvent("ZoomInfoCallback", ZoomInfoCallback), p.attachEvent("GetHttpInfo", GetHttpInfo), p.attachEvent("PluginEventHandler", PluginEventHandler), p.attachEvent("RemoteConfigInfo", RemoteConfigInfo), p.attachEvent("KeyBoardEventInfo", KeyBoardEventInfo)), Y(), 0))
				}, this.I_OpenFileDlg = function(e) {
					var t = "";
					if (ct()) return t;
					if (t = p.HWP_OpenFileBrowser(e, ""), null == t) return "";
					if (1 == e) {
						if (t.length > 100) return -1
					} else if (t.length > 130) return -1;
					return t
				}, this.I2_OpenFileDlg = function(e) {
					var t = "",
						n = $.Deferred();
					return ct() ? p.JS_OpenFileBrowser(e, "").then(function(t) {
						null != t ? 1 == e ? t.length > 100 && n.resolve(-1) : t.length > 130 && n.resolve(-1) : n.resolve(), n.resolve(t)
					}) : (t = p.HWP_OpenFileBrowser(e, ""), null != t ? 1 == e ? t.length > 100 && n.resolve(-1) : t.length > 130 && n.resolve(-1) : n.resolve(), n.resolve(t)), n
				}, this.I_GetLocalCfg = function() {
					var e = null;
					if (ct()) return e;
					var n = p.HWP_GetLocalConfig(),
						r = [];
					return g = S.loadXML(n), r.push("<LocalConfigInfo>"), r.push("<ProtocolType>" + t.$XML(g).find("ProtocolType").eq(0).text() + "</ProtocolType>"), r.push("<PackgeSize>" + t.$XML(g).find("PackgeSize").eq(0).text() + "</PackgeSize>"), r.push("<PlayWndType>" + t.$XML(g).find("PlayWndType").eq(0).text() + "</PlayWndType>"), r.push("<BuffNumberType>" + t.$XML(g).find("BuffNumberType").eq(0).text() + "</BuffNumberType>"), r.push("<RecordPath>" + t.$XML(g).find("RecordPath").eq(0).text() + "</RecordPath>"), r.push("<CapturePath>" + t.$XML(g).find("CapturePath").eq(0).text() + "</CapturePath>"), r.push("<PlaybackFilePath>" + t.$XML(g).find("PlaybackFilePath").eq(0).text() + "</PlaybackFilePath>"), r.push("<PlaybackPicPath>" + t.$XML(g).find("PlaybackPicPath").eq(0).text() + "</PlaybackPicPath>"), r.push("<DeviceCapturePath>" + t.$XML(g).find("DeviceCapturePath").eq(0).text() + "</DeviceCapturePath>"), r.push("<DownloadPath>" + t.$XML(g).find("DownloadPath").eq(0).text() + "</DownloadPath>"), r.push("<IVSMode>" + t.$XML(g).find("IVSMode").eq(0).text() + "</IVSMode>"), r.push("<CaptureFileFormat>" + t.$XML(g).find("CaptureFileFormat").eq(0).text() + "</CaptureFileFormat>"), r.push("</LocalConfigInfo>"), e = S.loadXML(r.join(""))
				}, this.I_SetLocalCfg = function(e) {
					if (ct()) return -1;
					var n = S.loadXML(e),
						r = !1;
					return t.$XML(g).find("ProtocolType").eq(0).text(t.$XML(n).find("ProtocolType").eq(0).text()), t.$XML(g).find("PackgeSize").eq(0).text(t.$XML(n).find("PackgeSize").eq(0).text()), t.$XML(g).find("PlayWndType").eq(0).text(t.$XML(n).find("PlayWndType").eq(0).text()), t.$XML(g).find("BuffNumberType").eq(0).text(t.$XML(n).find("BuffNumberType").eq(0).text()), t.$XML(g).find("RecordPath").eq(0).text(t.$XML(n).find("RecordPath").eq(0).text()), t.$XML(g).find("CapturePath").eq(0).text(t.$XML(n).find("CapturePath").eq(0).text()), t.$XML(g).find("PlaybackFilePath").eq(0).text(t.$XML(n).find("PlaybackFilePath").eq(0).text()), t.$XML(g).find("DeviceCapturePath").eq(0).text(t.$XML(n).find("DeviceCapturePath").eq(0).text()), t.$XML(g).find("PlaybackPicPath").eq(0).text(t.$XML(n).find("PlaybackPicPath").eq(0).text()), t.$XML(g).find("DownloadPath").eq(0).text(t.$XML(n).find("DownloadPath").eq(0).text()), t.$XML(g).find("IVSMode").eq(0).text(t.$XML(n).find("IVSMode").eq(0).text()), t.$XML(g).find("CaptureFileFormat").eq(0).text(t.$XML(n).find("CaptureFileFormat").eq(0).text()), r = p.HWP_SetLocalConfig(S.toXMLStr(g)), r ? 0 : -1
				};
				var ft = function(e, t, n, r, o, i, a) {
					var u = {
						protocol: t,
						success: null,
						error: null
					};
					S.extend(u, a), S.extend(u, {
						success: function(u) {
							var c = new s;
							c.szIP = e, 2 == t ? (c.szHttpProtocol = "https://", c.iHttpsPort = n) : (c.szHttpProtocol = "http://", c.iHttpPort = n), c.iCGIPort = n, c.szDeviceIdentify = e + "_" + n, c.szAuth = r, c.iDeviceProtocol = o, c.oProtocolInc = i, N("使用%s协议登录成功", o), Q(c), tt(), et(c), P.push(jQuery.extend({}, c)), a.success && a.success(u)
						},
						error: function(e, t) {
							a.error && a.error(e, t)
						}
					}), i.login(e, n, r, u)
				};
				this.getAuthType = function(e, n, r, s, o, i) {
					e.oAuthType[n] = 1;
					var a = v,
						u = {
							async: !0,
							success: function(r) {
								e.oAuthType[n] = t.$XML(r).find("sessionIDVersion").eq(0).text(), i()
							},
							error: function(t) {
								t > 500 && (e.oAuthType[n] = t), i(t)
							}
						};
					a.getSessionCap(n, r, s, o, u)
				}, this.setDeviceInfo = function(e, t, n, r, o) {
					var t = new s;
					return t.szIP = n, 2 == r ? (t.szHttpProtocol = "https://", t.iHttpsPort = o) : (t.szHttpProtocol = "http://", t.iHttpPort = o), t.iCGIPort = o, t.szDeviceIdentify = n + "_" + o, t.iDeviceProtocol = x, t.oProtocolInc = e, t
				}, this.successV1cb = function(e, n, r, s, o, i, a, u) {
					n = this.setDeviceInfo(e, n, r, s, o), n.szAuth = t.$XML(i).find("sessionID").eq(0).text(), Q(n), N("使用%s协议登录成功", x), J(n.szDeviceIdentify, a, u), n.sessionFailed = 0, et(n);
					var c = jQuery.extend({}, n);
					P.push(c), c.sesstionTimer = setInterval(function() {
						e.sessionHeartbeat(c, function() {
							c.sessionFailed = 0
						}, function() {
							c.sessionFailed++, c.sessionFailed >= 5 && (window.PluginEventHandler(null, _, c.szDeviceIdentify), clearInterval(c.sesstionTimer))
						})
					}, 3e4)
				}, this.successV2cb = function(e, t, n, r, s, o, i, a) {
					t = this.setDeviceInfo(e, t, n, r, s), t.szAuth = O(t, t.szDeviceIdentify), Q(t), N("使用%s协议登录成功", x), document.cookie = "domain='10.18.99.194';path=/;", et(t), J(t.szDeviceIdentify, i, a), t.sessionFailed = 0;
					var u = jQuery.extend({}, t);
					P.push(u), u.sesstionTimer = setInterval(function() {
						e.sessionHeartbeat(u, function() {
							u.sessionFailed = 0
						}, function() {
							u.sessionFailed++, u.sessionFailed >= 5 && (window.PluginEventHandler(null, _, u.szDeviceIdentify), clearInterval(u.sesstionTimer))
						})
					}, 3e4)
				}, this.I_LoginV1 = function(e, t, n, r, s, o, i, a) {
					var u = this,
						c = {
							success: null,
							error: null
						};
					return S.extend(c, {
						success: function(c) {
							var l = {
								success: null,
								error: null
							};
							S.extend(l, {
								success: function(c) {
									a.success && (a.success(c), u.successV1cb(e, t, n, r, s, c, i, o))
								},
								error: function(e, t) {
									a.error && a.error(e, t)
								}
							}), e.sessionLogin(n, r, s, o, i, c, l)
						},
						error: function(e, t) {
							a.error && a.error(e, t)
						}
					}), c
				}, this.I_LoginV2 = function(e, t, n, r, s, o, i, a, u) {
					var c = {
							success: null,
							error: null
						},
						l = this;
					return S.extend(c, {
						success: function(c) {
							var d = {
								success: null,
								error: null
							};
							S.extend(d, {
								success: function(e) {
									l.successV2cb(t, n, r, s, o, e, a, i), u.success && u.success(e)
								},
								error: function(e, t) {
									u.error && u.error(e, t)
								}
							}), t.sessionV2Login(e, r, s, o, i, a, c, d)
						},
						error: function(e, t) {
							u.error && u.error(e, t)
						}
					}), c
				}, this.I_Login = function(e, t, n, r, o, i) {
					var a = e + "_" + n,
						u = this.findDeviceIndexByIP(a);
					if (-1 != u) return N("设备已经登录过"), -1;
					var c = v,
						l = x;
					if (U(i.cgi) || (x == i.cgi ? (c = v, l = x) : (c = C, l = D)), ct())
						if (x == l) {
							var d = new s;
							this.getAuthType(d, e, t, n, r, function() {
								var s = d.oAuthType[e];
								if (s > 2) i.error && i.error(s);
								else if (2 > s) {
									var a = this.I_LoginV1(c, d, e, t, n, r, o, i);
									c.getSessionCap(e, t, n, r, a)
								} else {
									var u = MD5((new Date).getTime().toString()).substring(0, 8);
									u = parseInt(u.replace("#", ""), 16).toString().substring(0, 8);
									var a = this.I_LoginV2(u, c, d, e, t, n, r, o, i);
									c.getSessionV2Cap(u, e, t, n, r, a)
								}
							})
						} else i.error && i.error(403, pt());
					else {
						var p = "";
						if (x == l) {
							p = S.Base64.encode(":" + r + ":" + o);
							var f = {
								success: null,
								error: null
							};
							S.extend(f, i), S.extend(f, {
								error: function(s, a) {
									p = S.Base64.encode(r + ":" + o), l = x, c = v;
									var u = {
										success: null,
										error: null
									};
									S.extend(u, i), S.extend(u, {
										error: function() {
											if (!U(i.cgi)) return i.error && i.error(s, a), void 0;
											p = S.Base64.encode(":" + r + ":" + o), l = D, c = C;
											var u = {
												success: null,
												error: null
											};
											S.extend(u, i), S.extend(u, {
												error: function(s, a) {
													p = S.Base64.encode(r + ":" + o), l = D, c = C;
													var u = {
														success: null,
														error: null
													};
													S.extend(u, i), S.extend(u, {
														error: function() {
															i.error && i.error(s, a)
														}
													}), ft(e, t, n, p, l, c, u)
												}
											}), ft(e, t, n, p, l, c, u)
										}
									}), ft(e, t, n, p, l, c, u)
								}
							}), ft(e, t, n, p, l, c, f)
						} else {
							p = S.Base64.encode(":" + r + ":" + o), l = D, c = C;
							var f = {
								success: null,
								error: null
							};
							S.extend(f, i), S.extend(f, {
								error: function(s, a) {
									p = S.Base64.encode(r + ":" + o), l = D, c = C;
									var u = {
										success: null,
										error: null
									};
									S.extend(u, i), S.extend(u, {
										error: function() {
											i.error && i.error(s, a)
										}
									}), ft(e, t, n, p, l, c, u)
								}
							}), ft(e, t, n, p, l, c, f)
						}
					}
				}, this.I_Logout = function(e) {
					var t = this.findDeviceIndexByIP(e);
					if (-1 != t) {
						if (ct()) {
							var n = P[t];
							clearInterval(n.sesstionTimer), n.oProtocolInc.sessionLogout(n, {})
						}
						return P.splice(t, 1), 0
					}
					return -1
				}, this.I_GetAudioInfo = function(e, t) {
					var n = this.findDeviceIndexByIP(e);
					if (-1 != n) {
						var r = P[n],
							s = {
								success: null,
								error: null
							};
						S.extend(s, t), r.oProtocolInc.getAudioInfo(r, s)
					}
				}, this.I_GetDeviceInfo = function(e, t) {
					var n = this.findDeviceIndexByIP(e);
					if (-1 != n) {
						var r = P[n],
							s = {
								success: null,
								error: null
							};
						S.extend(s, t), r.oProtocolInc.getDeviceInfo(r, s)
					}
				}, this.I_GetAnalogChannelInfo = function(e, t) {
					var n = this.findDeviceIndexByIP(e);
					if (-1 != n) {
						var r = P[n],
							s = {
								success: null,
								error: null
							};
						S.extend(s, t), r.oProtocolInc.getAnalogChannelInfo(r, s)
					}
				}, this.I_GetSecurityVersion = function(e, t) {
					var n = this.findDeviceIndexByIP(e);
					if (-1 != n) {
						var r = P[n],
							s = {
								success: null,
								error: null
							};
						S.extend(s, t), r.oProtocolInc.getSecurityVersion(r, s)
					}
				}, this.I_GetDigitalChannelInfo = function(e, t) {
					var n = this.findDeviceIndexByIP(e);
					if (-1 != n) {
						var r = P[n],
							s = {
								success: null,
								error: null
							};
						S.extend(s, t), r.oProtocolInc.getDigitalChannelInfo(r, s)
					}
				}, this.I_GetZeroChannelInfo = function(e, t) {
					var n = this.findDeviceIndexByIP(e);
					if (-1 != n) {
						var r = P[n],
							s = {
								success: null,
								error: null
							};
						S.extend(s, t), r.oProtocolInc.getZeroChannelInfo(r, s)
					}
				}, this.getStream = function(e, t, n) {
					var r = $.Deferred();
					return ct() && p.JS_Play(e, t, n).then(function() {
						addToWndSet(), r.resolve()
					}, function() {
						r.reject()
					}), r
				}, this.I_StartRealPlay = function(e, n) {
					var r = this.findDeviceIndexByIP(e),
						s = "",
						o = "",
						i = -1,
						a = 0,
						u = 0,
						c = !1,
						l = {
							iWndIndex: f,
							iStreamType: 1,
							iChannelID: 1,
							bZeroChannel: !1
						};
					if (S.extend(l, n), -1 != r) {
						at(P[r]);
						var d = P[r];
						if (ct()) {
							if (!d.bSupportWebsocket) return n.error && n.error(403, pt()), void 0;
							s = d.oProtocolInc.CGI.startWsRealPlay;
							var p = location.protocol;
							o = /^(https)(.*)$/.test(p) ? "wss://" : "ws://", d.iWSPort = U(l.iWSPort) ? 7681 : l.iWSPort, i = d.iWSPort, u = l.iStreamType, a = l.iChannelID <= d.iAnalogChannelNum ? l.iChannelID : d.oStreamCapa.iIpChanBase + parseInt(l.iChannelID, 10) - d.iAnalogChannelNum - 1, c = !0
						} else {
							var h = parseInt(t.$XML(g).find("ProtocolType").eq(0).text(), 10);
							h == H && d.oStreamCapa.bSupportShttpPlay ? (N("SHTTP RealPlay"), s = d.oProtocolInc.CGI.startShttpRealPlay, o = "http://", u = l.iStreamType - 1, a = l.iChannelID <= d.iAnalogChannelNum ? l.iChannelID : d.oStreamCapa.iIpChanBase + parseInt(l.iChannelID, 10) - d.iAnalogChannelNum - 1, c = !0, U(l.iPort) ? "https://" == d.szHttpProtocol ? (-1 == d.iHttpPort && (d.iHttpPort = nt(d).iHttpPort), i = d.iHttpPort) : i = d.iCGIPort : (d.iHttpPort = l.iPort, i = l.iPort)) : (N("RTSP RealPlay"), s = d.oProtocolInc.CGI.startRealPlay, o = "rtsp://", u = l.iStreamType, a = l.iChannelID, U(l.iRtspPort) || (d.iRtspPort = l.iRtspPort), -1 == d.iRtspPort && (d.iRtspPort = nt(d).iRtspPort), i = d.iRtspPort)
						}
						if (-1 == i) return N("获取端口号失败"), n.error && n.error(), void 0;
						S.extend(l, {
							urlProtocol: o,
							cgi: s,
							iPort: i,
							iStreamType: u,
							iChannelID: a
						}), r = this.findWndIndexByIndex(l.iWndIndex);
						var m = this; - 1 == r && d.oProtocolInc.startRealPlay(d, l).then(function() {
							r = m.findWndIndexByIndex(l.iWndIndex);
							var e = I[r];
							e.bShttpIPChannel = c, n.success && n.success()
						}, function() {
							ct() || (d.iRtspPort = -1), n.error && n.error()
						})
					} else n.error && n.error()
				}, this.I_CloseWin = function(e) {
					var t = this.findWndIndexByIndex(e);
					I.splice(t, 1)
				}, this.I_Stop = function(e) {
					var t = {
						iWndIndex: f
					};
					j(e) ? S.extend(t, e) : U(e) || (t.iWndIndex = e);
					var n = this.findWndIndexByIndex(t.iWndIndex);
					if (-1 != n) {
						var r = I[n];
						if (r.bRecord && (ct() || p.HWP_StopSave(r.iIndex)), r.bSound && (ct() || p.HWP_CloseSound()), r.bEZoom && (ct() || p.HWP_DisableZoom(r.iIndex)), ct()) p.JS_Stop(t.iWndIndex).then(function() {
							var iPlayIndex = this.findWndIndexByIndex(t.iWndIndex);
							I.splice(iPlayIndex, 1), t.success && t.success()
						}, function() {
							t.error && t.error()
						});
						else {
							var s = p.HWP_Stop(t.iWndIndex);
							var iPlayIndex = this.findWndIndexByIndex(t.iWndIndex);
							0 == s ? (I.splice(iPlayIndex, 1), t.success && t.success()) : t.error && t.error()
						}
					} else t.error && t.error()
				}, this.I_OpenSound = function(e) {
					e = U(e) ? f : e;
					var t = this.findWndIndexByIndex(e),
						n = -1;
					if (-1 != t) {
						var r = I[t];
						r.bSound || (n = ct() ? p.JS_OpenSound(e) : p.HWP_OpenSound(e), 0 == n && (r.bSound = !0))
					}
					return n
				}, this.I_CloseSound = function(e) {
					e = U(e) ? f : e;
					var t = this.findWndIndexByIndex(e),
						n = -1;
					if (-1 != t) {
						var r = I[t];
						r.bSound && (n = ct() ? p.JS_CloseSound() : p.HWP_CloseSound(), 0 == n && (r.bSound = !1))
					}
					return n
				}, this.I_SetVolume = function(e, t) {
					var n = -1;
					if (e = parseInt(e, 10), isNaN(e)) return n;
					if (0 > e || e > 100) return n;
					t = U(t) ? f : t;
					var r = this.findWndIndexByIndex(t);
					return -1 != r && (ct() ? (p.JS_SetVolume(t, e), n = 0) : n = p.HWP_SetVolume(t, e)), n
				}, this.I2_CapturePic = function(e, t) {
					var n = {
						iWndIndex: f,
						bDateDir: !0
					};
					j(t) ? S.extend(n, t) : U(t) || (n.iWndIndex = t);
					var r = this.findWndIndexByIndex(n.iWndIndex),
						s = -1,
						o = $.Deferred();
					if (-1 != r)
						if (ct()) {
							var i = "JPEG";
							".jpg" === e.slice(-4).toLowerCase() ? e = e.slice(0, -4) : ".jpeg" === e.slice(-5).toLowerCase() ? e = e.slice(0, -5) : ".bmp" === e.slice(-4).toLowerCase() && (e = e.slice(0, -4), i = "BMP"), p.JS_CapturePicture(n.iWndIndex, e, i).then(function() {
								o.resolve()
							}, function() {
								o.reject()
							})
						} else ".jpg" === e.slice(-4).toLowerCase() ? e = e.slice(0, -4) : ".jpeg" === e.slice(-5).toLowerCase() && (e = e.slice(0, -5)), s = p.HWP_CapturePicture(n.iWndIndex, e, n.bDateDir), 0 === s ? o.resolve() : o.reject();
					else o.reject();
					return o
				}, this.I2_CapturePicData = function(e) {
					var t = {
						iWndIndex: f,
						bDateDir: !0
					};
					j(e) ? S.extend(t, e) : U(e) || (t.iWndIndex = e);
					var n = this.findWndIndexByIndex(t.iWndIndex);
					if (-1 != n) {
						var r = $.Deferred();
						ct() ? p.JS_CapturePictureData(t.iWndIndex).then(function(e) {
							r.resolve(e)
						}, function(e) {
							N(e), r.reject()
						}) : r.reject()
					} else r.reject();
					return r
				}, this.I_StartRecord = function(e, t) {
					var n = {
						iWndIndex: f,
						bDateDir: !0
					};
					j(t) ? S.extend(n, t) : U(t) || (n.iWndIndex = t);
					var r = this.findWndIndexByIndex(n.iWndIndex);
					if (-1 != r) {
						var s = I[r];
						if (s.bRecord) n.error && n.error();
						else if (ct()) {
							var o = S.browser();
							o.chrome ? p.JS_StartSave(n.iWndIndex, e).then(function() {
								s.bRecord = !0, n.success && n.success()
							}, function() {
								n.error && n.error()
							}) : n.error && n.error()
						} else {
							var i = p.HWP_StartSave(n.iWndIndex, e, n.bDateDir);
							0 == i ? (s.bRecord = !0, n.success && n.success()) : n.error && n.error()
						}
					} else n.error && n.error()
				}, this.I_StopRecord = function(e) {
					var t = {
						iWndIndex: f
					};
					j(e) ? S.extend(t, e) : U(e) || (t.iWndIndex = e);
					var n = this.findWndIndexByIndex(t.iWndIndex);
					if (-1 != n) {
						var r = I[n];
						if (r.bRecord)
							if (ct()) {
								var s = S.browser();
								s.chrome ? p.JS_StopSave(t.iWndIndex).then(function() {
									r.bRecord = !1, t.success && t.success()
								}, function() {
									t.error && t.error()
								}) : t.error && t.error()
							} else {
								var o = p.HWP_StopSave(t.iWndIndex);
								0 == o ? (r.bRecord = !1, t.success && t.success()) : t.error && t.error()
							}
						else t.error && t.error()
					} else t.error && t.error()
				}, this.I_StartVoiceTalk = function(e, t) {
					if (isNaN(parseInt(t, 10))) return -1;
					var n = this.findDeviceIndexByIP(e),
						r = -1;
					if (-1 != n) {
						var s = P[n];
						s.bVoiceTalk || (r = ct() ? -1 : s.oProtocolInc.startVoiceTalk(s, t), 0 == r && (P[n].bVoiceTalk = !0))
					}
					return r
				}, this.I_StopVoiceTalk = function() {
					var e = -1;
					if (!ct()) {
						e = p.HWP_StopVoiceTalk();
						for (var t = 0, n = P.length; n > t; t++)
							if (P[t].bVoiceTalk) {
								P[t].bVoiceTalk = !1;
								break
							}
					}
					return e
				}, this.I_PTZControl = function(e, t, n) {
					var r = {
						iWndIndex: f,
						iPTZIndex: e,
						iPTZSpeed: 4
					};
					S.extend(r, n), S.extend(r, {
						async: !1
					});
					var s = this.findWndIndexByIndex(r.iWndIndex);
					if (-1 != s) {
						var o = I[s];
						if (s = this.findDeviceIndexByIP(o.szIP), -1 != s) {
							var i = P[s];
							9 == e ? i.oProtocolInc.ptzAutoControl(i, t, o, r) : i.oProtocolInc.ptzControl(i, t, o, r)
						}
					}
				}, this.I_EnableEZoom = function(e) {
					e = U(e) ? f : e;
					var t = this.findWndIndexByIndex(e),
						n = -1;
					if (-1 != t) {
						var r = I[t];
						r.bEZoom || (n = ct() ? p.JS_EnableZoom(e) : p.HWP_EnableZoom(e, 0), 0 == n && (r.bEZoom = !0))
					}
					return n
				}, this.I_DisableEZoom = function(e) {
					e = U(e) ? f : e;
					var t = this.findWndIndexByIndex(e),
						n = -1;
					if (-1 != t) {
						var r = I[t];
						r.bEZoom && (ct() ? n = p.JS_DisableZoom(e) : (p.HWP_DisableZoom(e), n = 0), 0 == n && (r.bEZoom = !1))
					}
					return n
				}, this.I_Enable3DZoom = function(e) {
					e = U(e) ? f : e;
					var t = this.findWndIndexByIndex(e),
						n = -1;
					if (-1 != t) {
						var r = I[t];
						r.b3DZoom || (ct() ? (n = 0, p.JS_Enable3DZoom(e, function(e) {
							window.ZoomInfoCallback(e)
						})) : n = p.HWP_EnableZoom(e, 1), 0 == n && (r.b3DZoom = !0))
					}
					return n
				}, this.I_Disable3DZoom = function(e) {
					e = U(e) ? f : e;
					var t = this.findWndIndexByIndex(e),
						n = -1;
					if (-1 != t) {
						var r = I[t];
						r.b3DZoom && (ct() ? (p.JS_Disable3DZoom(e), n = 0) : (p.HWP_DisableZoom(e), n = 0), 0 == n && (r.b3DZoom = !1))
					}
					return n
				}, this.I_FullScreen = function(e) {
					ct() ? p.JS_FullScreenSingle(f) : p.HWP_FullScreenDisplay(e)
				}, this.I_SetPreset = function(e, t) {
					var n = {
						iWndIndex: f,
						iPresetID: e
					};
					S.extend(n, t);
					var r = this.findWndIndexByIndex(n.iWndIndex);
					if (-1 != r) {
						var s = I[r];
						if (r = this.findDeviceIndexByIP(s.szIP), -1 != r) {
							var o = P[r];
							o.oProtocolInc.setPreset(o, s, n)
						}
					}
				}, this.I_GoPreset = function(e, t) {
					var n = {
						iWndIndex: f,
						iPresetID: e
					};
					S.extend(n, t);
					var r = this.findWndIndexByIndex(n.iWndIndex);
					if (-1 != r) {
						var s = I[r];
						if (r = this.findDeviceIndexByIP(s.szIP), -1 != r) {
							var o = P[r];
							o.oProtocolInc.goPreset(o, s, n)
						}
					}
				}, this.I_RecordSearch = function(e, t, n, r, s) {
					var o = this.findDeviceIndexByIP(e);
					if (-1 != o) {
						var i = P[o],
							a = {
								iChannelID: t,
								szStartTime: n,
								szEndTime: r,
								iSearchPos: 0,
								iStreamType: 1,
								success: null,
								error: null
							};
						S.extend(a, s), i.oProtocolInc.recordSearch(i, a)
					}
				}, this.I_StartPlayback = function(e, n) {
					var r = this.findDeviceIndexByIP(e),
						s = "",
						o = "",
						i = -1,
						a = 1,
						u = 0,
						c = S.dateFormat(new Date, "yyyy-MM-dd"),
						l = {
							iWndIndex: f,
							iStreamType: 1,
							iChannelID: 1,
							szStartTime: c + " 00:00:00",
							szEndTime: c + " 23:59:59"
						};
					if (S.extend(l, n), -1 != r) {
						at(P[r]);
						var d = P[r];
						if (ct()) {
							if (!d.bSupportWebsocket) return n.error && n.error(403, pt()), void 0;
							if (!U(l.oTransCodeParam)) return n.error && n.error(), void 0;
							s = d.oProtocolInc.CGI.startWsPlayback;
							var p = location.protocol;
							o = /^(https)(.*)$/.test(p) ? "wss://" : "ws://", d.iWSPort = U(l.iWSPort) ? 7681 : l.iWSPort, i = d.iWSPort, u = l.iStreamType, a = l.iChannelID <= d.iAnalogChannelNum ? l.iChannelID : d.oStreamCapa.iIpChanBase + parseInt(l.iChannelID, 10) - d.iAnalogChannelNum - 1, a = 100 * a + u
						} else {
							var h = parseInt(t.$XML(g).find("ProtocolType").eq(0).text(), 10);
							h == H && d.oStreamCapa.bSupportShttpPlay ? (s = U(l.oTransCodeParam) ? d.oProtocolInc.CGI.startShttpPlayback : d.oProtocolInc.CGI.startTransCodePlayback, o = "http://", u = l.iStreamType - 1, a = l.iChannelID <= d.iAnalogChannelNum ? l.iChannelID : d.oStreamCapa.iIpChanBase + parseInt(l.iChannelID, 10) - d.iAnalogChannelNum - 1, d.bSupportSubStreamPlayback && (a = 100 * a + u), U(l.iPort) ? "https://" == d.szHttpProtocol ? (-1 == d.iHttpPort && (d.iHttpPort = nt(d).iHttpPort), i = d.iHttpPort) : i = d.iCGIPort : (d.iHttpPort = l.iPort, i = l.iPort)) : (s = d.oProtocolInc.CGI.startPlayback, o = "rtsp://", u = l.iStreamType, a = 100 * l.iChannelID + u, U(l.iRtspPort) || (d.iRtspPort = l.iRtspPort), -1 == d.iRtspPort && (d.iRtspPort = nt(d).iRtspPort), i = d.iRtspPort)
						}
						if (-1 == i) return N("获取端口号失败"), n.error && n.error(), void 0;
						S.extend(l, {
							urlProtocol: o,
							cgi: s,
							iPort: i,
							iChannelID: a
						}), r = this.findWndIndexByIndex(l.iWndIndex), -1 == r && (ct() ? (l.szStartTime = l.szStartTime.replace(" ", "T") + "Z", l.szEndTime = l.szEndTime.replace(" ", "T") + "Z", d.oProtocolInc.startPlayback(d, l).then(function() {
							n.success && n.success()
						}, function() {
							n.error && n.error()
						})) : (l.szStartTime = l.szStartTime.replace(/[-:]/g, "").replace(" ", "T") + "Z", l.szEndTime = l.szEndTime.replace(/[-:]/g, "").replace(" ", "T") + "Z", d.oProtocolInc.startPlayback(d, l).then(function() {
							n.success && n.success()
						}, function() {
							d.iRtspPort = -1, n.error && n.error()
						})))
					} else n.error && n.error()
				}, this.I_ReversePlayback = function(e, n) {
					var r = this.findDeviceIndexByIP(e),
						s = -1,
						o = "",
						i = "",
						a = -1,
						u = -1,
						c = 0,
						l = S.dateFormat(new Date, "yyyy-MM-dd"),
						d = {
							iWndIndex: f,
							iStreamType: 1,
							iChannelID: 1,
							szStartTime: l + " 00:00:00",
							szEndTime: l + " 23:59:59"
						};
					if (S.extend(d, n), -1 != r) {
						at(P[r]);
						var p = P[r];
						if (ct()) return s;
						var h = parseInt(t.$XML(g).find("ProtocolType").eq(0).text(), 10);
						if (h == H && p.oStreamCapa.bSupportShttpPlay ? (o = p.oProtocolInc.CGI.startShttpReversePlayback, i = "http://", c = d.iStreamType - 1, u = d.iChannelID <= p.iAnalogChannelNum ? d.iChannelID : p.oStreamCapa.iIpChanBase + parseInt(d.iChannelID, 10) - p.iAnalogChannelNum - 1, u = 100 * u + c, U(d.iPort) ? "https://" == p.szHttpProtocol ? (-1 == p.iHttpPort && (p.iHttpPort = nt(p).iHttpPort), a = p.iHttpPort) : a = p.iCGIPort : (p.iHttpPort = d.iPort, a = d.iPort)) : (o = p.oProtocolInc.CGI.startPlayback, i = "rtsp://", c = d.iStreamType, u = 100 * d.iChannelID + c, U(d.iRtspPort) || (p.iRtspPort = d.iRtspPort), -1 == p.iRtspPort && (p.iRtspPort = nt(p).iRtspPort), a = p.iRtspPort), -1 == a) return N("获取端口号失败"), s;
						S.extend(d, {
							urlProtocol: i,
							cgi: o,
							iPort: a,
							iChannelID: u
						}), r = this.findWndIndexByIndex(d.iWndIndex), -1 == r && (d.szStartTime = d.szStartTime.replace(/[-:]/g, "").replace(" ", "T") + "Z", d.szEndTime = d.szEndTime.replace(/[-:]/g, "").replace(" ", "T") + "Z", s = p.oProtocolInc.reversePlayback(p, d))
					}
					return -1 == s && (p.iRtspPort = -1), s
				}, this.I_Frame = function(e) {
					var t = {
						iWndIndex: f
					};
					j(e) ? S.extend(t, e) : U(e) || (t.iWndIndex = e);
					var n = this.findWndIndexByIndex(t.iWndIndex);
					if (-1 != n) {
						var r = I[n],
							s = r.iPlayStatus;
						if (s == A || s == L)
							if (ct()) p.JS_FrameForward(t.iWndIndex).then(function() {
								r.iPlayStatus = L, t.success && t.success()
							}, function() {
								t.error && t.error()
							});
							else {
								var o = p.HWP_FrameForward(t.iWndIndex);
								0 == o ? (r.iPlayStatus = L, t.success && t.success()) : t.error && t.error()
							}
						else t.error && t.error()
					} else t.error && t.error()
				}, this.I_Pause = function(e) {
					var t = {
						iWndIndex: f
					};
					j(e) ? S.extend(t, e) : U(e) || (t.iWndIndex = e);
					var n = this.findWndIndexByIndex(t.iWndIndex);
					if (-1 != n) {
						var r = I[n],
							s = r.iPlayStatus,
							o = -1;
						if (s == A) o = M;
						else {
							if (s != q) return t.error && t.error(), void 0;
							o = R
						}
						if (ct()) p.JS_Pause(t.iWndIndex).then(function() {
							r.iPlayStatus = o, t.success && t.success()
						}, function() {
							t.error && t.error()
						});
						else {
							var i = p.HWP_Pause(t.iWndIndex);
							0 == i ? (r.iPlayStatus = o, t.success && t.success()) : t.error && t.error()
						}
					} else t.error && t.error()
				}, this.I_Resume = function(e) {
					var t = {
						iWndIndex: f
					};
					j(e) ? S.extend(t, e) : U(e) || (t.iWndIndex = e);
					var n = this.findWndIndexByIndex(t.iWndIndex);
					if (-1 != n) {
						var r = I[n],
							s = r.iPlayStatus,
							o = -1;
						if (s == M || s == L) o = A;
						else {
							if (s != R) return t.error && t.error(), void 0;
							o = q
						}
						if (ct()) p.JS_Resume(t.iWndIndex).then(function() {
							r.iPlayStatus = o, t.success && t.success()
						}, function() {
							t.error && t.error()
						});
						else {
							var i = p.HWP_Resume(t.iWndIndex);
							0 == i ? (r.iPlayStatus = o, t.success && t.success()) : t.error && t.error()
						}
					} else t.error && t.error()
				}, this.I_PlaySlow = function(e) {
					var t = {
						iWndIndex: f
					};
					j(e) ? S.extend(t, e) : U(e) || (t.iWndIndex = e);
					var n = this.findWndIndexByIndex(t.iWndIndex);
					if (-1 != n) {
						var r = I[n];
						if (r.iPlayStatus == A)
							if (ct()) {
								var s = p.JS_GetWndStatus(t.iWndIndex);
								s.iRate <= -4 ? t.error && t.error() : p.JS_Slow(t.iWndIndex).then(function() {
									t.success && t.success()
								}, function() {
									t.error && t.error()
								})
							} else {
								var o = p.HWP_Slow(t.iWndIndex);
								0 == o ? t.success && t.success() : t.error && t.error()
							}
						else t.error && t.error()
					} else t.error && t.error()
				}, this.I_PlayFast = function(e) {
					var t = {
						iWndIndex: f
					};
					j(e) ? S.extend(t, e) : U(e) || (t.iWndIndex = e);
					var n = this.findWndIndexByIndex(t.iWndIndex);
					if (-1 != n) {
						var r = I[n];
						if (r.iPlayStatus == A)
							if (ct()) {
								var s = p.JS_GetWndStatus(t.iWndIndex);
								s.iRate >= 8 ? t.error && t.error() : p.JS_Fast(t.iWndIndex).then(function() {
									t.success && t.success()
								}, function() {
									t.error && t.error()
								})
							} else {
								var o = p.HWP_Fast(t.iWndIndex);
								0 == o ? t.success && t.success() : t.error && t.error()
							}
						else t.error && t.error()
					} else t.error && t.error()
				}, this.I_GetOSDTime = function(e) {
					var t = {
						iWndIndex: f
					};
					j(e) ? S.extend(t, e) : U(e) || (t.iWndIndex = e);
					var n = this.findWndIndexByIndex(t.iWndIndex);
					if (-1 != n) {
						if (ct()) p.JS_GetOSDTime(t.iWndIndex).then(function(e) {
							if (t.success) {
								var n = S.dateFormat(new Date(1e3 * e), "yyyy-MM-dd hh:mm:ss");
								t.success(n)
							}
						}, function() {
							t.error && t.error()
						});
						else if (t.success) {
							var r = p.HWP_GetOSDTime(t.iWndIndex),
								s = S.dateFormat(new Date(1e3 * r), "yyyy-MM-dd hh:mm:ss");
							t.success(s)
						}
					} else t.error && t.error()
				}, this.I_StartDownloadRecord = function(e, t, n, r) {
					var s = this.findDeviceIndexByIP(e),
						o = -1;
					if (-1 != s) {
						var i = P[s],
							a = {
								szPlaybackURI: t,
								szFileName: n,
								bDateDir: !0
							};
						U(r) || S.extend(a, r), o = i.oProtocolInc.startDownloadRecord(i, a)
					}
					return o
				}, this.I_StartDownloadRecordByTime = function(e, t, n, r, s, o) {
					var i = this.findDeviceIndexByIP(e),
						a = -1;
					if (-1 != i) {
						var u = P[i];
						t = t.split("?")[0] + "?starttime=" + r.replace(" ", "T") + "Z&endtime=" + s.replace(" ", "T") + "Z";
						var c = {
							szPlaybackURI: t,
							szFileName: n,
							bDateDir: !0
						};
						U(o) || S.extend(c, o), a = u.oProtocolInc.startDownloadRecord(u, c)
					}
					return a
				}, this.I_GetDownloadStatus = function(e) {
					var t = -1;
					return ct() ? t : (t = p.HWP_GetDownloadStatus(e), 1 == t && (t = -1), t)
				}, this.I_GetDownloadProgress = function(e) {
					return ct() ? -1 : p.HWP_GetDownloadProgress(e)
				}, this.I_StopDownloadRecord = function(e) {
					return ct() ? -1 : p.HWP_StopDownload(e)
				}, this.I_ExportDeviceConfig = function(e, t) {
					var n = this.findDeviceIndexByIP(e),
						r = -1;
					if (-1 != n) {
						var s = P[n];
						r = s.oProtocolInc.exportDeviceConfig(s, t)
					}
					return r
				}, this.I_ImportDeviceConfig = function(e, t, n) {
					var r = this.findDeviceIndexByIP(e),
						s = -1;
					if (-1 != r) {
						var o = P[r],
							i = {
								szFileName: t
							};
						s = o.oProtocolInc.importDeviceConfig(o, i, n)
					}
					return s
				}, this.I_RestoreDefault = function(e, t, n) {
					var r = {
						success: null,
						error: null
					};
					S.extend(r, n);
					var s = this.findDeviceIndexByIP(e);
					if (-1 != s) {
						var o = P[s];
						o.oProtocolInc.restore(o, t, r)
					}
				}, this.I_Restart = function(e, t) {
					var n = this.findDeviceIndexByIP(e),
						r = {
							success: null,
							error: null
						};
					if (S.extend(r, t), -1 != n) {
						var s = P[n];
						s.oProtocolInc.restart(s, r)
					}
				}, this.I_Reconnect = function(e, t) {
					var n = this.findDeviceIndexByIP(e),
						r = {
							success: null,
							error: null
						};
					if (S.extend(r, t), -1 != n) {
						var s = P[n];
						s.oProtocolInc.login(s.szIP, s.iCGIPort, s.szAuth, r)
					}
				}, this.I_StartUpgrade = function(e, t) {
					var n = this.findDeviceIndexByIP(e),
						r = -1;
					if (-1 != n) {
						var s = P[n],
							o = {
								szFileName: t
							};
						return ct() ? r : s.oProtocolInc.startUpgrade(s, o)
					}
					return r
				}, this.I2_StartUpgrade = function(e, t) {
					var n = this.findDeviceIndexByIP(e);
					if (-1 != n) {
						var r = P[n],
							s = {
								szFileName: t
							};
						return r.oProtocolInc.asyncstartUpgrade(r, s)
					}
				}, this.I_UpgradeStatus = function() {
					return ct() ? p.JS_UpgradeStatus() : p.HWP_UpgradeStatus()
				}, this.I_UpgradeProgress = function() {
					return ct() ? p.JS_UpgradeProgress() : p.HWP_UpgradeProgress()
				}, this.I_StopUpgrade = function() {
					return ct() ? -1 : p.HWP_StopUpgrade()
				}, this.I_CheckPluginInstall = function() {
					var e = -1,
						t = S.browser();
					if (ct()) e = 0;
					else if (t.msie) try {
						new ActiveXObject("WebVideoKitActiveX.WebVideoKitActiveXCtrl.1"), e = 0
					} catch (n) {} else
						for (var r = 0, s = navigator.mimeTypes.length; s > r; r++)
							if ("application/webvideo-plugin-kit" == navigator.mimeTypes[r].type.toLowerCase()) {
								e = 0;
								break
							}
					return e
				}, this.I_CheckPluginVersion = function() {
					return ct() ? 0 : p.HWP_CheckPluginUpdate(B) ? -1 : 0
				}, this.I_SendHTTPRequest = function(e, t, n) {
					var r = this.findDeviceIndexByIP(e);
					if (!(0 > r)) {
						var s = P[r],
							o = new Pt,
							i = s.szHttpProtocol + s.szIP + ":" + s.iCGIPort + "/" + t,
							a = {
								type: "GET",
								url: i,
								auth: s.szAuth,
								success: null,
								error: null
							};
						S.extend(a, n), S.extend(a, {
							success: function(e) {
								n.success && n.success(e)
							},
							error: function(e, t) {
								n.error && n.error(e, t)
							}
						}), o.setRequestParam(a), o.submitRequest()
					}
				}, this.I_RemoteConfig = function(e, t) {
					var n = this.findDeviceIndexByIP(e),
						r = -1,
						s = -1;
					if (ct()) return r;
					var o = {
						iLan: 0,
						iDevicePort: -1,
						iType: 0
					};
					if (S.extend(o, t), -1 != n) {
						var i = P[n];
						if (-1 == o.iDevicePort)
							if (-1 == i.iDevicePort) {
								if (i.iDevicePort = nt(i).iDevicePort, s = i.iDevicePort, -1 == s) return r
							} else s = i.iDevicePort;
						else s = o.iDevicePort;
						if (":" == S.Base64.decode(i.szAuth)[0]) var a = S.Base64.decode(i.szAuth).split(":")[1],
							u = S.Base64.decode(i.szAuth).split(":")[2];
						else var a = S.Base64.decode(i.szAuth).split(":")[0],
							u = S.Base64.decode(i.szAuth).split(":")[1];
						var c = "<RemoteInfo><DeviceInfo><DeviceType>" + o.iType + "</DeviceType>" + "<LanType>" + o.iLan + "</LanType>" + "<IP>" + i.szIP + "</IP>" + "<Port>" + s + "</Port>" + "<UName>" + a + "</UName>" + "<PWD>" + S.Base64.encode(u) + "</PWD></DeviceInfo></RemoteInfo>";
						return p.HWP_ShowRemConfig(c)
					}
					return r
				}, this.I_ChangeWndNum = function(e) {
					return isNaN(parseInt(e, 10)) ? -1 : (ct() ? p.JS_ArrangeWindow(e) : p.HWP_ArrangeWindow(e), 0)
				}, this.I_GetLastError = function() {
					return ct() ? -1 : p.HWP_GetLastError()
				}, this.I_GetWindowStatus = function(e) {
					if (U(e)) {
						var t = [];
						return S.extend(t, I), t
					}
					var n = this.findWndIndexByIndex(e);
					if (-1 != n) {
						var t = {};
						return S.extend(t, I[n]), t
					}
					return null
				}, this.I_GetIPInfoByMode = function(e, t, n, r) {
					return ct() ? "" : p.HWP_GetIpInfoByMode(e, t, n, r)
				}, this.I_SetPlayModeType = function(e) {
					return ct() ? 0 : p.HWP_SetPlayModeType(e)
				}, this.I_SetSnapDrawMode = function(e, t) {
					return ct() ? t > -1 ? p.JS_SetDrawStatus(!0) : p.JS_SetDrawStatus(!1) : p.HWP_SetSnapDrawMode(e, t)
				}, this.I2_SetSnapPolygonInfo = function(r, s) {
					if (ct()) {
						p.JS_GetPolygonInfo();
						var o = S.loadXML(s),
							a = [];
						for (nodeList = t.$XML(o).find("SnapPolygon", !0), i = 0, iLen = nodeList.length; iLen > i; i++) {
							node = nodeList[i];
							var u = e(t.$XML(node).find("r").eq(0).text(), t.$XML(node).find("g").eq(0).text(), t.$XML(node).find("b").eq(0).text());
							u = n(u, 6), u = "#" + u;
							for (var c = [], l = t.$XML(node).find("point", !0), d = 0, f = l.length; f > d; d++) oNodePoint = l[d], c.push([500 * t.$XML(oNodePoint).find("x").eq(0).text(), 300 * t.$XML(oNodePoint).find("y").eq(0).text()]);
							a.push({
								iPolygonType: 1,
								id: t.$XML(node).find("id").eq(0).text(),
								iEditType: 0,
								aPoint: c,
								bClosed: !0,
								szTips: t.$XML(node).find("tips").eq(0).text(),
								szDrawColor: u,
								iTranslucent: .1
							})
						}
						return p.JS_SetPolygonInfo(a)
					}
					return p.HWP_SetSnapPolygonInfo(r, s)
				}, this.I_SetSnapPolygonInfo = function(r, s) {
					if (ct()) {
						var o = p.JS_GetPolygonInfo(),
							i = S.loadXML(s),
							a = [];
						for (D = t.$XML(i).find("SnapPolygon", !0), d = 0, f = D.length; f > d; d++) {
							h = D[d];
							var u = e(t.$XML(h).find("r").eq(0).text(), t.$XML(h).find("g").eq(0).text(), t.$XML(h).find("b").eq(0).text());
							u = n(u, 6), u = "#" + u, a.push({
								id: t.$XML(h).find("id").eq(0).text(),
								tips: t.$XML(h).find("tips").eq(0).text(),
								iMaxShapeSupport: o.length + 1,
								iMaxPointSupport: t.$XML(h).find("PointNumMax").eq(0).text(),
								iMinPointSupport: t.$XML(h).find("MinClosed").eq(0).text(),
								style: {
									szDrawColor: u,
									iTranslucent: .1
								}
							})
						}
						0 === D.length && a.push({
							iMaxShapeSupport: 1,
							iMaxPointSupport: 17,
							iMinPointSupport: 1,
							style: {
								szDrawColor: "#FFFF00",
								iTranslucent: .1
							}
						});
						var c = [];
						$.each(o, function(e, t) {
							c.push(t.id)
						});
						var l = c.join(",");
						if (l = "," + l + ",", o.length + a.length > 32) return -3;
						for (var d = 0, f = a.length; f > d; d++) {
							var h = a[d],
								P = h.id;
							if (!S.isInt(P)) return -2;
							var I = parseInt(P, 10);
							if (1 > I || I > 32) return -2;
							if (l.indexOf("," + P + ",") > -1) return -4;
							var m = h.tips;
							if (m.length > 32) return -2;
							var v = h.flag;
							if (!v) {
								var C = h.iMinPointSupport;
								if (!S.isInt(C)) return -2;
								var y = parseInt(C, 10);
								if (4 > y || y > 17) return -2;
								var g = h.iMaxPointSupport;
								if (!S.isInt(g)) return -2;
								var x = parseInt(g, 10);
								if (y > x || x > 17) return -2
							}
						}
						return p.JS_SetDrawShapeInfo("Polygon", a[0])
					}
					var i, D, d, f, h, P, I, m, C, y, v, g, x, z = p.HWP_GetSnapPolygonInfo(r);
					i = S.loadXML(z), D = t.$XML(i).find("SnapPolygon", !0);
					var b = D.length,
						c = [];
					for (d = 0, f = D.length; f > d; d++) h = D[d], c.push(t.$XML(h).find("id").eq(0).text());
					var l = c.join(",");
					if (l = "," + l + ",", i = S.loadXML(s), D = t.$XML(i).find("SnapPolygon", !0), b + D.length > 32) return -3;
					for (d = 0, f = D.length; f > d; d++) {
						if (h = D[d], P = t.$XML(h).find("id").eq(0).text(), !S.isInt(P)) return -2;
						if (I = parseInt(P, 10), 1 > I || I > 32) return -2;
						if (l.indexOf("," + P + ",") > -1) return -4;
						if (m = t.$XML(h).find("tips").eq(0).text(), m.length > 32) return -2;
						if (v = "true" === t.$XML(h).find("isClosed").eq(0).text(), !v) {
							if (C = t.$XML(h).find("MinClosed").eq(0).text(), !S.isInt(C)) return -2;
							if (y = parseInt(C, 10), 4 > y || y > 17) return -2;
							if (g = t.$XML(h).find("PointNumMax").eq(0).text(), !S.isInt(g)) return -2;
							if (x = parseInt(g, 10), y > x || x > 17) return -2
						}
					}
					return p.HWP_SetSnapPolygonInfo(r, s)
				}, this.I_GetSnapPolygonInfo = function(e) {
					if (ct()) {
						for (var t = p.JS_GetPolygonInfo(e), n = '<?xml version="1.0" encoding="utf-8"?><SnapPolygonList>', s = 0; s < t.length; s++) {
							n += "<SnapPolygon>";
							var o = r(t[s].szDrawColor);
							n += "<id>" + t[s].szTips.split("#")[1] + "</id><polygonType>1</polygonType><color><r>" + o[0] + "</r><g>" + o[1] + "</g><b>" + o[2] + "</b></color><tips>" + t[s].szTips + "</tips><isClosed>" + t[s].bClosed + "</isClosed><pointList>";
							for (var i = 0; i < t[s].aPoint.length; i++) n += "<point><x>" + t[s].aPoint[i][0] / a + "</x><y>" + t[s].aPoint[i][1] / u + "</y></point>";
							n += "</pointList></SnapPolygon>"
						}
						return n += "</SnapPolygonList>"
					}
					return p.HWP_GetSnapPolygonInfo(e)
				}, this.I_ClearSnapInfo = function(e) {
					return ct() ? p.JS_ClearSnapInfo() : p.HWP_ClearSnapInfo(e, 1)
				}, this.I_DeviceCapturePic = function(e, t, n, r) {
					var s = this.findDeviceIndexByIP(e),
						o = -1;
					if (-1 != s) {
						var i = P[s],
							a = {
								bDateDir: !0
							};
						if (S.extend(a, r), !U(a.iResolutionWidth) && !S.isInt(a.iResolutionWidth)) return o;
						if (!U(a.iResolutionHeight) && !S.isInt(a.iResolutionHeight)) return o;
						o = i.oProtocolInc.deviceCapturePic(i, t, n, a)
					}
					return o
				}, this.I_SetPackageType = function(e) {
					return ct() ? -1 : p.HWP_SetPackageType(e)
				}, this.I_GetDevicePort = function(e) {
					var t = this.findDeviceIndexByIP(e),
						n = null;
					if (-1 != t) {
						var r = P[t];
						n = nt(r)
					}
					return n
				}, this.I_GetTextOverlay = function(e, t, n) {
					var r = this.findDeviceIndexByIP(t),
						s = -1;
					if (-1 != r) {
						var o = P[r];
						I[r];
						var i = {
							async: !1,
							type: "GET",
							success: n.success,
							error: n.error
						};
						this.I_SendHTTPRequest(o.szIP + "_" + o.iCGIPort, e, i)
					}
					return s
				}, this.findDeviceIndexByIP = function(e) {
					if (e.indexOf("_") > -1) {
						for (var t = 0, n = P.length; n > t; t++)
							if (P[t].szDeviceIdentify == e) return t
					} else
						for (var t = 0, n = P.length; n > t; t++)
							if (P[t].szIP == e) return t;
					return -1
				}, this.findWndIndexByIndex = function(e) {
					for (var t = 0, n = I.length; n > t; t++)
						if (I[t].iIndex == e) return t;
					return -1
				};
				var ht = function() {
						this.iIndex = 0, this.szIP = "", this.iCGIPort = 80, this.szDeviceIdentify = "", this.iChannelID = "", this.iPlayStatus = b, this.bSound = !1, this.bRecord = !1, this.bPTZAuto = !1, this.bEZoom = !1, this.b3DZoom = !1
					},
					Pt = function() {
						this.options = {
							type: "GET",
							url: "",
							auth: "",
							timeout: 1e4,
							data: "",
							async: !0,
							success: null,
							error: null
						}, this.m_szHttpHead = "", this.m_szHttpContent = "", this.m_szHttpData = ""
					};
				Pt.prototype.m_httpRequestSet = [], Pt.prototype.setRequestParam = function(e) {
					S.extend(this.options, e)
				}, Pt.prototype.submitRequest = function() {
					var e = null,
						t = this;
					if (ct()) {
						this.options.auth ? S.cookie("WebSession", this.options.auth) : S.cookie("WebSession", null);
						var n = lt(this.options.url),
							r = new window.XMLHttpRequest;
						r.open(this.options.type, n, this.options.async);
						var s = function(e) {
							return /^(http|https):\/\/([^\/]+)(.+)$/.test(e) ? RegExp.$2 : ""
						};
						if (d.proxyAddress) {
							r.withCredentials = !0;
							var o = s(this.options.url);
							r.setRequestHeader("deviceIdentify", o)
						}
						r.setRequestHeader("X-Requested-With", "XMLHttpRequest"), r.setRequestHeader("If-Modified-Since", "0"), r.send(this.options.data || null);
						var i = function() {
							if (4 === r.readyState) {
								e = {
									funSuccessCallback: t.options.success,
									funErrorCallback: t.options.error
								};
								var n = r.status + r.responseText;
								0 === r.status && (n = ""), t.httpDataAnalyse(e, n)
							}
						};
						this.options.async ? (r.timeout = this.options.timeout, r.onreadystatechange = function() {
							i()
						}) : i()
					} else {
						var a = this.getHttpMethod(this.options.type);
						if (this.options.async) {
							var u = p.HWP_SubmitHttpRequest(a, this.options.url, this.options.auth, this.options.data, this.options.timeout); - 1 != u && (e = {
								iRequestID: u,
								funSuccessCallback: this.options.success,
								funErrorCallback: this.options.error
							}, this.m_httpRequestSet.push(e))
						} else {
							var c = p.HWP_SendHttpSynRequest(a, this.options.url, this.options.auth, this.options.data, this.options.timeout);
							e = {
								funSuccessCallback: this.options.success,
								funErrorCallback: this.options.error
							}, this.httpDataAnalyse(e, c)
						}
					}
				}, Pt.prototype.getHttpMethod = function(e) {
					var t = {
							GET: 1,
							POST: 2,
							PUT: 5,
							DELETE: 6
						},
						n = t[e];
					return n ? n : -1
				}, Pt.prototype.processCallback = function(e, t) {
					for (var n = null, r = 0; r < this.m_httpRequestSet.length; r++)
						if (e == this.m_httpRequestSet[r].iRequestID) {
							n = this.m_httpRequestSet[r], this.m_httpRequestSet.splice(r, 1);
							break
						}
					null != n && (this.httpDataAnalyse(n, t), delete n)
				}, Pt.prototype.httpDataAnalyse = function(e, t) {
					var n = "",
						r = 0;
					"" == t || U(t) ? e.funErrorCallback() : (r = parseInt(t.substring(0, 3)), n = t.substring(3, t.length), isNaN(r) ? e.funErrorCallback() : z == r ? this.options && this.options.url.indexOf("?format=json") > -1 ? e.funSuccessCallback(JSON.parse(n)) : e.funSuccessCallback(S.loadXML(n)) : e.funErrorCallback && e.funErrorCallback(r, S.loadXML(n)))
				};
				var It = function() {};
				It.prototype.CGI = {
					login: "%s%s:%s/ISAPI/Security/userCheck",
					getAudioInfo: "%s%s:%s/ISAPI/System/TwoWayAudio/channels",
					getDeviceInfo: "%s%s:%s/ISAPI/System/deviceInfo",
					getAnalogChannelInfo: "%s%s:%s/ISAPI/System/Video/inputs/channels",
					getDigitalChannel: "%s%s:%s/ISAPI/ContentMgmt/InputProxy/channels",
					getDigitalChannelInfo: "%s%s:%s/ISAPI/ContentMgmt/InputProxy/channels/status",
					getZeroChannelInfo: "%s%s:%s/ISAPI/ContentMgmt/ZeroVideo/channels",
					getStreamChannels: {
						analog: "%s%s:%s/ISAPI/Streaming/channels",
						digital: "%s%s:%s/ISAPI/ContentMgmt/StreamingProxy/channels"
					},
					getStreamDynChannels: "%s%s:%s/PSIA/Custom/SelfExt/ContentMgmt/DynStreaming/channels",
					startRealPlay: {
						channels: "%s%s:%s/PSIA/streaming/channels/%s",
						zeroChannels: "%s%s:%s/PSIA/Custom/SelfExt/ContentMgmt/ZeroStreaming/channels/%s"
					},
					startShttpRealPlay: {
						channels: "%s%s:%s/SDK/play/%s/004",
						zeroChannels: "%s%s:%s/SDK/play/100/004/ZeroStreaming"
					},
					startWsRealPlay: {
						channels: "%s%s:%s/%s",
						zeroChannels: "%s%s:%s/%s"
					},
					startVoiceTalk: {
						open: "%s%s:%s/ISAPI/System/TwoWayAudio/channels/%s/open",
						close: "%s%s:%s/ISAPI/System/TwoWayAudio/channels/%s/close",
						audioData: "%s%s:%s/ISAPI/System/TwoWayAudio/channels/%s/audioData"
					},
					ptzControl: {
						analog: "%s%s:%s/ISAPI/PTZCtrl/channels/%s/continuous",
						digital: "%s%s:%s/ISAPI/ContentMgmt/PTZCtrlProxy/channels/%s/continuous"
					},
					ptzAutoControl: {
						ipdome: "%s%s:%s/ISAPI/PTZCtrl/channels/%s/presets/%s/goto",
						analog: "%s%s:%s/ISAPI/PTZCtrl/channels/%s/autoPan",
						digital: "%s%s:%s/ISAPI/ContentMgmt/PTZCtrlProxy/channels/%s/autoPan"
					},
					setPreset: {
						analog: "%s%s:%s/ISAPI/PTZCtrl/channels/%s/presets/%s",
						digital: "%s%s:%s/ISAPI/ContentMgmt/PTZCtrlProxy/channels/%s/presets/%s"
					},
					goPreset: {
						analog: "%s%s:%s/ISAPI/PTZCtrl/channels/%s/presets/%s/goto",
						digital: "%s%s:%s/ISAPI/ContentMgmt/PTZCtrlProxy/channels/%s/presets/%s/goto"
					},
					ptzFocus: {
						analog: "%s%s:%s/ISAPI/Image/channels/%s/focus",
						digital: "%s%s:%s/ISAPI/ContentMgmt/ImageProxy/channels/%s/focus",
						ipc: "%s%s:%s/ISAPI/System/Video/inputs/channels/%s/focus"
					},
					ptzIris: {
						analog: "%s%s:%s/ISAPI/Image/channels/%s/iris",
						digital: "%s%s:%s/ISAPI/ContentMgmt/ImageProxy/channels/%s/iris",
						ipc: "%s%s:%s/ISAPI/System/Video/inputs/channels/%s/iris"
					},
					getNetworkBond: "%s%s:%s/ISAPI/System/Network/Bond",
					getNetworkInterface: "%s%s:%s/ISAPI/System/Network/interfaces",
					getUPnPPortStatus: "%s%s:%s/ISAPI/System/Network/UPnP/ports/status",
					getPPPoEStatus: "%s%s:%s/ISAPI/System/Network/PPPoE/1/status",
					getPortInfo: "%s%s:%s/ISAPI/Security/adminAccesses",
					recordSearch: "%s%s:%s/ISAPI/ContentMgmt/search",
					startPlayback: "%s%s:%s/PSIA/streaming/tracks/%s?starttime=%s&endtime=%s",
					startWsPlayback: "%s%s:%s/%s",
					startShttpPlayback: "%s%s:%s/SDK/playback/%s",
					startShttpReversePlayback: "%s%s:%s/SDK/playback/%s/reversePlay",
					startTransCodePlayback: "%s%s:%s/SDK/playback/%s/transcoding",
					startDownloadRecord: "%s%s:%s/ISAPI/ContentMgmt/download",
					downloaddeviceConfig: "%s%s:%s/ISAPI/System/configurationData",
					uploaddeviceConfig: "%s%s:%s/ISAPI/System/configurationData",
					restart: "%s%s:%s/ISAPI/System/reboot",
					restore: "%s%s:%s/ISAPI/System/factoryReset?mode=%s",
					startUpgrade: {
						upgrade: "%s%s:%s/ISAPI/System/updateFirmware",
						status: "%s%s:%s/ISAPI/System/upgradeStatus"
					},
					set3DZoom: {
						analog: "%s%s:%s/ISAPI/PTZCtrl/channels/%s/position3D",
						digital: "%s%s:%s/ISAPI/ContentMgmt/PTZCtrlProxy/channels/%s/position3D"
					},
					getSecurityVersion: "%s%s:%s/ISAPI/Security/capabilities?username=admin",
					SDKCapabilities: "%s%s:%s/SDK/capabilities",
					deviceCapture: {
						channels: "%s%s:%s/ISAPI/Streaming/channels/%s/picture"
					},
					overlayInfo: {
						analog: "%s%s:%s/ISAPI/System/Video/inputs/channels/%s/overlays/",
						digital: "%s%s:%s/ISAPI/ContentMgmt/InputProxy/channels/%s/video/overlays"
					},
					sessionCap: "%s%s:%s/ISAPI/Security/sessionLogin/capabilities?username=%s",
					sessionLogin: "%s%s:%s/ISAPI/Security/sessionLogin",
					sessionHeartbeat: "%s%s:%s/ISAPI/Security/sessionHeartbeat",
					sessionLogout: "%s%s:%s/ISAPI/Security/sessionLogout",
					systemCapabilities: "%s%s:%s/ISAPI/System/capabilities"
				}, It.prototype.login = function(e, t, n, r) {
					var s = 2 == r.protocol ? "https://" : "http://",
						o = F(this.CGI.login, s, e, t),
						i = new Pt,
						a = {
							type: "GET",
							url: o,
							auth: n,
							success: null,
							error: null
						};
					S.extend(a, r), S.extend(a, {
						success: function(e) {
							r.success && r.success(e)
						},
						error: function(e, t) {
							r.error && r.error(e, t)
						}
					}), i.setRequestParam(a), i.submitRequest()
				}, It.prototype.getAudioInfo = function(e, t) {
					var n = F(this.CGI.getAudioInfo, e.szHttpProtocol, e.szIP, e.iCGIPort),
						r = new Pt,
						s = {
							type: "GET",
							url: n,
							auth: e.szAuth,
							success: null,
							error: null
						};
					S.extend(s, t), S.extend(s, {
						success: function(e) {
							t.success && t.success(e)
						},
						error: function(e, n) {
							t.error && t.error(e, n)
						}
					}), r.setRequestParam(s), r.submitRequest()
				}, It.prototype.getSecurityVersion = function(e, t) {
					var n = F(this.CGI.getSecurityVersion, e.szHttpProtocol, e.szIP, e.iCGIPort),
						r = new Pt,
						s = {
							type: "GET",
							url: n,
							auth: e.szAuth,
							success: null,
							error: null
						};
					S.extend(s, t), S.extend(s, {
						success: function(e) {
							t.success && t.success(e)
						},
						error: function(e, n) {
							t.error && t.error(e, n)
						}
					}), r.setRequestParam(s), r.submitRequest()
				}, It.prototype.getDeviceInfo = function(e, n) {
					var r = F(this.CGI.getDeviceInfo, e.szHttpProtocol, e.szIP, e.iCGIPort),
						s = new Pt,
						o = {
							type: "GET",
							url: r,
							auth: e.szAuth,
							success: null,
							error: null
						};
					S.extend(o, n), S.extend(o, {
						success: function(e) {
							var r = [];
							r.push("<DeviceInfo>"), r.push("<deviceName>" + S.escape(t.$XML(e).find("deviceName").eq(0).text()) + "</deviceName>"), r.push("<deviceID>" + t.$XML(e).find("deviceID").eq(0).text() + "</deviceID>"), r.push("<deviceType>" + t.$XML(e).find("deviceType").eq(0).text() + "</deviceType>"), r.push("<model>" + t.$XML(e).find("model").eq(0).text() + "</model>"), r.push("<serialNumber>" + t.$XML(e).find("serialNumber").eq(0).text() + "</serialNumber>"), r.push("<macAddress>" + t.$XML(e).find("macAddress").eq(0).text() + "</macAddress>"), r.push("<firmwareVersion>" + t.$XML(e).find("firmwareVersion").eq(0).text() + "</firmwareVersion>"), r.push("<firmwareReleasedDate>" + t.$XML(e).find("firmwareReleasedDate").eq(0).text() + "</firmwareReleasedDate>"), r.push("<encoderVersion>" + t.$XML(e).find("encoderVersion").eq(0).text() + "</encoderVersion>"), r.push("<encoderReleasedDate>" + t.$XML(e).find("encoderReleasedDate").eq(0).text() + "</encoderReleasedDate>"), r.push("</DeviceInfo>"), e = S.loadXML(r.join("")), n.success && n.success(e)
						},
						error: function(e, t) {
							n.error && n.error(e, t)
						}
					}), s.setRequestParam(o), s.submitRequest()
				}, It.prototype.getAnalogChannelInfo = function(e, n) {
					var r = F(this.CGI.getAnalogChannelInfo, e.szHttpProtocol, e.szIP, e.iCGIPort),
						s = new Pt,
						o = {
							type: "GET",
							url: r,
							auth: e.szAuth,
							success: null,
							error: null
						};
					S.extend(o, n), S.extend(o, {
						success: function(r) {
							var s = [];
							s.push("<VideoInputChannelList>");
							var o = t.$XML(r).find("VideoInputChannel", !0);
							e.iAnalogChannelNum = o.length;
							for (var i = 0, a = o.length; a > i; i++) {
								var u = o[i];
								s.push("<VideoInputChannel>"), s.push("<id>" + t.$XML(u).find("id").eq(0).text() + "</id>"), s.push("<inputPort>" + t.$XML(u).find("inputPort").eq(0).text() + "</inputPort>"), s.push("<name>" + S.escape(t.$XML(u).find("name").eq(0).text()) + "</name>"), s.push("<videoFormat>" + t.$XML(u).find("videoFormat").eq(0).text() + "</videoFormat>"), s.push("</VideoInputChannel>")
							}
							s.push("</VideoInputChannelList>"), r = S.loadXML(s.join("")), n.success && n.success(r)
						},
						error: function(e, t) {
							n.error && n.error(e, t)
						}
					}), s.setRequestParam(o), s.submitRequest()
				}, It.prototype.getDigitalChannel = function(e, n) {
					var r = F(this.CGI.getDigitalChannel, e.szHttpProtocol, e.szIP, e.iCGIPort),
						s = new Pt,
						o = {
							type: "GET",
							url: r,
							auth: e.szAuth,
							success: null,
							error: null
						};
					S.extend(o, n), S.extend(o, {
						success: function(e) {
							var r = [];
							r.push("<InputProxyChannelList>");
							for (var s = t.$XML(e).find("InputProxyChannel", !0), o = 0, i = s.length; i > o; o++) {
								var a = s[o];
								r.push("<InputProxyChannel>"), r.push("<id>" + t.$XML(a).find("id").eq(0).text() + "</id>"), r.push("<name>" + S.escape(t.$XML(a).find("name").eq(0).text()) + "</name>"), r.push("</InputProxyChannel>")
							}
							r.push("</InputProxyChannelList>"), e = S.loadXML(r.join("")), n.success && n.success(e)
						},
						error: function(e, t) {
							n.error && n.error(e, t)
						}
					}), s.setRequestParam(o), s.submitRequest()
				}, It.prototype.getDigitalChannelInfo = function(e, n) {
					var r = null,
						s = {};
					if (this.getDigitalChannel(e, {
							async: !1,
							success: function(e) {
								r = e;
								for (var n = t.$XML(r).find("InputProxyChannel", !0), o = 0, i = n.length; i > o; o++) {
									var a = n[o],
										u = t.$XML(a).find("id").eq(0).text(),
										c = t.$XML(a).find("name").eq(0).text();
									s[u] = c
								}
							},
							error: function(e, t) {
								n.error && n.error(e, t)
							}
						}), null !== r) {
						var o = F(this.CGI.getDigitalChannelInfo, e.szHttpProtocol, e.szIP, e.iCGIPort),
							i = new Pt,
							a = {
								type: "GET",
								url: o,
								auth: e.szAuth,
								success: null,
								error: null
							};
						S.extend(a, n), S.extend(a, {
							success: function(e) {
								var r = [];
								r.push("<InputProxyChannelStatusList>");
								for (var o = t.$XML(e).find("InputProxyChannelStatus", !0), i = 0, a = o.length; a > i; i++) {
									var u = o[i],
										c = t.$XML(u).find("id").eq(0).text();
									r.push("<InputProxyChannelStatus>"), r.push("<id>" + c + "</id>"), r.push("<sourceInputPortDescriptor>"), r.push("<proxyProtocol>" + t.$XML(u).find("proxyProtocol").eq(0).text() + "</proxyProtocol>"), r.push("<addressingFormatType>" + t.$XML(u).find("addressingFormatType").eq(0).text() + "</addressingFormatType>"), r.push("<ipAddress>" + t.$XML(u).find("ipAddress").eq(0).text() + "</ipAddress>"), r.push("<managePortNo>" + t.$XML(u).find("managePortNo").eq(0).text() + "</managePortNo>"), r.push("<srcInputPort>" + t.$XML(u).find("srcInputPort").eq(0).text() + "</srcInputPort>"), r.push("<userName>" + S.escape(t.$XML(u).find("userName").eq(0).text()) + "</userName>"), r.push("<streamType>" + t.$XML(u).find("streamType").eq(0).text() + "</streamType>"), r.push("<online>" + t.$XML(u).find("online").eq(0).text() + "</online>"), r.push("<name>" + S.escape(s[c]) + "</name>"), r.push("</sourceInputPortDescriptor>"), r.push("</InputProxyChannelStatus>")
								}
								r.push("</InputProxyChannelStatusList>"), e = S.loadXML(r.join("")), n.success && n.success(e)
							},
							error: function(e, t) {
								n.error && n.error(e, t)
							}
						}), i.setRequestParam(a), i.submitRequest()
					}
				}, It.prototype.getZeroChannelInfo = function(e, t) {
					var n = F(this.CGI.getZeroChannelInfo, e.szHttpProtocol, e.szIP, e.iCGIPort),
						r = new Pt,
						s = {
							type: "GET",
							url: n,
							auth: e.szAuth,
							success: null,
							error: null
						};
					S.extend(s, t), S.extend(s, {
						success: function(e) {
							t.success && t.success(e)
						},
						error: function(e, n) {
							t.error && t.error(e, n)
						}
					}), r.setRequestParam(s), r.submitRequest()
				}, It.prototype.getStreamChannels = function(e, t) {
					if (0 != e.iAnalogChannelNum) var n = F(this.CGI.getStreamChannels.analog, e.szHttpProtocol, e.szIP, e.iCGIPort);
					else var n = F(this.CGI.getStreamChannels.digital, e.szHttpProtocol, e.szIP, e.iCGIPort);
					var r = new Pt,
						s = {
							type: "GET",
							url: n,
							auth: e.szAuth,
							success: null,
							error: null
						};
					S.extend(s, t), S.extend(s, {
						success: function(e) {
							t.success && t.success(e)
						},
						error: function(e, n) {
							t.error && t.error(e, n)
						}
					}), r.setRequestParam(s), r.submitRequest()
				}, It.prototype.getPPPoEStatus = function(e, t) {
					var n = F(this.CGI.getPPPoEStatus, e.szHttpProtocol, e.szIP, e.iCGIPort),
						r = new Pt,
						s = {
							type: "GET",
							url: n,
							auth: e.szAuth,
							success: null,
							error: null
						};
					S.extend(s, t), S.extend(s, {
						success: function(e) {
							t.success && t.success(e)
						},
						error: function(e, n) {
							t.error && t.error(e, n)
						}
					}), r.setRequestParam(s), r.submitRequest()
				}, It.prototype.getUPnPPortStatus = function(e, t) {
					var n = F(this.CGI.getUPnPPortStatus, e.szHttpProtocol, e.szIP, e.iCGIPort),
						r = new Pt,
						s = {
							type: "GET",
							url: n,
							auth: e.szAuth,
							success: null,
							error: null
						};
					S.extend(s, t), S.extend(s, {
						success: function(e) {
							t.success && t.success(e)
						},
						error: function(e, n) {
							t.error && t.error(e, n)
						}
					}), r.setRequestParam(s), r.submitRequest()
				}, It.prototype.getNetworkBond = function(e, t) {
					var n = F(this.CGI.getNetworkBond, e.szHttpProtocol, e.szIP, e.iCGIPort),
						r = new Pt,
						s = {
							type: "GET",
							url: n,
							auth: e.szAuth,
							success: null,
							error: null
						};
					S.extend(s, t), S.extend(s, {
						success: function(e) {
							t.success && t.success(e)
						},
						error: function(e, n) {
							t.error && t.error(e, n)
						}
					}), r.setRequestParam(s), r.submitRequest()
				}, It.prototype.getNetworkInterface = function(e, t) {
					var n = F(this.CGI.getNetworkInterface, e.szHttpProtocol, e.szIP, e.iCGIPort),
						r = new Pt,
						s = {
							type: "GET",
							url: n,
							auth: e.szAuth,
							success: null,
							error: null
						};
					S.extend(s, t), S.extend(s, {
						success: function(e) {
							t.success && t.success(e)
						},
						error: function(e, n) {
							t.error && t.error(e, n)
						}
					}), r.setRequestParam(s), r.submitRequest()
				}, It.prototype.getPortInfo = function(e, t) {
					var n = F(this.CGI.getPortInfo, e.szHttpProtocol, e.szIP, e.iCGIPort),
						r = new Pt,
						s = {
							type: "GET",
							url: n,
							auth: e.szAuth,
							success: null,
							error: null
						};
					S.extend(s, t), S.extend(s, {
						success: function(e) {
							t.success && t.success(e)
						},
						error: function(e, n) {
							t.error && t.error(e, n)
						}
					}), r.setRequestParam(s), r.submitRequest()
				}, It.prototype.startRealPlay = function(e, t) {
					var n = 100 * t.iChannelID + t.iStreamType,
						r = "",
						s = -1,
						o = e.szIP;
					if ("rtsp://" === t.urlProtocol && (o = V(o)), t.bZeroChannel ? (ct() && (n = 0), r = F(t.cgi.zeroChannels, t.urlProtocol, o, t.iPort, n)) : r = F(t.cgi.channels, t.urlProtocol, o, t.iPort, n), d.proxyAddress && ct()) {
						S.cookie("webVideoCtrlProxy", o + ":" + t.iPort, {
							raw: !0
						}), r = F(t.cgi.zeroChannels, t.urlProtocol, d.proxyAddress.ip, d.proxyAddress.port, n);
						var i = o + ":" + t.iPort;
						r += r.indexOf("?") > -1 ? "&deviceIdentify=" + i : "?deviceIdentify=" + i
					}
					var a = function() {
							var n = new ht;
							n.iIndex = t.iWndIndex, n.szIP = e.szIP, n.iCGIPort = e.iCGIPort, n.szDeviceIdentify = e.szDeviceIdentify, n.iChannelID = t.iChannelID, n.iPlayStatus = T, I.push(n)
						},
						u = $.Deferred();
					if (ct()) {
						var c = {
							sessionID: e.szAuth,
							token: O(e, e.szDeviceIdentify)
						};
						r = dt(r), p.JS_Play(r, c, t.iWndIndex).then(function() {
							a(), u.resolve()
						}, function() {
							u.reject()
						})
					} else s = p.HWP_Play(r, e.szAuth, t.iWndIndex, "", ""), 0 == s ? (a(), u.resolve()) : u.reject();
					return u
				}, It.prototype.startVoiceTalk = function(e, t) {
					var n = F(this.CGI.startVoiceTalk.open, e.szHttpProtocol, e.szIP, e.iCGIPort, t),
						r = F(this.CGI.startVoiceTalk.close, e.szHttpProtocol, e.szIP, e.iCGIPort, t),
						s = F(this.CGI.startVoiceTalk.audioData, e.szHttpProtocol, e.szIP, e.iCGIPort, t),
						o = p.HWP_StartVoiceTalkEx(n, r, s, e.szAuth, e.iAudioType, e.m_iAudioBitRate, e.m_iAudioSamplingRate);
					return o
				}, It.prototype.ptzAutoControl = function(e, t, n, r) {
					var s = n.iChannelID,
						o = "",
						i = "";
					if (r.iPTZSpeed = r.iPTZSpeed < 7 ? 15 * r.iPTZSpeed : 100, t && (r.iPTZSpeed = 0), e.szDeviceType != E) o = s <= e.iAnalogChannelNum ? F(this.CGI.ptzAutoControl.analog, e.szHttpProtocol, e.szIP, e.iCGIPort, n.iChannelID) : n.bShttpIPChannel ? F(this.CGI.ptzAutoControl.digital, e.szHttpProtocol, e.szIP, e.iCGIPort, n.iChannelID - e.oStreamCapa.iIpChanBase + 1 + e.iAnalogChannelNum) : F(this.CGI.ptzAutoControl.digital, e.szHttpProtocol, e.szIP, e.iCGIPort, n.iChannelID), i = "<?xml version='1.0' encoding='UTF-8'?><autoPanData><autoPan>" + r.iPTZSpeed + "</autoPan>" + "</autoPanData>";
					else {
						0 === r.iPTZSpeed && (t = !0);
						var a = 99;
						t && (a = 96), o = F(this.CGI.ptzAutoControl.ipdome, e.szHttpProtocol, e.szIP, e.iCGIPort, n.iChannelID, a)
					}
					var u = new Pt,
						c = {
							type: "PUT",
							url: o,
							async: !1,
							auth: e.szAuth,
							data: i,
							success: null,
							error: null
						},
						l = this;
					S.extend(c, r), S.extend(c, {
						success: function(e) {
							n.bPTZAuto = !n.bPTZAuto, r.success && r.success(e)
						},
						error: function(t, s) {
							if (k == e.szDeviceType || Z == e.szDeviceType) {
								o = n.bShttpIPChannel ? F(l.CGI.ptzControl.analog, e.szHttpProtocol, e.szIP, e.iCGIPort, n.iChannelID - e.oStreamCapa.iIpChanBase + 1 + e.iAnalogChannelNum) : F(l.CGI.ptzControl.analog, e.szHttpProtocol, e.szIP, e.iCGIPort, n.iChannelID), i = "<?xml version='1.0' encoding='UTF-8'?><PTZData><pan>" + r.iPTZSpeed + "</pan>" + "<tilt>" + 0 + "</tilt>" + "</PTZData>";
								var a = new Pt,
									u = {
										type: "PUT",
										url: o,
										async: !1,
										auth: e.szAuth,
										data: i,
										success: null,
										error: null
									};
								S.extend(u, r), a.setRequestParam(u), a.submitRequest()
							} else r.error && r.error(t, s)
						}
					}), u.setRequestParam(c), u.submitRequest()
				}, It.prototype.ptzControl = function(e, t, n, r) {
					var s = n.iChannelID,
						o = "";
					n.bPTZAuto && this.ptzAutoControl(e, !0, n, {
						iPTZSpeed: 0
					}), r.iPTZSpeed = t ? 0 : r.iPTZSpeed < 7 ? 15 * r.iPTZSpeed : 100;
					var i = [{}, {
							pan: 0,
							tilt: r.iPTZSpeed
						}, {
							pan: 0,
							tilt: -r.iPTZSpeed
						}, {
							pan: -r.iPTZSpeed,
							tilt: 0
						}, {
							pan: r.iPTZSpeed,
							tilt: 0
						}, {
							pan: -r.iPTZSpeed,
							tilt: r.iPTZSpeed
						}, {
							pan: -r.iPTZSpeed,
							tilt: -r.iPTZSpeed
						}, {
							pan: r.iPTZSpeed,
							tilt: r.iPTZSpeed
						}, {
							pan: r.iPTZSpeed,
							tilt: -r.iPTZSpeed
						}, {}, {
							speed: r.iPTZSpeed
						}, {
							speed: -r.iPTZSpeed
						}, {
							speed: r.iPTZSpeed
						}, {
							speed: -r.iPTZSpeed
						}, {
							speed: r.iPTZSpeed
						}, {
							speed: -r.iPTZSpeed
						}],
						a = "",
						u = {};
					switch (r.iPTZIndex) {
						case 1:
						case 2:
						case 3:
						case 4:
						case 5:
						case 6:
						case 7:
						case 8:
							u = this.CGI.ptzControl, a = "<?xml version='1.0' encoding='UTF-8'?><PTZData><pan>" + i[r.iPTZIndex].pan + "</pan>" + "<tilt>" + i[r.iPTZIndex].tilt + "</tilt>" + "</PTZData>";
							break;
						case 10:
						case 11:
							u = this.CGI.ptzControl, a = "<?xml version='1.0' encoding='UTF-8'?><PTZData><zoom>" + i[r.iPTZIndex].speed + "</zoom>" + "</PTZData>";
							break;
						case 12:
						case 13:
							u = this.CGI.ptzFocus, a = "<?xml version='1.0' encoding='UTF-8'?><FocusData><focus>" + i[r.iPTZIndex].speed + "</focus>" + "</FocusData>";
							break;
						case 14:
						case 15:
							u = this.CGI.ptzIris, a = "<?xml version='1.0' encoding='UTF-8'?><IrisData><iris>" + i[r.iPTZIndex].speed + "</iris>" + "</IrisData>";
							break;
						default:
							return r.error && r.error(), void 0
					}
					o = u != this.CGI.ptzFocus && u != this.CGI.ptzIris || e.szDeviceType != k && e.szDeviceType != E && e.szDeviceType != Z ? s <= e.iAnalogChannelNum ? F(u.analog, e.szHttpProtocol, e.szIP, e.iCGIPort, n.iChannelID) : n.bShttpIPChannel ? F(u.digital, e.szHttpProtocol, e.szIP, e.iCGIPort, n.iChannelID - e.oStreamCapa.iIpChanBase + 1 + e.iAnalogChannelNum) : F(u.digital, e.szHttpProtocol, e.szIP, e.iCGIPort, n.iChannelID) : F(u.ipc, e.szHttpProtocol, e.szIP, e.iCGIPort, n.iChannelID);
					var c = new Pt,
						l = {
							type: "PUT",
							url: o,
							async: !1,
							auth: e.szAuth,
							data: a,
							success: null,
							error: null
						};
					S.extend(l, r), S.extend(l, {
						success: function(e) {
							r.success && r.success(e)
						},
						error: function(e, t) {
							r.error && r.error(e, t)
						}
					}), c.setRequestParam(l), c.submitRequest()
				}, It.prototype.setPreset = function(e, t, n) {
					var r = t.iChannelID,
						s = "",
						o = "";
					s = r <= e.iAnalogChannelNum ? F(this.CGI.setPreset.analog, e.szHttpProtocol, e.szIP, e.iCGIPort, t.iChannelID, n.iPresetID) : t.bShttpIPChannel ? F(this.CGI.setPreset.digital, e.szHttpProtocol, e.szIP, e.iCGIPort, t.iChannelID - e.oStreamCapa.iIpChanBase + 1 + e.iAnalogChannelNum, n.iPresetID) : F(this.CGI.setPreset.digital, e.szHttpProtocol, e.szIP, e.iCGIPort, t.iChannelID, n.iPresetID), o = "<?xml version='1.0' encoding='UTF-8'?>", o += "<PTZPreset>", o += "<id>" + n.iPresetID + "</id>", e.szDeviceType != E && (o += "<presetName>Preset" + n.iPresetID + "</presetName>"), o += "</PTZPreset>";
					var i = new Pt,
						a = {
							type: "PUT",
							url: s,
							auth: e.szAuth,
							data: o,
							success: null,
							error: null
						};
					S.extend(a, n), S.extend(a, {
						success: function(e) {
							n.success && n.success(e)
						},
						error: function(e, t) {
							n.error && n.error(e, t)
						}
					}), i.setRequestParam(a), i.submitRequest()
				}, It.prototype.goPreset = function(e, t, n) {
					var r = t.iChannelID,
						s = "";
					s = r <= e.iAnalogChannelNum ? F(this.CGI.goPreset.analog, e.szHttpProtocol, e.szIP, e.iCGIPort, t.iChannelID, n.iPresetID) : t.bShttpIPChannel ? F(this.CGI.goPreset.digital, e.szHttpProtocol, e.szIP, e.iCGIPort, t.iChannelID - e.oStreamCapa.iIpChanBase + 1 + e.iAnalogChannelNum, n.iPresetID) : F(this.CGI.goPreset.digital, e.szHttpProtocol, e.szIP, e.iCGIPort, t.iChannelID, n.iPresetID);
					var o = new Pt,
						i = {
							type: "PUT",
							url: s,
							auth: e.szAuth,
							success: null,
							error: null
						};
					S.extend(i, n), S.extend(i, {
						success: function(e) {
							n.success && n.success(e)
						},
						error: function(e, t) {
							n.error && n.error(e, t)
						}
					}), o.setRequestParam(i), o.submitRequest()
				}, It.prototype.overlayInfo = function() {
					return szUrl = this.CGI.overlayInfo.analog
				}, It.prototype.recordSearch = function(e, n) {
					var r = "",
						s = "",
						i = n.iChannelID,
						a = n.iStreamType,
						u = n.szStartTime.replace(" ", "T") + "Z",
						c = n.szEndTime.replace(" ", "T") + "Z";
					r = F(this.CGI.recordSearch, e.szHttpProtocol, e.szIP, e.iCGIPort), s = "<?xml version='1.0' encoding='UTF-8'?><CMSearchDescription><searchID>" + new o + "</searchID>" + "<trackList><trackID>" + (100 * i + a) + "</trackID></trackList>" + "<timeSpanList>" + "<timeSpan>" + "<startTime>" + u + "</startTime>" + "<endTime>" + c + "</endTime>" + "</timeSpan>" + "</timeSpanList>" + "<maxResults>40</maxResults>" + "<searchResultPostion>" + n.iSearchPos + "</searchResultPostion>" + "<metadataList>" + "<metadataDescriptor>//metadata.ISAPI.org/VideoMotion</metadataDescriptor>" + "</metadataList>" + "</CMSearchDescription>";
					var l = new Pt,
						d = {
							type: "POST",
							url: r,
							auth: e.szAuth,
							data: s,
							success: null,
							error: null
						};
					S.extend(d, n), S.extend(d, {
						success: function(e) {
							var r = [];
							r.push("<CMSearchResult>"), r.push("<responseStatus>" + t.$XML(e).find("responseStatus").eq(0).text() + "</responseStatus>"), r.push("<responseStatusStrg>" + t.$XML(e).find("responseStatusStrg").eq(0).text() + "</responseStatusStrg>"), r.push("<numOfMatches>" + t.$XML(e).find("numOfMatches").eq(0).text() + "</numOfMatches>"), r.push("<matchList>");
							for (var s = t.$XML(e).find("searchMatchItem", !0), o = 0, i = s.length; i > o; o++) {
								var a = s[o];
								r.push("<searchMatchItem>"), r.push("<trackID>" + t.$XML(a).find("trackID").eq(0).text() + "</trackID>"), r.push("<startTime>" + t.$XML(a).find("startTime").eq(0).text() + "</startTime>"), r.push("<endTime>" + t.$XML(a).find("endTime").eq(0).text() + "</endTime>"), r.push("<playbackURI>" + S.escape(t.$XML(a).find("playbackURI").eq(0).text()) + "</playbackURI>"), r.push("<metadataDescriptor>" + t.$XML(a).find("metadataDescriptor").eq(0).text().split("/")[1] + "</metadataDescriptor>"), r.push("</searchMatchItem>")
							}
							r.push("</matchList>"), r.push("</CMSearchResult>"), e = S.loadXML(r.join("")), n.success && n.success(e)
						},
						error: function(e, t) {
							n.error && n.error(e, t)
						}
					}), l.setRequestParam(d), l.submitRequest()
				}, It.prototype.startPlayback = function(e, t) {
					var n = t.iWndIndex,
						r = "",
						s = t.szStartTime,
						o = t.szEndTime,
						i = e.szIP;
					if ("rtsp://" === t.urlProtocol && (i = V(i)), ct())
						if (d.proxyAddress) {
							S.cookie("webVideoCtrlProxy", i + ":" + t.iPort, {
								raw: !0
							}), r = F(t.cgi, t.urlProtocol, d.proxyAddress.ip, d.proxyAddress.port, t.iChannelID);
							var a = i + ":" + t.iPort;
							r += r.indexOf("?") > -1 ? "&deviceIdentify=" + a : "?deviceIdentify=" + a
						} else r = F(t.cgi, t.urlProtocol, i, t.iPort, t.iChannelID, s, o);
					else r = F(t.cgi, t.urlProtocol, i, t.iPort, t.iChannelID, s, o);
					if (!U(t.oTransCodeParam)) {
						var u = ut(t.oTransCodeParam);
						if ("" == u) return -1;
						p.HWP_SetTrsPlayBackParam(n, u)
					}
					var c = function() {
							var r = new ht;
							r.iIndex = n, r.szIP = e.szIP, r.iCGIPort = e.iCGIPort, r.szDeviceIdentify = e.szDeviceIdentify, r.iChannelID = t.iChannelID, r.iPlayStatus = A, I.push(r)
						},
						l = $.Deferred();
					if (ct()) {
						var f = {
							sessionID: e.szAuth,
							token: O(e, e.szDeviceIdentify)
						};
						p.JS_Play(r, f, n, s, o).then(function() {
							c(), l.resolve()
						}, function() {
							l.reject()
						})
					} else {
						var h = p.HWP_Play(r, e.szAuth, n, s, o);
						0 == h ? (c(), l.resolve()) : l.reject()
					}
					return l
				}, It.prototype.reversePlayback = function(e, t) {
					var n = t.iWndIndex,
						r = t.szStartTime,
						s = t.szEndTime,
						o = e.szIP;
					"rtsp://" === t.urlProtocol && (o = V(o));
					var i = F(t.cgi, t.urlProtocol, o, t.iPort, t.iChannelID, r, s),
						a = p.HWP_ReversePlay(i, e.szAuth, n, r, s);
					if (0 == a) {
						var u = new ht;
						u.iIndex = n, u.szIP = e.szIP, u.iCGIPort = e.iCGIPort, u.szDeviceIdentify = e.szDeviceIdentify, u.iChannelID = t.iChannelID, u.iPlayStatus = q, I.push(u)
					}
					return a
				}, It.prototype.startDownloadRecord = function(e, t) {
					var n = -1,
						r = F(this.CGI.startDownloadRecord, e.szHttpProtocol, e.szIP, e.iCGIPort),
						s = "<?xml version='1.0' encoding='UTF-8'?><downloadRequest><playbackURI> " + S.escape(t.szPlaybackURI) + "</playbackURI>" + "</downloadRequest>";
					return ct() ? (r = lt(r), n = p.JS_StartDownload(r, e.szAuth, t.szFileName, s)) : n = p.HWP_StartDownload(r, e.szAuth, t.szFileName, s, t.bDateDir), n
				}, It.prototype.exportDeviceConfig = function(e, t) {
					var n = F(this.CGI.downloaddeviceConfig, e.szHttpProtocol, e.szIP, e.iCGIPort);
					if (ct()) {
						var r = {
								type: "PUT",
								url: n,
								auth: e.szAuth,
								success: function() {},
								error: function() {}
							},
							s = new Pt;
						return s.setRequestParam(r), s.submitRequest(), n = lt(n), t && (n = S.exportPasswordDeviceConfig(n, t)), p.JS_ExportDeviceConfig(n)
					}
					return t && (n = S.exportPasswordDeviceConfig(n, t)), p.HWP_ExportDeviceConfig(n, e.szAuth, "", 0)
				}, It.prototype.importDeviceConfig = function(e, t, n) {
					var r = F(this.CGI.uploaddeviceConfig, e.szHttpProtocol, e.szIP, e.iCGIPort);
					if (ct()) {
						var s = {
								type: "PUT",
								url: r,
								auth: e.szAuth,
								success: function() {},
								error: function() {}
							},
							o = new Pt;
						return o.setRequestParam(s), o.submitRequest(), r = lt(r), n && (r = S.exportPasswordDeviceConfig(r, n)), p.JS_UploadFile(r)
					}
					return n && (r = S.exportPasswordDeviceConfig(r, n)), p.HWP_ImportDeviceConfig(r, e.szAuth, t.szFileName, 0)
				}, It.prototype.restart = function(e, t) {
					var n = F(this.CGI.restart, e.szHttpProtocol, e.szIP, e.iCGIPort),
						r = new Pt,
						s = {
							type: "PUT",
							url: n,
							auth: e.szAuth,
							success: null,
							error: null
						};
					S.extend(s, t), S.extend(s, {
						success: function(e) {
							t.success && t.success(e)
						},
						error: function(e, n) {
							t.error && t.error(e, n)
						}
					}), r.setRequestParam(s), r.submitRequest()
				}, It.prototype.restore = function(e, t, n) {
					var r = F(this.CGI.restore, e.szHttpProtocol, e.szIP, e.iCGIPort, t),
						s = new Pt,
						o = {
							type: "PUT",
							url: r,
							auth: e.szAuth,
							success: null,
							error: null
						};
					S.extend(o, n), S.extend(o, {
						success: function(e) {
							n.success && n.success(e)
						},
						error: function(e, t) {
							n.error && n.error(e, t)
						}
					}), s.setRequestParam(o), s.submitRequest()
				}, It.prototype.startUpgrade = function(e, t) {
					$.Deferred();
					var n = F(this.CGI.startUpgrade.upgrade, e.szHttpProtocol, e.szIP, e.iCGIPort),
						r = F(this.CGI.startUpgrade.status, e.szHttpProtocol, e.szIP, e.iCGIPort);
					return szRet = p.HWP_StartUpgrade(n, r, e.szAuth, t.szFileName)
				}, It.prototype.asyncstartUpgrade = function(e, t) {
					var n = $.Deferred(),
						r = F(this.CGI.startUpgrade.upgrade, e.szHttpProtocol, e.szIP, e.iCGIPort),
						s = F(this.CGI.startUpgrade.status, e.szHttpProtocol, e.szIP, e.iCGIPort);
					if (ct()) r = lt(r), s = lt(s), p.JS_StartUpgradeEx(r, s).then(function(e) {
						n.resolve(e)
					}, function() {
						n.reject(o)
					});
					else {
						var o = p.HWP_StartUpgrade(r, s, e.szAuth, t.szFileName);
						0 === o ? n.resolve(o) : n.reject(o)
					}
					return n
				}, It.prototype.set3DZoom = function(e, n, r, s) {
					var o = n.iChannelID,
						i = "";
					if (i = o <= e.iAnalogChannelNum ? F(this.CGI.set3DZoom.analog, e.szHttpProtocol, e.szIP, e.iCGIPort, n.iChannelID) : n.bShttpIPChannel ? F(this.CGI.set3DZoom.digital, e.szHttpProtocol, e.szIP, e.iCGIPort, n.iChannelID - e.oStreamCapa.iIpChanBase + 1 + e.iAnalogChannelNum) : F(this.CGI.set3DZoom.digital, e.szHttpProtocol, e.szIP, e.iCGIPort, n.iChannelID), ct()) var c = S.loadXML(r),
						l = parseInt(255 * (r.startPos[0] / a), 10),
						d = parseInt(255 * (r.startPos[1] / u), 10),
						p = parseInt(255 * (r.endPos[0] / a), 10),
						f = parseInt(255 * (r.endPos[1] / u), 10);
					else var c = S.loadXML(r),
						l = parseInt(t.$XML(c).find("StartPoint").eq(0).find("positionX").eq(0).text(), 10),
						d = parseInt(t.$XML(c).find("StartPoint").eq(0).find("positionY").eq(0).text(), 10),
						p = parseInt(t.$XML(c).find("EndPoint").eq(0).find("positionX").eq(0).text(), 10),
						f = parseInt(t.$XML(c).find("EndPoint").eq(0).find("positionY").eq(0).text(), 10);
					var h = "<?xml version='1.0' encoding='UTF-8'?><Position3D><StartPoint><positionX>" + l + "</positionX>" + "<positionY>" + (255 - d) + "</positionY>" + "</StartPoint>" + "<EndPoint>" + "<positionX>" + p + "</positionX>" + "<positionY>" + (255 - f) + "</positionY>" + "</EndPoint>" + "</Position3D>",
						P = new Pt,
						I = {
							type: "PUT",
							url: i,
							data: h,
							auth: e.szAuth,
							success: null,
							error: null
						};
					S.extend(I, s), S.extend(I, {
						success: function(e) {
							s.success && s.success(e)
						},
						error: function(e, t) {
							s.error && s.error(e, t)
						}
					}), P.setRequestParam(I), P.submitRequest()
				}, It.prototype.getSDKCapa = function(e, t) {
					var n = F(this.CGI.SDKCapabilities, e.szHttpProtocol, e.szIP, e.iCGIPort),
						r = new Pt,
						s = {
							type: "GET",
							url: n,
							async: !1,
							auth: e.szAuth,
							success: null,
							error: null
						};
					S.extend(s, t), S.extend(s, {
						success: function(e) {
							t.success && t.success(e)
						},
						error: function(e, n) {
							t.error && t.error(e, n)
						}
					}), r.setRequestParam(s), r.submitRequest()
				}, It.prototype.deviceCapturePic = function(e, t, n, r) {
					var t = 100 * t + 1,
						s = -1,
						o = F(this.CGI.deviceCapture.channels, e.szHttpProtocol, e.szIP, e.iCGIPort, t),
						i = [];
					if (S.isInt(r.iResolutionWidth) && i.push("videoResolutionWidth=" + r.iResolutionWidth), S.isInt(r.iResolutionHeight) && i.push("videoResolutionHeight=" + r.iResolutionHeight), i.length > 0 && (o += "?" + i.join("&")), ct()) {
						var a = function(e, t) {
							var n = ".jpg";
							return $("body").append('<a id="jsplugin_download_a" href="' + e + '" download=' + t + n + '><li id="jsplugin_download_li"></li></a>'), $("#jsplugin_download_li").trigger("click"), $("#jsplugin_download_a").remove(), 0
						};
						o = lt(o), s = a(o, n)
					} else s = p.HWP_DeviceCapturePic(o, e.szAuth, n, r.bDateDir);
					return s
				}, It.prototype.getSessionV2Cap = function(e, t, n, r, s, o) {
					var i = "";
					i = 2 == n ? "https://" : "http://";
					var a = F(this.CGI.sessionCap, i, t, r, encodeURIComponent(s));
					a = a + "&random:" + e;
					var u = new Pt,
						c = {
							type: "GET",
							url: a,
							auth: "",
							success: null,
							error: null
						};
					S.extend(c, o), S.extend(c, {
						success: function(e) {
							o.success && o.success(e)
						},
						error: function(e, t) {
							o.error && o.error(e, t)
						}
					}), u.setRequestParam(c), u.submitRequest()
				}, It.prototype.getSessionCap = function(e, t, n, r, s) {
					var o = "";
					o = 2 == t ? "https://" : "http://";
					var i = F(this.CGI.sessionCap, o, e, n, encodeURIComponent(r)),
						a = new Pt,
						u = {
							type: "GET",
							url: i,
							auth: "",
							success: null,
							error: null
						};
					S.extend(u, s), S.extend(u, {
						success: function(e) {
							s.success && s.success(e)
						},
						error: function(e, t) {
							s.error && s.error(e, t)
						}
					}), a.setRequestParam(u), a.submitRequest()
				}, It.prototype.sessionV2Login = function(e, n, r, s, o, i, a, u) {
					var c = "";
					c = 2 == r ? "https://" : "http://";
					var l = parseInt(t.$XML(a).find("sessionIDVersion").eq(0).text(), 10),
						d = "true" === t.$XML(a).find("isSessionIDValidLongTerm").eq(0).text(),
						p = F(this.CGI.sessionLogin, c, n, s),
						f = t.$XML(a).find("sessionID").eq(0).text(),
						h = t.$XML(a).find("challenge").eq(0).text(),
						P = parseInt(t.$XML(a).find("iterations").eq(0).text(), 10),
						I = !1,
						m = "";
					t.$XML(a).find("isIrreversible", !0).length > 0 && (I = "true" === t.$XML(a).find("isIrreversible").eq(0).text(), m = t.$XML(a).find("salt").eq(0).text()), this.m_oInfoForLocalPlgin = {
						szRandom: e,
						sessionID: f,
						iterations: P,
						challenge: h,
						user: o
					};
					var v = S.encodePwd(i, {
							challenge: h,
							userName: o,
							salt: m,
							iIterate: P
						}, I),
						C = "<SessionLogin>";
					C += "<userName>" + S.escape(o) + "</userName>", C += "<password>" + v + "</password>", C += "<sessionID>" + f + "</sessionID>", C += "<isSessionIDValidLongTerm>" + d + "</isSessionIDValidLongTerm>", C += "<sessionIDVersion>" + l + "</sessionIDVersion>", C += "</SessionLogin>";
					var y = new Pt,
						g = {
							type: "POST",
							url: p,
							data: C,
							auth: "",
							success: null,
							error: null
						};
					S.extend(g, u), S.extend(g, {
						success: function(e) {
							u.success && u.success(e)
						},
						error: function(e, t) {
							u.error && u.error(e, t)
						}
					}), y.setRequestParam(g), y.submitRequest()
				}, It.prototype.sessionLogin = function(e, n, r, s, o, i, a) {
					var u = "";
					u = 2 == n ? "https://" : "http://";
					var c = F(this.CGI.sessionLogin, u, e, r),
						l = t.$XML(i).find("sessionID").eq(0).text(),
						d = t.$XML(i).find("challenge").eq(0).text(),
						p = parseInt(t.$XML(i).find("iterations").eq(0).text(), 10),
						f = !1,
						h = "";
					t.$XML(i).find("isIrreversible", !0).length > 0 && (f = "true" === t.$XML(i).find("isIrreversible").eq(0).text(), h = t.$XML(i).find("salt").eq(0).text());
					var P = "";
					if (f) {
						P = S.sha256(s + h + o), P = S.sha256(P + d);
						for (var I = 2; p > I; I++) P = S.sha256(P)
					} else {
						P = S.sha256(o) + d;
						for (var I = 1; p > I; I++) P = S.sha256(P)
					}
					var m = "<SessionLogin>";
					m += "<userName>" + S.escape(s) + "</userName>", m += "<password>" + P + "</password>", m += "<sessionID>" + l + "</sessionID>", m += "</SessionLogin>";
					var v = new Pt,
						C = {
							type: "POST",
							url: c,
							data: m,
							auth: "",
							success: null,
							error: null
						};
					S.extend(C, a), S.extend(C, {
						success: function(e) {
							a.success && a.success(e)
						},
						error: function(e, t) {
							a.error && a.error(e, t)
						}
					}), v.setRequestParam(C), v.submitRequest()
				}, It.prototype.sessionHeartbeat = function(e, t, n) {
					var r = F(this.CGI.sessionHeartbeat, e.szHttpProtocol, e.szIP, e.iCGIPort),
						s = new Pt,
						o = {
							type: "PUT",
							url: r,
							auth: e.szAuth,
							success: null,
							error: null
						};
					S.extend(o, {
						success: function(e) {
							t && t(e)
						},
						error: function(e, t) {
							n && n(e, t)
						}
					}), s.setRequestParam(o), s.submitRequest()
				}, It.prototype.sessionLogout = function(e, t) {
					var n = F(this.CGI.sessionLogout, e.szHttpProtocol, e.szIP, e.iCGIPort),
						r = new Pt,
						s = {
							type: "PUT",
							url: n,
							auth: e.szAuth,
							success: null,
							error: null
						};
					S.extend(s, t), S.extend(s, {
						success: function(e) {
							t.success && t.success(e)
						},
						error: function(e, n) {
							t.error && t.error(e, n)
						}
					}), r.setRequestParam(s), r.submitRequest()
				}, It.prototype.getSystemCapa = function(e, t) {
					var n = F(this.CGI.systemCapabilities, e.szHttpProtocol, e.szIP, e.iCGIPort),
						r = new Pt,
						s = {
							type: "GET",
							url: n,
							async: !1,
							auth: e.szAuth,
							success: null,
							error: null
						};
					S.extend(s, t), S.extend(s, {
						success: function(e) {
							t.success && t.success(e)
						},
						error: function(e, n) {
							t.error && t.error(e, n)
						}
					}), r.setRequestParam(s), r.submitRequest()
				};
				var mt = function() {};
				mt.prototype.CGI = {
					login: "%s%s:%s/PSIA/Custom/SelfExt/userCheck",
					getAudioInfo: "%s%s:%s/PSIA/Custom/SelfExt/TwoWayAudio/channels",
					getDeviceInfo: "%s%s:%s/PSIA/System/deviceInfo",
					getAnalogChannelInfo: "%s%s:%s/PSIA/System/Video/inputs/channels",
					getDigitalChannel: "%s%s:%s/PSIA/Custom/SelfExt/ContentMgmt/DynVideo/inputs/channels",
					getDigitalChannelInfo: "%s%s:%s/PSIA/Custom/SelfExt/ContentMgmt/DynVideo/inputs/channels/status",
					getZeroChannelInfo: "%s%s:%s/PSIA/Custom/SelfExt/ContentMgmt/ZeroVideo/channels",
					getStreamChannels: {
						analog: "%s%s:%s/PSIA/Streaming/channels",
						digital: "%s%s:%s/PSIA/Custom/SelfExt/ContentMgmt/DynStreaming/channels"
					},
					getStreamDynChannels: "%s%s:%s/PSIA/Custom/SelfExt/ContentMgmt/DynStreaming/channels",
					startRealPlay: {
						channels: "%s%s:%s/PSIA/streaming/channels/%s",
						zeroChannels: "%s%s:%s/PSIA/Custom/SelfExt/ContentMgmt/ZeroStreaming/channels/%s"
					},
					startVoiceTalk: {
						open: "%s%s:%s/PSIA/Custom/SelfExt/TwoWayAudio/channels/%s/open",
						close: "%s%s:%s/PSIA/Custom/SelfExt/TwoWayAudio/channels/%s/close",
						audioData: "%s%s:%s/PSIA/Custom/SelfExt/TwoWayAudio/channels/%s/audioData"
					},
					ptzControl: "%s%s:%s/PSIA/PTZ/channels/%s/continuous",
					ptzAutoControl: "%s%s:%s/PSIA/Custom/SelfExt/PTZ/channels/%s/autoptz",
					setPreset: "%s%s:%s/PSIA/PTZ/channels/%s/presets/%s",
					goPreset: "%s%s:%s/PSIA/PTZ/channels/%s/presets/%s/goto",
					ptzFocus: "%s%s:%s/PSIA/System/Video/inputs/channels/%s/focus",
					ptzIris: "%s%s:%s/PSIA/System/Video/inputs/channels/%s/iris",
					getNetworkBond: "%s%s:%s/PSIA/Custom/SelfExt/Bond",
					getNetworkInterface: "%s%s:%s/PSIA/System/Network/interfaces",
					getUPnPPortStatus: "%s%s:%s/PSIA/Custom/SelfExt/UPnP/ports/status",
					getPPPoEStatus: "%s%s:%s/PSIA/Custom/SelfExt/PPPoE/1/status",
					getPortInfo: "%s%s:%s/PSIA/Security/AAA/adminAccesses",
					recordSearch: "%s%s:%s/PSIA/ContentMgmt/search",
					startPlayback: "%s%s:%s/PSIA/streaming/tracks/%s?starttime=%s&endtime=%s",
					startDownloadRecord: "%s%s:%s/PSIA/Custom/SelfExt/ContentMgmt/download",
					deviceConfig: "%s%s:%s/PSIA/System/configurationData",
					restart: "%s%s:%s/PSIA/System/reboot",
					restore: "%s%s:%s/PSIA/System/factoryReset?mode=%s",
					startUpgrade: {
						upgrade: "%s%s:%s/PSIA/System/updateFirmware",
						status: "%s%s:%s/PSIA/Custom/SelfExt/upgradeStatus"
					},
					set3DZoom: "%s%s:%s/PSIA/Custom/SelfExt/PTZ/channels/%s/Set3DZoom",
					deviceCapture: {
						channels: "%s%s:%s/PSIA/Streaming/channels/%s/picture"
					},
					systemCapabilities: "%s%s:%s/PSIA/System/capabilities"
				}, mt.prototype.login = function(e, n, r, s) {
					var o = 2 == s.protocol ? "https://" : "http://",
						i = F(this.CGI.login, o, e, n),
						a = new Pt,
						u = {
							type: "GET",
							url: i,
							auth: r,
							success: null,
							error: null
						};
					S.extend(u, s), S.extend(u, {
						success: function(e) {
							"200" == t.$XML(e).find("statusValue").eq(0).text() ? s.success && s.success(e) : s.error && s.error(401, e)
						},
						error: function(e, t) {
							s.error && s.error(e, t)
						}
					}), a.setRequestParam(u), a.submitRequest()
				}, mt.prototype.getAudioInfo = function(e, t) {
					var n = F(this.CGI.getAudioInfo, e.szHttpProtocol, e.szIP, e.iCGIPort),
						r = new Pt,
						s = {
							type: "GET",
							url: n,
							auth: e.szAuth,
							success: null,
							error: null
						};
					S.extend(s, t), S.extend(s, {
						success: function(e) {
							t.success && t.success(e)
						},
						error: function(e, n) {
							t.error && t.error(e, n)
						}
					}), r.setRequestParam(s), r.submitRequest()
				}, mt.prototype.getDeviceInfo = function(e, n) {
					var r = F(this.CGI.getDeviceInfo, e.szHttpProtocol, e.szIP, e.iCGIPort),
						s = new Pt,
						o = {
							type: "GET",
							url: r,
							auth: e.szAuth,
							success: null,
							error: null
						};
					S.extend(o, n), S.extend(o, {
						success: function(e) {
							var r = [];
							r.push("<DeviceInfo>"), r.push("<deviceName>" + S.escape(t.$XML(e).find("deviceName").eq(0).text()) + "</deviceName>"), r.push("<deviceID>" + t.$XML(e).find("deviceID").eq(0).text() + "</deviceID>"), r.push("<deviceType>" + t.$XML(e).find("deviceDescription").eq(0).text() + "</deviceType>"), r.push("<model>" + t.$XML(e).find("model").eq(0).text() + "</model>"), r.push("<serialNumber>" + t.$XML(e).find("serialNumber").eq(0).text() + "</serialNumber>"), r.push("<macAddress>" + t.$XML(e).find("macAddress").eq(0).text() + "</macAddress>"), r.push("<firmwareVersion>" + t.$XML(e).find("firmwareVersion").eq(0).text() + "</firmwareVersion>"), r.push("<firmwareReleasedDate>" + t.$XML(e).find("firmwareReleasedDate").eq(0).text() + "</firmwareReleasedDate>"), r.push("<encoderVersion>" + t.$XML(e).find("logicVersion").eq(0).text() + "</encoderVersion>"), r.push("<encoderReleasedDate>" + t.$XML(e).find("logicReleasedDate").eq(0).text() + "</encoderReleasedDate>"), r.push("</DeviceInfo>"), e = S.loadXML(r.join("")), n.success && n.success(e)
						},
						error: function(e, t) {
							n.error && n.error(e, t)
						}
					}), s.setRequestParam(o), s.submitRequest()
				}, mt.prototype.getSystemCapa = function(e, t) {
					var n = F(this.CGI.systemCapabilities, e.szHttpProtocol, e.szIP, e.iCGIPort),
						r = new Pt,
						s = {
							type: "GET",
							async: !1,
							url: n,
							auth: e.szAuth,
							success: null,
							error: null
						};
					S.extend(s, t), S.extend(s, {
						success: function(e) {
							t.success && t.success(e)
						},
						error: function(e, n) {
							t.error && t.error(e, n)
						}
					}), r.setRequestParam(s), r.submitRequest()
				}, mt.prototype.getAnalogChannelInfo = function(e, n) {
					var r = F(this.CGI.getAnalogChannelInfo, e.szHttpProtocol, e.szIP, e.iCGIPort),
						s = new Pt,
						o = {
							type: "GET",
							url: r,
							auth: e.szAuth,
							success: null,
							error: null
						};
					S.extend(o, n), S.extend(o, {
						success: function(e) {
							var r = [];
							r.push("<VideoInputChannelList>");
							for (var s = t.$XML(e).find("VideoInputChannel", !0), o = 0, i = s.length; i > o; o++) {
								var a = s[o];
								r.push("<VideoInputChannel>"), r.push("<id>" + t.$XML(a).find("id").eq(0).text() + "</id>"), r.push("<inputPort>" + t.$XML(a).find("inputPort").eq(0).text() + "</inputPort>"), r.push("<name>" + S.escape(t.$XML(a).find("name").eq(0).text()) + "</name>"), r.push("<videoFormat>" + t.$XML(a).find("videoFormat").eq(0).text() + "</videoFormat>"), r.push("</VideoInputChannel>")
							}
							r.push("</VideoInputChannelList>"), e = S.loadXML(r.join("")), n.success && n.success(e)
						},
						error: function(e, t) {
							n.error && n.error(e, t)
						}
					}), s.setRequestParam(o), s.submitRequest()
				}, mt.prototype.getDigitalChannel = function(e, n) {
					var r = F(this.CGI.getDigitalChannel, e.szHttpProtocol, e.szIP, e.iCGIPort),
						s = new Pt,
						o = {
							type: "GET",
							url: r,
							auth: e.szAuth,
							success: null,
							error: null
						};
					S.extend(o, n), S.extend(o, {
						success: function(e) {
							var r = [];
							r.push("<InputProxyChannelList>");
							for (var s = t.$XML(e).find("DynVideoInputChannel", !0), o = 0, i = s.length; i > o; o++) {
								var a = s[o];
								r.push("<InputProxyChannel>"), r.push("<id>" + t.$XML(a).find("id").eq(0).text() + "</id>"), r.push("<name>" + S.escape(t.$XML(a).find("name").eq(0).text()) + "</name>"), r.push("</InputProxyChannel>")
							}
							r.push("</InputProxyChannelList>"), e = S.loadXML(r.join("")), n.success && n.success(e)
						},
						error: function(e, t) {
							n.error && n.error(e, t)
						}
					}), s.setRequestParam(o), s.submitRequest()
				}, mt.prototype.getDigitalChannelInfo = function(e, n) {
					var r = null,
						s = {};
					if (this.getDigitalChannel(e, {
							async: !1,
							success: function(e) {
								r = e;
								for (var n = t.$XML(r).find("InputProxyChannel", !0), o = 0, i = n.length; i > o; o++) {
									var a = n[o],
										u = t.$XML(a).find("id").eq(0).text(),
										c = t.$XML(a).find("name").eq(0).text();
									s[u] = c
								}
							},
							error: function(e, t) {
								n.error && n.error(e, t)
							}
						}), null !== r) {
						var o = F(this.CGI.getDigitalChannelInfo, e.szHttpProtocol, e.szIP, e.iCGIPort),
							i = new Pt,
							a = {
								type: "GET",
								url: o,
								auth: e.szAuth,
								success: null,
								error: null
							};
						S.extend(a, n), S.extend(a, {
							success: function(e) {
								var r = [];
								r.push("<InputProxyChannelStatusList>");
								for (var o = t.$XML(e).find("DynVideoInputChannelStatus", !0), i = 0, a = o.length; a > i; i++) {
									var u = o[i],
										c = t.$XML(u).find("id").eq(0).text();
									r.push("<InputProxyChannelStatus>"), r.push("<id>" + c + "</id>"), r.push("<sourceInputPortDescriptor>"), r.push("<proxyProtocol>" + t.$XML(u).find("adminProtocol").eq(0).text() + "</proxyProtocol>"), r.push("<addressingFormatType>" + t.$XML(u).find("addressingFormatType").eq(0).text() + "</addressingFormatType>"), r.push("<ipAddress>" + t.$XML(u).find("ipAddress").eq(0).text() + "</ipAddress>"), r.push("<managePortNo>" + t.$XML(u).find("adminPortNo").eq(0).text() + "</managePortNo>"), r.push("<srcInputPort>" + t.$XML(u).find("srcInputPort").eq(0).text() + "</srcInputPort>"), r.push("<userName>" + S.escape(t.$XML(u).find("userName").eq(0).text()) + "</userName>"), r.push("<streamType>" + t.$XML(u).find("streamType").eq(0).text() + "</streamType>"), r.push("<online>" + t.$XML(u).find("online").eq(0).text() + "</online>"), r.push("<name>" + S.escape(s[c]) + "</name>"), r.push("</sourceInputPortDescriptor>"), r.push("</InputProxyChannelStatus>")
								}
								r.push("</InputProxyChannelStatusList>"), e = S.loadXML(r.join("")), n.success && n.success(e)
							},
							error: function(e, t) {
								n.error && n.error(e, t)
							}
						}), i.setRequestParam(a), i.submitRequest()
					}
				}, mt.prototype.getZeroChannelInfo = function(e, t) {
					var n = F(this.CGI.getZeroChannelInfo, e.szHttpProtocol, e.szIP, e.iCGIPort),
						r = new Pt,
						s = {
							type: "GET",
							url: n,
							auth: e.szAuth,
							success: null,
							error: null
						};
					S.extend(s, t), S.extend(s, {
						success: function(e) {
							t.success && t.success(e)
						},
						error: function(e, n) {
							t.error && t.error(e, n)
						}
					}), r.setRequestParam(s), r.submitRequest()
				}, mt.prototype.getPPPoEStatus = function(e, t) {
					var n = F(this.CGI.getPPPoEStatus, e.szHttpProtocol, e.szIP, e.iCGIPort),
						r = new Pt,
						s = {
							type: "GET",
							url: n,
							auth: e.szAuth,
							success: null,
							error: null
						};
					S.extend(s, t), S.extend(s, {
						success: function(e) {
							t.success && t.success(e)
						},
						error: function(e, n) {
							t.error && t.error(e, n)
						}
					}), r.setRequestParam(s), r.submitRequest()
				}, mt.prototype.getUPnPPortStatus = function(e, t) {
					var n = F(this.CGI.getUPnPPortStatus, e.szHttpProtocol, e.szIP, e.iCGIPort),
						r = new Pt,
						s = {
							type: "GET",
							url: n,
							auth: e.szAuth,
							success: null,
							error: null
						};
					S.extend(s, t), S.extend(s, {
						success: function(e) {
							t.success && t.success(e)
						},
						error: function(e, n) {
							t.error && t.error(e, n)
						}
					}), r.setRequestParam(s), r.submitRequest()
				}, mt.prototype.getNetworkBond = function(e, t) {
					var n = F(this.CGI.getNetworkBond, e.szHttpProtocol, e.szIP, e.iCGIPort),
						r = new Pt,
						s = {
							type: "GET",
							url: n,
							auth: e.szAuth,
							success: null,
							error: null
						};
					S.extend(s, t), S.extend(s, {
						success: function(e) {
							t.success && t.success(e)
						},
						error: function(e, n) {
							t.error && t.error(e, n)
						}
					}), r.setRequestParam(s), r.submitRequest()
				}, mt.prototype.getNetworkInterface = function(e, t) {
					var n = F(this.CGI.getNetworkInterface, e.szHttpProtocol, e.szIP, e.iCGIPort),
						r = new Pt,
						s = {
							type: "GET",
							url: n,
							auth: e.szAuth,
							success: null,
							error: null
						};
					S.extend(s, t), S.extend(s, {
						success: function(e) {
							t.success && t.success(e)
						},
						error: function(e, n) {
							t.error && t.error(e, n)
						}
					}), r.setRequestParam(s), r.submitRequest()
				}, mt.prototype.getPortInfo = function(e, n) {
					var r = F(this.CGI.getPortInfo, e.szHttpProtocol, e.szIP, e.iCGIPort),
						s = new Pt,
						o = {
							type: "GET",
							url: r,
							auth: e.szAuth,
							success: null,
							error: null
						};
					S.extend(o, n), S.extend(o, {
						success: function(r) {
							var s = [];
							s.push("<AdminAccessProtocolList>");
							for (var o = t.$XML(r).find("AdminAccessProtocol", !0), i = 0, a = o.length; a > i; i++) o[i], s.push("<AdminAccessProtocol>"), s.push("<id>" + t.$XML(r).find("id").eq(0).text() + "</id>"), s.push("<enabled>" + t.$XML(r).find("enabled").eq(0).text() + "</enabled>"), s.push("<protocol>" + t.$XML(r).find("protocol").eq(0).text().toUpperCase() + "</protocol>"), s.push("<portNo>" + t.$XML(r).find("portNo").eq(0).text() + "</portNo>"), s.push("</AdminAccessProtocol>");
							C.getStreamChannels(e, {
								async: !1,
								success: function(r) {
									if (t.$XML(r).find("rtspPortNo", !0).length > 0) {
										var o = parseInt(t.$XML(r).find("rtspPortNo").eq(0).text(), 10);
										s.push("<AdminAccessProtocol>"), s.push("<id>4</id>"), s.push("<enabled>true</enabled>"), s.push("<protocol>RTSP</protocol>"), s.push("<portNo>" + o + "</portNo>"), s.push("</AdminAccessProtocol>"), s.push("</AdminAccessProtocolList>");
										var i = S.loadXML(s.join(""));
										n.success && n.success(i)
									} else C.getStreamDynChannels(e, {
										async: !1,
										success: function(e) {
											if (t.$XML(e).find("rtspPortNo", !0).length > 0) {
												var r = parseInt(t.$XML(e).find("rtspPortNo").eq(0).text(), 10);
												s.push("<AdminAccessProtocol>"), s.push("<id>4</id>"), s.push("<enabled>true</enabled>"), s.push("<protocol>RTSP</protocol>"), s.push("<portNo>" + r + "</portNo>"), s.push("</AdminAccessProtocol>"), s.push("</AdminAccessProtocolList>");
												var o = S.loadXML(s.join(""));
												n.success && n.success(o)
											}
										},
										error: function() {
											n.error && n.error()
										}
									})
								},
								error: function() {
									n.error && n.error()
								}
							})
						},
						error: function() {
							var r = [];
							r.push("<AdminAccessProtocolList>"), C.getStreamChannels(e, {
								async: !1,
								success: function(s) {
									if (t.$XML(s).find("rtspPortNo", !0).length > 0) {
										var o = parseInt(t.$XML(s).find("rtspPortNo").eq(0).text(), 10);
										r.push("<AdminAccessProtocol>"), r.push("<id>4</id>"), r.push("<enabled>true</enabled>"), r.push("<protocol>RTSP</protocol>"), r.push("<portNo>" + o + "</portNo>"), r.push("</AdminAccessProtocol>"), r.push("</AdminAccessProtocolList>");
										var i = S.loadXML(r.join(""));
										n.success && n.success(i)
									} else C.getStreamDynChannels(e, {
										async: !1,
										success: function(e) {
											if (t.$XML(e).find("rtspPortNo", !0).length > 0) {
												var s = parseInt(t.$XML(e).find("rtspPortNo").eq(0).text(), 10);
												r.push("<AdminAccessProtocol>"), r.push("<id>4</id>"), r.push("<enabled>true</enabled>"), r.push("<protocol>RTSP</protocol>"), r.push("<portNo>" + s + "</portNo>"), r.push("</AdminAccessProtocol>"), r.push("</AdminAccessProtocolList>");
												var o = S.loadXML(r.join(""));
												n.success && n.success(o)
											}
										},
										error: function() {
											n.error && n.error()
										}
									})
								},
								error: function() {
									n.error && n.error()
								}
							})
						}
					}), s.setRequestParam(o), s.submitRequest()
				}, mt.prototype.getStreamChannels = function(e, t) {
					if (0 != e.iAnalogChannelNum) var n = F(this.CGI.getStreamChannels.analog, e.szHttpProtocol, e.szIP, e.iCGIPort);
					else var n = F(this.CGI.getStreamChannels.digital, e.szHttpProtocol, e.szIP, e.iCGIPort);
					var r = new Pt,
						s = {
							type: "GET",
							url: n,
							auth: e.szAuth,
							success: null,
							error: null
						};
					S.extend(s, t), S.extend(s, {
						success: function(e) {
							t.success && t.success(e)
						},
						error: function(e, n) {
							t.error && t.error(e, n)
						}
					}), r.setRequestParam(s), r.submitRequest()
				}, mt.prototype.getStreamDynChannels = function(e, t) {
					var n = F(this.CGI.getStreamDynChannels, e.szHttpProtocol, e.szIP, e.iCGIPort),
						r = new Pt,
						s = {
							type: "GET",
							url: n,
							auth: e.szAuth,
							success: null,
							error: null
						};
					S.extend(s, t), S.extend(s, {
						success: function(e) {
							t.success && t.success(e)
						},
						error: function(e, n) {
							t.error && t.error(e, n)
						}
					}), r.setRequestParam(s), r.submitRequest()
				}, mt.prototype.startRealPlay = function(e, t) {
					var n = 100 * t.iChannelID + t.iStreamType,
						r = "",
						s = e.szIP;
					"rtsp://" === t.urlProtocol && (s = V(s)), r = t.bZeroChannel ? F(t.cgi.zeroChannels, t.urlProtocol, s, t.iPort, n) : F(t.cgi.channels, t.urlProtocol, s, t.iPort, n);
					var o = p.HWP_Play(r, e.szAuth, t.iWndIndex, "", "");
					if (0 == o) {
						var i = new ht;
						i.iIndex = t.iWndIndex, i.szIP = e.szIP, i.iCGIPort = e.iCGIPort, i.szDeviceIdentify = e.szDeviceIdentify, i.iChannelID = t.iChannelID, i.iPlayStatus = T, I.push(i)
					}
					return o
				}, mt.prototype.startVoiceTalk = function(e, t) {
					var n = F(this.CGI.startVoiceTalk.open, e.szHttpProtocol, e.szIP, e.iCGIPort, t),
						r = F(this.CGI.startVoiceTalk.close, e.szHttpProtocol, e.szIP, e.iCGIPort, t),
						s = F(this.CGI.startVoiceTalk.audioData, e.szHttpProtocol, e.szIP, e.iCGIPort, t),
						o = p.HWP_StartVoiceTalkEx(n, r, s, e.szAuth, e.iAudioTypeoDeviceInfo.m_iAudioBitRate, e.m_iAudioSamplingRate);
					return o
				}, mt.prototype.ptzAutoControl = function(e, t, n, r) {
					var s = n.iChannelID,
						o = "",
						i = "";
					if (r.iPTZSpeed = r.iPTZSpeed < 7 ? 15 * r.iPTZSpeed : 100, t && (r.iPTZSpeed = 0), e.szDeviceType != E) o = F(this.CGI.ptzAutoControl, e.szHttpProtocol, e.szIP, e.iCGIPort, s), i = "<?xml version='1.0' encoding='UTF-8'?><PTZData><pan>" + r.iPTZSpeed + "</pan>" + "<tilt>0</tilt>" + "</PTZData>";
					else {
						var a = 99;
						t && (a = 96), o = F(this.CGI.goPreset, e.szHttpProtocol, e.szIP, e.iCGIPort, s, a)
					}
					var u = new Pt,
						c = {
							type: "PUT",
							url: o,
							async: !1,
							auth: e.szAuth,
							data: i,
							success: null,
							error: null
						},
						l = this;
					S.extend(c, r), S.extend(c, {
						success: function(e) {
							n.bPTZAuto = !n.bPTZAuto, r.success && r.success(e)
						},
						error: function(t, s) {
							if (e.szDeviceType != E) {
								o = F(l.CGI.ptzControl, e.szHttpProtocol, e.szIP, e.iCGIPort, n.iChannelID);
								var a = new Pt,
									u = {
										type: "PUT",
										url: o,
										async: !1,
										auth: e.szAuth,
										data: i,
										success: null,
										error: null
									};
								S.extend(u, r), a.setRequestParam(u), a.submitRequest()
							} else r.error && r.error(t, s)
						}
					}), u.setRequestParam(c), u.submitRequest()
				}, mt.prototype.ptzControl = function(e, t, n, r) {
					var s = (n.iChannelID, "");
					n.bPTZAuto && this.ptzAutoControl(e, !0, n, {
						iPTZSpeed: 0
					}), r.iPTZSpeed = t ? 0 : r.iPTZSpeed < 7 ? 15 * r.iPTZSpeed : 100;
					var o = [{}, {
							pan: 0,
							tilt: r.iPTZSpeed
						}, {
							pan: 0,
							tilt: -r.iPTZSpeed
						}, {
							pan: -r.iPTZSpeed,
							tilt: 0
						}, {
							pan: r.iPTZSpeed,
							tilt: 0
						}, {
							pan: -r.iPTZSpeed,
							tilt: r.iPTZSpeed
						}, {
							pan: -r.iPTZSpeed,
							tilt: -r.iPTZSpeed
						}, {
							pan: r.iPTZSpeed,
							tilt: r.iPTZSpeed
						}, {
							pan: r.iPTZSpeed,
							tilt: -r.iPTZSpeed
						}, {}, {
							speed: r.iPTZSpeed
						}, {
							speed: -r.iPTZSpeed
						}, {
							speed: r.iPTZSpeed
						}, {
							speed: -r.iPTZSpeed
						}, {
							speed: r.iPTZSpeed
						}, {
							speed: -r.iPTZSpeed
						}],
						i = "",
						a = {};
					switch (r.iPTZIndex) {
						case 1:
						case 2:
						case 3:
						case 4:
						case 5:
						case 6:
						case 7:
						case 8:
							a = this.CGI.ptzControl, i = "<?xml version='1.0' encoding='UTF-8'?><PTZData><pan>" + o[r.iPTZIndex].pan + "</pan>" + "<tilt>" + o[r.iPTZIndex].tilt + "</tilt>" + "</PTZData>";
							break;
						case 10:
						case 11:
							a = this.CGI.ptzControl, i = "<?xml version='1.0' encoding='UTF-8'?><PTZData><zoom>" + o[r.iPTZIndex].speed + "</zoom>" + "</PTZData>";
							break;
						case 12:
						case 13:
							a = this.CGI.ptzFocus, i = "<?xml version='1.0' encoding='UTF-8'?><FocusData><focus>" + o[r.iPTZIndex].speed + "</focus>" + "</FocusData>";
							break;
						case 14:
						case 15:
							a = this.CGI.ptzIris, i = "<?xml version='1.0' encoding='UTF-8'?><IrisData><iris>" + o[r.iPTZIndex].speed + "</iris>" + "</IrisData>";
							break;
						default:
							return r.error && r.error(), void 0
					}
					s = F(a, e.szHttpProtocol, e.szIP, e.iCGIPort, n.iChannelID);
					var u = new Pt,
						c = {
							type: "PUT",
							url: s,
							async: !1,
							auth: e.szAuth,
							data: i,
							success: null,
							error: null
						};
					S.extend(c, r), S.extend(c, {
						success: function(e) {
							r.success && r.success(e)
						},
						error: function(e, t) {
							r.error && r.error(e, t)
						}
					}), u.setRequestParam(c), u.submitRequest()
				}, mt.prototype.setPreset = function(e, t, n) {
					var r = (t.iChannelID, ""),
						s = "";
					r = F(this.CGI.setPreset, e.szHttpProtocol, e.szIP, e.iCGIPort, t.iChannelID, n.iPresetID), s = "<?xml version='1.0' encoding='UTF-8'?>", s += "<PTZPreset>", s += "<id>" + n.iPresetID + "</id>", e.szDeviceType != E && (s += "<presetName>Preset" + n.iPresetID + "</presetName>"), s += "</PTZPreset>";
					var o = new Pt,
						i = {
							type: "PUT",
							url: r,
							auth: e.szAuth,
							data: s,
							success: null,
							error: null
						};
					S.extend(i, n), S.extend(i, {
						success: function(e) {
							n.success && n.success(e)
						},
						error: function(e, t) {
							n.error && n.error(e, t)
						}
					}), o.setRequestParam(i), o.submitRequest()
				}, mt.prototype.goPreset = function(e, t, n) {
					var r = (t.iChannelID, "");
					r = F(this.CGI.goPreset, e.szHttpProtocol, e.szIP, e.iCGIPort, t.iChannelID, n.iPresetID);
					var s = new Pt,
						o = {
							type: "PUT",
							url: r,
							auth: e.szAuth,
							success: null,
							error: null
						};
					S.extend(o, n), S.extend(o, {
						success: function(e) {
							n.success && n.success(e)
						},
						error: function(e, t) {
							n.error && n.error(e, t)
						}
					}), s.setRequestParam(o), s.submitRequest()
				}, mt.prototype.recordSearch = function(e, n) {
					var r = "",
						s = "",
						i = n.iChannelID,
						a = n.iStreamType,
						u = n.szStartTime.replace(" ", "T") + "Z",
						c = n.szEndTime.replace(" ", "T") + "Z";
					r = F(this.CGI.recordSearch, e.szHttpProtocol, e.szIP, e.iCGIPort), s = "<?xml version='1.0' encoding='UTF-8'?><CMSearchDescription><searchID>" + new o + "</searchID>" + "<trackList><trackID>" + (100 * i + a) + "</trackID></trackList>" + "<timeSpanList>" + "<timeSpan>" + "<startTime>" + u + "</startTime>" + "<endTime>" + c + "</endTime>" + "</timeSpan>" + "</timeSpanList>" + "<maxResults>40</maxResults>" + "<searchResultPostion>" + n.iSearchPos + "</searchResultPostion>" + "<metadataList>" + "<metadataDescriptor>//metadata.psia.org/VideoMotion</metadataDescriptor>" + "</metadataList>" + "</CMSearchDescription>";
					var l = new Pt,
						d = {
							type: "POST",
							url: r,
							auth: e.szAuth,
							data: s,
							success: null,
							error: null
						};
					S.extend(d, n), S.extend(d, {
						success: function(e) {
							var r = [];
							r.push("<CMSearchResult>"), r.push("<responseStatus>" + t.$XML(e).find("responseStatus").eq(0).text() + "</responseStatus>"), r.push("<responseStatusStrg>" + t.$XML(e).find("responseStatusStrg").eq(0).text() + "</responseStatusStrg>"), r.push("<numOfMatches>" + t.$XML(e).find("numOfMatches").eq(0).text() + "</numOfMatches>"), r.push("<matchList>");
							for (var s = t.$XML(e).find("searchMatchItem", !0), o = 0, i = s.length; i > o; o++) {
								var a = s[o];
								r.push("<searchMatchItem>"), r.push("<trackID>" + t.$XML(a).find("trackID").eq(0).text() + "</trackID>"), r.push("<startTime>" + t.$XML(a).find("startTime").eq(0).text() + "</startTime>"), r.push("<endTime>" + t.$XML(a).find("endTime").eq(0).text() + "</endTime>"), r.push("<playbackURI>" + S.escape(t.$XML(a).find("playbackURI").eq(0).text()) + "</playbackURI>"), r.push("<metadataDescriptor>" + t.$XML(a).find("metadataDescriptor").eq(0).text().split("/")[1] + "</metadataDescriptor>"), r.push("</searchMatchItem>")
							}
							r.push("</matchList>"), r.push("</CMSearchResult>"), e = S.loadXML(r.join("")), n.success && n.success(e)
						},
						error: function(e, t) {
							n.error && n.error(e, t)
						}
					}), l.setRequestParam(d), l.submitRequest()
				}, mt.prototype.startPlayback = function(e, t) {
					var n = t.iWndIndex,
						r = t.szStartTime,
						s = t.szEndTime,
						o = e.szIP;
					"rtsp://" === t.urlProtocol && (o = V(o));
					var i = F(t.cgi, t.urlProtocol, o, t.iPort, t.iChannelID, r, s),
						a = p.HWP_Play(i, e.szAuth, n, r, s);
					if (0 == a) {
						var u = new ht;
						u.iIndex = n, u.szIP = e.szIP, u.iCGIPort = e.iCGIPort, u.szDeviceIdentify = e.szDeviceIdentify, u.iChannelID = t.iChannelID, u.iPlayStatus = A, I.push(u)
					}
					return a
				}, mt.prototype.reversePlayback = function(e, t) {
					var n = t.iWndIndex,
						r = t.szStartTime,
						s = t.szEndTime,
						o = e.szIP;
					"rtsp://" === t.urlProtocol && (o = V(o));
					var i = F(t.cgi, t.urlProtocol, o, t.iPort, t.iChannelID, r, s),
						a = p.HWP_ReversePlay(i, e.szAuth, n, r, s);
					if (0 == a) {
						var u = new ht;
						u.iIndex = n, u.szIP = e.szIP, u.iCGIPort = e.iCGIPort, u.szDeviceIdentify = e.szDeviceIdentify, u.iChannelID = t.iChannelID, u.iPlayStatus = q, I.push(u)
					}
					return a
				}, mt.prototype.startDownloadRecord = function(e, t) {
					var n = F(this.CGI.startDownloadRecord, e.szHttpProtocol, e.szIP, e.iCGIPort),
						r = "<?xml version='1.0' encoding='UTF-8'?><downloadRequest><playbackURI> " + S.escape(t.szPlaybackURI) + "</playbackURI>" + "</downloadRequest>";
					return p.HWP_StartDownload(n, e.szAuth, t.szFileName, r, t.bDateDir)
				}, mt.prototype.exportDeviceConfig = function(e) {
					var t = F(this.CGI.downloaddeviceConfig, e.szHttpProtocol, e.szIP, e.iCGIPort);
					return ct() ? -1 : p.HWP_ExportDeviceConfig(t, e.szAuth, "", 0)
				}, mt.prototype.importDeviceConfig = function(e, t) {
					var n = F(this.CGI.uploaddeviceConfig, e.szHttpProtocol, e.szIP, e.iCGIPort);
					return p.HWP_ImportDeviceConfig(n, e.szAuth, t.szFileName, 0)
				}, mt.prototype.restart = function(e, t) {
					var n = F(this.CGI.restart, e.szHttpProtocol, e.szIP, e.iCGIPort),
						r = new Pt,
						s = {
							type: "PUT",
							url: n,
							auth: e.szAuth,
							success: null,
							error: null
						};
					S.extend(s, t), S.extend(s, {
						success: function(e) {
							t.success && t.success(e)
						},
						error: function(e, n) {
							t.error && t.error(e, n)
						}
					}), r.setRequestParam(s), r.submitRequest()
				}, mt.prototype.restore = function(e, t, n) {
					var r = F(this.CGI.restore, e.szHttpProtocol, e.szIP, e.iCGIPort, t),
						s = new Pt,
						o = {
							type: "PUT",
							url: r,
							auth: e.szAuth,
							success: null,
							error: null
						};
					S.extend(o, n), S.extend(o, {
						success: function(e) {
							n.success && n.success(e)
						},
						error: function(e, t) {
							n.error && n.error(e, t)
						}
					}), s.setRequestParam(o), s.submitRequest()
				}, mt.prototype.startUpgrade = function(e, t) {
					var n = F(this.CGI.startUpgrade.upgrade, e.szHttpProtocol, e.szIP, e.iCGIPort),
						r = F(this.CGI.startUpgrade.status, e.szHttpProtocol, e.szIP, e.iCGIPort);
					return p.HWP_StartUpgrade(n, r, e.szAuth, t.szFileName)
				}, mt.prototype.set3DZoom = function(e, t, n, r) {
					var s = F(this.CGI.set3DZoom, e.szHttpProtocol, e.szIP, e.iCGIPort, t.iChannelID),
						o = new Pt,
						i = {
							type: "PUT",
							url: s,
							data: n,
							auth: e.szAuth,
							success: null,
							error: null
						};
					S.extend(i, r), S.extend(i, {
						success: function(e) {
							r.success && r.success(e)
						},
						error: function(e, t) {
							r.error && r.error(e, t)
						}
					}), o.setRequestParam(i), o.submitRequest()
				}, mt.prototype.deviceCapturePic = function(e, t, n, r) {
					var t = 100 * t + 1,
						s = F(this.CGI.deviceCapture.channels, e.szHttpProtocol, e.szIP, e.iCGIPort, t),
						o = [];
					return S.isInt(r.iResolutionWidth) && o.push("videoResolutionWidth=" + r.iResolutionWidth), S.isInt(r.iResolutionHeight) && o.push("videoResolutionHeight=" + r.iResolutionHeight), o.length > 0 && (s += "?" + o.join("&")), p.HWP_DeviceCapturePic(s, e.szAuth, n, r.bDateDir)
				};
				var vt = function() {};
				vt.prototype._alert = function(e) {
						d.bDebugMode && console.log(e)
					},
					function(e) {
						var t = function(e) {
							this.elems = [], this.length = 0, this.length = this.elems.push(e)
						};
						t.prototype.find = function(e, t) {
							var n = this.elems[this.length - 1] ? this.elems[this.length - 1].getElementsByTagName(e) : [];
							return this.length = this.elems.push(n), t ? n : this
						}, t.prototype.eq = function(e, t) {
							var n = this.elems[this.length - 1].length,
								r = null;
							return n > 0 && n > e && (r = this.elems[this.length - 1][e]), this.length = this.elems.push(r), t ? r : this
						}, t.prototype.text = function(e) {
							return this.elems[this.length - 1] ? e ? (window.DOMParser ? this.elems[this.length - 1].textContent = e : this.elems[this.length - 1].text = e, void 0) : window.DOMParser ? this.elems[this.length - 1].textContent : this.elems[this.length - 1].text : ""
						}, t.prototype.attr = function(e) {
							if (this.elems[this.length - 1]) {
								var t = this.elems[this.length - 1].attributes.getNamedItem(e);
								return t ? t.value : ""
							}
						}, e.$XML = function(e) {
							return new t(e)
						}
					}(this);
				var Ct = function() {};
				Ct.prototype.extend = function() {
					for (var e, t = arguments[0] || {}, n = 1, r = arguments.length; r > n; n++)
						if (null != (e = arguments[n]))
							for (var s in e) {
								var o = (t[s], e[s]);
								t !== o && ("object" == typeof o ? t[s] = this.extend({}, o) : void 0 !== o && (t[s] = o))
							}
					return t
				}, Ct.prototype.browser = function() {
					var e = /(chrome)[ \/]([\w.]+)/,
						t = /(safari)[ \/]([\w.]+)/,
						n = /(opera)(?:.*version)?[ \/]([\w.]+)/,
						r = /(msie) ([\w.]+)/,
						s = /(trident.*rv:)([\w.]+)/,
						o = /(mozilla)(?:.*? rv:([\w.]+))?/,
						i = navigator.userAgent.toLowerCase(),
						a = e.exec(i) || t.exec(i) || n.exec(i) || r.exec(i) || s.exec(i) || i.indexOf("compatible") < 0 && o.exec(i) || ["unknow", "0"];
					a.length > 0 && a[1].indexOf("trident") > -1 && (a[1] = "msie");
					var u = {};
					return u[a[1]] = !0, u.version = a[2], u
				}, Ct.prototype.loadXML = function(e) {
					if (null == e || "" == e) return null;
					var t = null;
					if (window.DOMParser) {
						var n = new DOMParser;
						t = n.parseFromString(e, "text/xml")
					} else t = new ActiveXObject("Microsoft.XMLDOM"), t.async = !1, t.loadXML(e);
					return t
				}, Ct.prototype.toXMLStr = function(e) {
					var t = "";
					try {
						var n = new XMLSerializer;
						t = n.serializeToString(e)
					} catch (r) {
						try {
							t = e.xml
						} catch (r) {
							return ""
						}
					}
					return -1 == t.indexOf("<?xml") && (t = "<?xml version='1.0' encoding='utf-8'?>" + t), t
				}, Ct.prototype.escape = function(e) {
					return e ? e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : e
				}, Ct.prototype.encodePwd = function(e, t, n) {
					var r = "";
					if (n) {
						r = S.sha256(t.userName + t.salt + e), r = S.sha256(r + t.challenge);
						for (var s = 2; s < t.iIterate; s++) r = S.sha256(r)
					} else {
						r = S.sha256(e) + t.challenge;
						for (var s = 1; s < t.iIterate; s++) r = S.sha256(r)
					}
					return r
				}, Ct.prototype.dateFormat = function(e, t) {
					var n = {
						"M+": e.getMonth() + 1,
						"d+": e.getDate(),
						"h+": e.getHours(),
						"m+": e.getMinutes(),
						"s+": e.getSeconds(),
						"q+": Math.floor((e.getMonth() + 3) / 3),
						S: e.getMilliseconds()
					};
					/(y+)/.test(t) && (t = t.replace(RegExp.$1, (e.getFullYear() + "").substr(4 - RegExp.$1.length)));
					for (var r in n) new RegExp("(" + r + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? n[r] : ("00" + n[r]).substr(("" + n[r]).length)));
					return t
				}, Ct.prototype.Base64 = {
					_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
					encode: function(e) {
						var t, n, r, s, o, i, a, u = "",
							c = 0;
						for (e = Ct.prototype.Base64._utf8_encode(e); c < e.length;) t = e.charCodeAt(c++), n = e.charCodeAt(c++), r = e.charCodeAt(c++), s = t >> 2, o = (3 & t) << 4 | n >> 4, i = (15 & n) << 2 | r >> 6, a = 63 & r, isNaN(n) ? i = a = 64 : isNaN(r) && (a = 64), u = u + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(i) + this._keyStr.charAt(a);
						return u
					},
					decode: function(e) {
						var t, n, r, s, o, i, a, u = "",
							c = 0;
						for (e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); c < e.length;) s = this._keyStr.indexOf(e.charAt(c++)), o = this._keyStr.indexOf(e.charAt(c++)), i = this._keyStr.indexOf(e.charAt(c++)), a = this._keyStr.indexOf(e.charAt(c++)), t = s << 2 | o >> 4, n = (15 & o) << 4 | i >> 2, r = (3 & i) << 6 | a, u += String.fromCharCode(t), 64 != i && (u += String.fromCharCode(n)), 64 != a && (u += String.fromCharCode(r));
						return u = Ct.prototype.Base64._utf8_decode(u)
					},
					_utf8_encode: function(e) {
						e = e.replace(/\r\n/g, "\n");
						for (var t = "", n = 0; n < e.length; n++) {
							var r = e.charCodeAt(n);
							128 > r ? t += String.fromCharCode(r) : r > 127 && 2048 > r ? (t += String.fromCharCode(192 | r >> 6), t += String.fromCharCode(128 | 63 & r)) : (t += String.fromCharCode(224 | r >> 12), t += String.fromCharCode(128 | 63 & r >> 6), t += String.fromCharCode(128 | 63 & r))
						}
						return t
					},
					_utf8_decode: function(e) {
						for (var t = "", n = 0, r = c1 = c2 = 0; n < e.length;) r = e.charCodeAt(n), 128 > r ? (t += String.fromCharCode(r), n++) : r > 191 && 224 > r ? (c2 = e.charCodeAt(n + 1), t += String.fromCharCode((31 & r) << 6 | 63 & c2), n += 2) : (c2 = e.charCodeAt(n + 1), c3 = e.charCodeAt(n + 2), t += String.fromCharCode((15 & r) << 12 | (63 & c2) << 6 | 63 & c3), n += 3);
						return t
					}
				}, Ct.prototype.createEventScript = function(e, t, n) {
					var r = document.createElement("script");
					r.htmlFor = e, r.event = t, r.innerHTML = n, document.body.parentNode.appendChild(r)
				}, Ct.prototype.isInt = function(e) {
					return /^\d+$/.test(e)
				}, Ct.prototype.getDirName = function() {
					var e = "";
					if ("" !== d.szBasePath) e = d.szBasePath;
					else {
						var t = /[^?#]*\//,
							n = document.getElementById("videonode");
						if (n) e = n.src.match(t)[0];
						else {
							for (var r = document.scripts, s = 0, o = r.length; o > s; s++)
								if (r[s].src.indexOf("webVideoCtrl.js") > -1) {
									n = r[s];
									break
								}
							n && (e = n.src.match(t)[0])
						}
					}
					return e
				}, Ct.prototype.loadScript = function(e, t) {
					var n = document.createElement("script");
					n.type = "text/javascript", n.onload = function() {
						t()
					}, n.src = e, document.getElementsByTagName("head")[0].appendChild(n)
				}, Ct.prototype.encodeString = function(e) {
					return e ? e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : ""
				}, Ct.prototype.getIrreversibleKey = function(e, t) {
					var n = e;
					if (oSecurityCap.oIrreversibleEncrypt.bSupport) {
						var r = oSecurityCap.oIrreversibleEncrypt.salt;
						return S.sha256(t + r + e)
					}
					return n
				}, Ct.prototype.strToAESKey = function(e, t) {
					var n = "";
					if (oSecurityCap.iKeyIterateNum > 0) {
						n = S.sha256(S.getIrreversibleKey(e, t) + "AaBbCcDd1234!@#$");
						for (var r = 1; r < oSecurityCap.iKeyIterateNum; r++) n = S.sha256(n)
					}
					return n = n && n.substring(0, 32)
				}, Ct.prototype.exportPasswordDeviceConfig = function(e, t) {
					var n = MD5((new Date).getTime().toString()),
						r = S.encodeAES(S.Base64.encode(S.encodeString(t)), szAESKey, n);
					return e + "?secretkey=" + r + "&security=1&iv=" + n
				}, Ct.prototype.encodeAES = function(e, t, n, r) {
					var s = "";
					if ("ecb" === r)
						for (var o = e.length, i = 0; o > 0;) s += o > 16 ? aes_encrypt(e.substring(i, i + 16), t, !0) : aes_encrypt(e.substring(i), t, !0), o -= 16, i += 16;
					else {
						"undefined" == typeof n && (n = "6cd9616beb39d4034fdebe107df9a399");
						var a = CryptoJS.enc.Hex.parse(t),
							u = CryptoJS.enc.Hex.parse(n),
							c = CryptoJS.AES.encrypt(e, a, {
								mode: CryptoJS.mode.CBC,
								iv: u,
								padding: CryptoJS.pad.Pkcs7
							});
						s = c.ciphertext.toString()
					}
					return s
				}, Ct.prototype.sha256 = function(e) {
					function t(e, t) {
						var n = (65535 & e) + (65535 & t);
						return (e >> 16) + (t >> 16) + (n >> 16) << 16 | 65535 & n
					}

					function n(e, t) {
						return e >>> t | e << 32 - t
					}
					return e = function(e) {
							for (var e = e.replace(/\r\n/g, "\n"), t = "", n = 0; n < e.length; n++) {
								var r = e.charCodeAt(n);
								128 > r ? t += String.fromCharCode(r) : (r > 127 && 2048 > r ? t += String.fromCharCode(192 | r >> 6) : (t += String.fromCharCode(224 | r >> 12), t += String.fromCharCode(128 | 63 & r >> 6)), t += String.fromCharCode(128 | 63 & r))
							}
							return t
						}(e),
						function(e) {
							for (var t = "", n = 0; n < 4 * e.length; n++) t += "0123456789abcdef".charAt(15 & e[n >> 2] >> 8 * (3 - n % 4) + 4) + "0123456789abcdef".charAt(15 & e[n >> 2] >> 8 * (3 - n % 4));
							return t
						}(function(e, r) {
							var s, o, i, a, u, c, l, d, p, f, h, P, I = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298],
								m = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225],
								v = Array(64);
							for (e[r >> 5] |= 128 << 24 - r % 32, e[(r + 64 >> 9 << 4) + 15] = r, p = 0; p < e.length; p += 16) {
								for (s = m[0], o = m[1], i = m[2], a = m[3], u = m[4], c = m[5], l = m[6], d = m[7], f = 0; 64 > f; f++) v[f] = 16 > f ? e[f + p] : t(t(t(n(v[f - 2], 17) ^ n(v[f - 2], 19) ^ v[f - 2] >>> 10, v[f - 7]), n(v[f - 15], 7) ^ n(v[f - 15], 18) ^ v[f - 15] >>> 3), v[f - 16]), h = t(t(t(t(d, n(u, 6) ^ n(u, 11) ^ n(u, 25)), u & c ^ ~u & l), I[f]), v[f]), P = t(n(s, 2) ^ n(s, 13) ^ n(s, 22), s & o ^ s & i ^ o & i), d = l, l = c, c = u, u = t(a, h), a = i, i = o, o = s, s = t(h, P);
								m[0] = t(s, m[0]), m[1] = t(o, m[1]), m[2] = t(i, m[2]), m[3] = t(a, m[3]), m[4] = t(u, m[4]), m[5] = t(c, m[5]), m[6] = t(l, m[6]), m[7] = t(d, m[7])
							}
							return m
						}(function(e) {
							for (var t = [], n = 0; n < 8 * e.length; n += 8) t[n >> 5] |= (255 & e.charCodeAt(n / 8)) << 24 - n % 32;
							return t
						}(e), 8 * e.length))
				}, Ct.prototype.cookie = function(e, t, n) {
					if (arguments.length > 1 && (null === t || "object" != typeof t)) {
						if (n = this.extend({}, n), null === t && (n.expires = -1), "number" == typeof n.expires) {
							var r = n.expires,
								s = n.expires = new Date;
							s.setDate(s.getDate() + r)
						}
						return document.cookie = [encodeURIComponent(e), "=", n.raw ? String(t) : encodeURIComponent(String(t)), n.expires ? "; expires=" + n.expires.toUTCString() : "", n.path ? "; path=" + n.path : "; path=/", n.domain ? "; domain=" + n.domain : "", n.secure ? "; secure" : ""].join("")
					}
					n = t || {};
					var o, i = n.raw ? function(e) {
						return e
					} : decodeURIComponent;
					return (o = new RegExp("(?:^|; )" + encodeURIComponent(e) + "=([^;]*)").exec(document.cookie)) ? i(o[1]) : null
				}, o.prototype.valueOf = function() {
					return this.id
				}, o.prototype.toString = function() {
					return this.id
				}, o.prototype.createUUID = function() {
					var e = new Date(1582, 10, 15, 0, 0, 0, 0),
						t = new Date,
						n = t.getTime() - e.getTime(),
						r = "-",
						s = o.getIntegerBits(n, 0, 31),
						i = o.getIntegerBits(n, 32, 47),
						a = o.getIntegerBits(n, 48, 59) + "1",
						u = o.getIntegerBits(o.rand(4095), 0, 7),
						c = o.getIntegerBits(o.rand(4095), 0, 7),
						l = o.getIntegerBits(o.rand(8191), 0, 7) + o.getIntegerBits(o.rand(8191), 8, 15) + o.getIntegerBits(o.rand(8191), 0, 7) + o.getIntegerBits(o.rand(8191), 8, 15) + o.getIntegerBits(o.rand(8191), 0, 15);
					return s + r + i + r + a + r + u + c + r + l
				}, o.getIntegerBits = function(e, t, n) {
					var r = o.returnBase(e, 16),
						s = new Array,
						i = "",
						a = 0;
					for (a = 0; a < r.length; a++) s.push(r.substring(a, a + 1));
					for (a = Math.floor(t / 4); a <= Math.floor(n / 4); a++) i += s[a] && "" != s[a] ? s[a] : "0";
					return i
				}, o.returnBase = function(e, t) {
					var n = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
					if (t > e) var r = n[e];
					else {
						var s = "" + Math.floor(e / t),
							o = e - s * t;
						if (s >= t) var r = this.returnBase(s, t) + n[o];
						else var r = n[s] + n[o]
					}
					return r
				}, o.rand = function(e) {
					return Math.floor(Math.random() * e)
				}, v = new It, C = new mt, m = new vt, S = new Ct;
				var St = S.dateFormat(new Date, "yyyyMMddhhmmss");
				return c = "webVideoCtrl" + St, l = "webVideoCtrl" + St, "object" != typeof window.attachEvent && S.browser().msie && (S.createEventScript(c, "GetSelectWndInfo(SelectWndInfo)", "GetSelectWndInfo(SelectWndInfo);"), S.createEventScript(c, "ZoomInfoCallback(szZoomInfo)", "ZoomInfoCallback(szZoomInfo);"), S.createEventScript(c, "GetHttpInfo(lID, lpInfo, lReverse)", "GetHttpInfo(lID, lpInfo, lReverse);"), S.createEventScript(c, "PluginEventHandler(iEventType, iParam1, iParam2)", "PluginEventHandler(iEventType, iParam1, iParam2);"), S.createEventScript(c, "RemoteConfigInfo(lID)", "RemoteConfigInfo(lID);"), S.createEventScript(c, "KeyBoardEventInfo(iKeyCode)", "KeyBoardEventInfo(iKeyCode);")), this
			}(),
			t = window.WebVideoCtrl = e;
		t.version = "1.1.0"
	}
}(this), "object" == typeof exports && "undefined" != typeof module || ("function" == typeof define && define.amd ? define(function() {
	return WebVideoCtrl
}) : "function" == typeof define && define.cmd && define(function(e, t, n) {
	n.exports = WebVideoCtrl
}));