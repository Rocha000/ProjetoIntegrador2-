function formatarData (data) {
    var dataString = data.getDate()  + "/" + (data.getMonth()+1) + "/" + data.getFullYear() + " " +
    data.getHours() + ":" + data.getMinutes() + ":" + data.getSeconds();
    return dataString;
}
  
function addHoursToDate(dateObj,intHour){
    var numberOfM1Seconds = dateObj.getTime();
    var addMlSeconds = (intHour * 60) * 60 * 1000;
    var newDateObj = new Date(numberOfM1Seconds + addMlSeconds);
  
    return newDateObj;
}

module.exports = addHoursToDate();
module.exports = formatarData();