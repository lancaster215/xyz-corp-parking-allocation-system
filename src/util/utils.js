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

let hourDiff, dayDiff;

export const getDateTimeDifference = (date1, date2) => {
  const date1ToArr = date1.split('');
  const date2ToArr = date2.split('');
  let hour1, hour2;
  let day1, day2;

  for(let x = 0; x <= date1ToArr.length - 1; x++){
    day1 = parseInt(date1ToArr[8] + date1ToArr[9]);
    hour1 = parseInt(date1ToArr[14] + date1ToArr[15]); //11 12 for hours 14 15 for minutes
  }

  for(let y = 0; y <= date2ToArr.length - 1; y++){
    day2 = parseInt(date2ToArr[8] + date2ToArr[9]);
    hour2 = parseInt(date2ToArr[14] + date2ToArr[15])
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

export const getParkingFee = (size) => {
  let parkingFee;
  if(Math.ceil(hourDiff) === 24){
    parkingFee = 5000; 
  }
  if(Math.ceil(hourDiff) > 3){
    if(size === 0) {
      parkingFee = Math.ceil(hourDiff) * 20;
    }else if (size === 1){
      parkingFee = Math.ceil(hourDiff) * 60;
    }else if (size === 2){
      parkingFee = Math.ceil(hourDiff) * 100;
    }
  }else {
    parkingFee = 40;
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