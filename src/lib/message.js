const moment = require('moment-timezone');
const time = moment().utcOffset("+05:30").format('hh:mm a')
module.exports = time