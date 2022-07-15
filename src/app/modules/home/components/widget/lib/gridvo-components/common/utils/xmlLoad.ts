/**
 * xml字符串转换xml对象数据
 * @param {Object} xmlStr
 */
function xmlStr2XmlObj(xmlStr) {
  var xmlObj = {};
  xmlObj = new DOMParser().parseFromString(xmlStr, "text/xml");
  return xmlObj;
}

/**
 * xml直接转换json数据
 * @param {Object} xml
 */
function xmlObj2json(xml) {
  try {
    var obj = {};
    if (xml.children.length > 0) {
      for (var i = 0; i < xml.children.length; i++) {
        var item = xml.children.item(i);
        var nodeName = item.nodeName;
        if (typeof (obj[nodeName]) == "undefined") {
          obj[nodeName] = xmlObj2json(item);
        } else {
          if (typeof (obj[nodeName].push) == "undefined") {
            var old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(xmlObj2json(item));
        }
      }
    } else {
      obj = xml.textContent;
    }
    return obj;
  } catch (e) {
    console.log(e.message);
  }
}

/**
 * xml字符串转换json数据
 * @param {Object} xml
 */
function xmlStr2json(xml) {
  var xmlObj = xmlStr2XmlObj(xml);
  var jsonObj = {};
  if ((xmlObj as any).childNodes.length > 0) {
    jsonObj = xmlObj2json(xmlObj);
  }
  return jsonObj;
}

export {
  xmlStr2XmlObj,
  xmlObj2json,
  xmlStr2json
}