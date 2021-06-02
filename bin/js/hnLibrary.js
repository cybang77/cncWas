exports.timestampTodate = function (timestamp) {
  date = new Date(parseFloat(timestamp));
  date = date.getFullYear()+ '/' + (date.getMonth()+1) + '/' + ('0' + date.getDate()).slice(-2) + ' ' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2)
  
  return date
}

exports.timestampTotime = function (timestamp) {
  miliTime = parseFloat(timestamp);
  let min = parseInt(miliTime / 60);
  let sec = miliTime % 60;

  let avgTime = '';
  if (min > 0) {
    avgTime = parseInt(min) + 'm' + ' ';
  }
  if (sec > 0 ) {
    avgTime = avgTime + parseInt(sec) + 's';
  }
  
  return avgTime
}

exports.InfluxAggregationTimeBug = function (date) {
  let year = date.split('-')[0]
  let month = date.split('-')[1]
  let day = date.split('-')[2]
  let monthset = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

  if(year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
    monthset[2] = 29;
  }

  if (day == 1) {
    month = month -1;
    day = monthset[month];
    if (month < 10) {
      month = '0'+month;
    }
  } else {
    day = day - 1;
    if (day < 10) {
      day = '0'+day;
    }
  }
  date = year + '-' + month + '-' + day;
  return date;
}