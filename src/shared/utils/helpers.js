const datetimeStringToDateObject = (datetimeString) => {
  console.log(datetimeString)
  let [dateStr, timeStr] = datetimeString.split(' ')
  dateStr = dateStr.split('-')
  timeStr = timeStr.split(':')

  const date = new Date(+dateStr[0], +dateStr[1] - 1, +dateStr[2])
  date.setHours(+timeStr[0], +timeStr[1])
  return date
}

module.exports = {
  datetimeStringToDateObject
}