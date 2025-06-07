import * as Icons from '../assets';

export const randomColors = (array) => {
  let currentIndex = array.length, randomIndex;

  randomIndex = Math.floor(Math.random() * currentIndex);

  return array[randomIndex];
}

export const plateNumberGenerator = () => {
  let text = "";
  let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for(let i=0; i < 3; i++ ) {
      text += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  const randomNumbers = Math.floor(Math.random() * (999 - 0 + 1)) + 0;

  return text+randomNumbers;
}

export const shuffle = (array) => {
	let currentIndex = array.length,  randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
			array[randomIndex], array[currentIndex]];
  }

  return array;
}

export const parkingSizes = (id) => {
  let correspondingLetter;
  for(let i = 0; i <= 26; i++){
    if(id === i){
      correspondingLetter = String.fromCharCode('a'.charCodeAt(0) + id-1)
    }
    if(id > 26){
      return;
    }
  }

  return correspondingLetter.toUpperCase();
}

let hourDiff, dayDiff, returnAndExitHourDiff;

export const getDateTimeDifference = (carTicket, dateNow, carReturned) => {
  const date1ToArr = carTicket?.entrytime.split('');//date1=entrytime,
  const date2ToArr = dateNow.split('');//date2=exittime,
  const date3ToArr = carReturned ? carTicket?.returntime.split('') : null;//date3=returntime,
  let hour1, hour2;
  let day1, day2;
  let returnHour = 0;

  for(let x = 0; x <= date1ToArr.length - 1; x++){
    day1 = parseInt(date1ToArr[8] + date1ToArr[9]);
    hour1 = parseInt(date1ToArr[14] + date1ToArr[15]); //11 12 for hours 14 15 for minutes
  }

  for(let y = 0; y <= date2ToArr.length - 1; y++){
    day2 = parseInt(date2ToArr[8] + date2ToArr[9]);
    hour2 = parseInt(date2ToArr[14] + date2ToArr[15])
  }

  if(carReturned){
    for(let z = 0; z <= date3ToArr.length - 1; z++){
      returnHour = parseInt(date3ToArr[14] + date3ToArr[15]);
    }
    returnAndExitHourDiff = hour2 - returnHour;
  }else{
    returnAndExitHourDiff = 0;
  }

  if(hour1 - hour2 !== 0) {
    hourDiff = hour2 - hour1
  } else {
    hourDiff = 0;
  };
  if(day1 - day2 !== 0){
    dayDiff = day2 - day1;
  } else {
    dayDiff = 0;
  }
  return (dayDiff + "day/s and " + hourDiff + "hr/s");
}

export const getParkingFee = (size, returningCar) => {
  let finalHourToCompute = returnAndExitHourDiff > 0  ? Math.ceil(returnAndExitHourDiff) : Math.ceil(hourDiff)
  let parkingFee = 0;
  let excessHour = finalHourToCompute - 24;
  let flatRate = 40;
  
  if(Math.ceil(finalHourToCompute) >= 24){ // 28hrs, 24hrs = 5000, 4hrs excess = +5000;
    let excessFee = 0;

    if(size === 0) {
      excessFee = Math.ceil(excessHour) * 20;
    }else if (size === 1){
      excessFee = Math.ceil(excessHour) * 60;
    }else if (size === 2){
      excessFee = Math.ceil(excessHour) * 100;
    }
    parkingFee = parkingFee + excessFee;
  }else{
    let excessHour = finalHourToCompute - 3;
    
    if(returningCar){ //boolean
      let hourlyFee = 0;
      if(size === 0) {
        hourlyFee = Math.ceil(finalHourToCompute) * 20;
      }else if (size === 1){
        hourlyFee = Math.ceil(finalHourToCompute) * 60;
      }else if (size === 2){
        hourlyFee = Math.ceil(finalHourToCompute) * 100;
      }
      parkingFee = hourlyFee;
    }else{
      if(Math.ceil(finalHourToCompute) > 3){ //5hrs
        let hourlyFee = 0;
        if(size === 0) {
          hourlyFee = Math.ceil(excessHour) * 20;
        }else if (size === 1){
          hourlyFee = Math.ceil(excessHour) * 60;
        }else if (size === 2){
          hourlyFee = Math.ceil(excessHour) * 100;
        }
        parkingFee = hourlyFee + flatRate;
      }else {
        parkingFee = flatRate;
      }
    } 
  }
  return parkingFee;
}

export const IconComponent = (props) => {
  var component = Icons;
  var mainIcon =
    props.icon2 === null || props.icon2 === '' ? 'UnknownItem' : props.icon2;
  var SpecificIcon = component[mainIcon];
  return (
    <SpecificIcon
      color={props.color}
      iconColor={props.iconColor}
      width={props.width}
      height={props.height}
    />
  );
}

export const getFormattedNowDate = () => {
  const now = new Date();

  const year = now.getFullYear(); // returns 2025
  const month = String(now.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
  const day = String(now.getDate()).padStart(2, '0');

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const milliseconds = now.getMilliseconds(); // returns 0-999
  const microseconds = String(milliseconds * 1000).padStart(6, '0'); // convert to 6-digit format

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${microseconds}`;
}