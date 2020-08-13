import * as Constants from './constants';

// Format: HH:MM - MM/DD/YYYY 
export const getTimestamp = () => {
  let dateObj = new Date();

  let year = dateObj.getFullYear();
  let month = "";
  let date = dateObj.getDate();
  let hour = -1; 
  let minute = dateObj.getMinutes();

  let hours24 = dateObj.getHours();

  // AM - Ante meridiem
  // PM - Post meridiem
  // Returns the hour (0–23) in the specified date according to local time.
  let meridiem = hours24 / 12 >= 1 ? Constants.Timestamp_PM : Constants.Timestamp_AM;

  switch(dateObj.getMonth()){
    case 0: 
      month = Constants.Timestamp_Jan;
      break;
    case 1: 
      month = Constants.Timestamp_Feb;
      break;
    case 2: 
      month = Constants.Timestamp_Mar;
      break;
    case 3: 
      month = Constants.Timestamp_Apr;
      break;
    case 4: 
      month = Constants.Timestamp_May;
      break;
    case 5: 
      month = Constants.Timestamp_Jun;
      break;
    case 6: 
      month = Constants.Timestamp_Jul;
      break;
    case 7: 
      month = Constants.Timestamp_Aug;
      break;
    case 8: 
      month = Constants.Timestamp_Sept;
      break;
    case 9: 
      month = Constants.Timestamp_Oct;
      break;
    case 10: 
      month = Constants.Timestamp_Nov;
      break;
    case 11: 
      month = Constants.Timestamp_Dec;
  }

  
  switch (hours24){
    // Noon or Midnight
    case 0:
      hour = 12;
      break;
    default:
      hour = hours24 % 12;
  }

  let timestamp = hour + ":" + minute + " " + meridiem + " - " + month + " " + date + ", " + year;

  return timestamp;
}
