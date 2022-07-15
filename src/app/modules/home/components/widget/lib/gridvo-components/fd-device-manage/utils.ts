let id = 0
export function formatTelemetryData(telemetryData: any) {
  const deviceData = {};
  telemetryData.forEach((item: any) => {
    let entityId = item.datasource.entityId;
    let key = item.dataKey.name;
    let value = item.data[0] && item.data[0][1];
    let valueType = item.dataKey.type
    let newestTime = item.data[0] && item.data[0][0];
    if (Object.keys(deviceData).includes(entityId)) {
      deviceData[entityId][key] = {
        name: key,
        label: item.dataKey.label,
        val: String(value) || '',
        valueType: valueType,
        newestTime: newestTime,
        id: id++
      };
    } else {
      deviceData[entityId] = {};
      deviceData[entityId][key] = {
        name: key,
        label: item.dataKey.label,
        val: String(value) || '',
        valueType: valueType,
        newestTime: newestTime,
        id: id++
      };
      deviceData[entityId].entityId = entityId;
      deviceData[entityId].entityType = item.datasource.entityType;
    }
  })
  //如果self.ctx.data的data为空数组，最后返回出去的是空数组
  return deviceData;
}
