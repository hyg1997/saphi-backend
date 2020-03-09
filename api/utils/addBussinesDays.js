const moment = require('moment');

const holidays = [
  '2020-01-01',
  '2020-04-09',
  '2020-04-10',
  '2020-05-01',
  '2020-06-29',
  '2020-07-27',
  '2020-07-28',
  '2020-07-29',
  '2020-08-30',
  '2020-10-08',
  '2020-10-09',
  '2020-11-01',
  '2020-12-08',
  '2020-12-25',
  '2020-12-31',
];

module.exports = (originalDate, numDaysToAdd) => {
  const Sunday = 0;
  const Saturday = 6;
  let daysRemaining = numDaysToAdd;
  const newDate = moment(originalDate);
  while (daysRemaining > 0) {
    newDate.add(1, 'days');
    if (
      newDate.day() !== Sunday &&
      newDate.day() !== Saturday &&
      !holidays.find(day => day === newDate.format('YYYY-MM-DD'))
    ) {
      daysRemaining -= 1;
    }
  }

  return newDate;
};
