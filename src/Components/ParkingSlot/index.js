import { Typography } from "@mui/material";
import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { setPotentialSlot } from "../../redux/actions";
import { getDateTimeDifference, getParkingFee } from "../../util/utils";
import { ListDiv, StyledButton } from "./classes";
import { sizes } from "../../constants/const";

var potentialParkingSlot = [];

const slotAllocationService = (carDetails, cp, allParkingSlotTest) => {
  //resets if the car is already parked and given a ticket by the admin;
  if(cp){
    potentialParkingSlot = [];
  }
  potentialParkingSlot = allParkingSlotTest.filter((d) => {
    let data;
    if(d.size >= carDetails.size && d.occupied === false ){
      data = d;
    }
    return data;
  });
  const parkingdistancesss = potentialParkingSlot.map(d => d.parkingdistance)
  const lowest = Math.min(...parkingdistancesss);
  const newbiew = potentialParkingSlot.filter((data) => {
    return data.parkingdistance === lowest;
  });
  return newbiew[0];
};

export const ParkingSlot = ({ Slot, closestToGate, gate}) => {
  const carDetails = useSelector((state) => state.instances.carDetails);
	const dispatch = useDispatch();
  const c_p = useSelector((state) => state.instances.c_p);
  const carReturned = useSelector((state) => state.instances.carReturned);
  const [carTicket, setCarTicket] = React.useState();
  const [showCarTicketDetails, setShowCarTicketDetails] = React.useState(false);
  const [carTicketDetails, setCarTicketDetails] = React.useState();
  const [carExited, setCarExited] = React.useState(false);

  const exitCar = ({ currentTarget }) => {
    axios({
      method: "POST",
      url: `http://localhost:3001/api/updateparkingticket`,
      data: {
        vid: Slot.vehicleid,
      }
    })
    .then((res) => {
    }).catch((err) => {
      console.log(err, 'Error updating parking ticket.')
    })

    axios({
      method: "POST",
      url: "http://localhost:3001/api/updateparkingslot",
      data: {
        psid: currentTarget.value,
        vid: Slot.vehicleid,
        state: false,
      },
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
    }).catch((err) => console.log(err));
    
    
    setTimeout(() => {
      axios({
        method: "GET",
        url: `http://localhost:3001/api/getticketvid/${Slot.vehicleid}`,
        headers: {
          "Content-Type": "application/json",
        }
      }).then((res) => {
        console.log(res.data)
        setCarTicket(res.data);
      }).catch((err) => {
        console.log(err, 'Error getting new car ticket.')
      })
    }, 2000)

    setTimeout(() => {
      setCarExited(true);
    }, 3000)
  }

  const showOccupiedCarDetails = ({ target }) => {
    setShowCarTicketDetails(true)
    axios({
      method: "GET",
      url: `http://localhost:3001/api/getticketvid/${target.value}`,
      headers: {
        "Content-Type": "application/json",
      }
    }).then((res) => {
      // console.log(res.data)
      setCarTicket(res.data);
    }).catch((err) => {
      console.log(err, 'Error getting new car ticket.')
    })
  }

  React.useEffect(() => {
    axios({
      method: "GET",
      url: 'http://localhost:3001/api/getallparkingslots',
      headers: {
        "Content-Type": "application/json",
      }
    })
    .then((res) => {
      dispatch(setPotentialSlot(slotAllocationService(carDetails, c_p, res.data)));
    })
    .catch((err) => console.log(err));

    if(carTicket?.length > 0){
      setCarTicketDetails(carTicket[0]);
    }
  }, [Slot, carDetails, dispatch, c_p, closestToGate, carTicket]);

  return (
    <ListDiv style={{margin: `${Slot.parkingdistance+2}em 0em`, backgroundColor: `${Slot.occupied ? '#00800050' : '#ff000050'}`}}>
      <ul style={{paddingLeft: '1em'}}>
        <li><Typography><b>Slot distance:</b> {Slot.parkingdistance} </Typography></li>
        <li><Typography><b>Slot Size:</b> {sizes[Slot.size]} parking</Typography></li>
        <li><Typography><b>Slot State:</b><span style={{color: Slot.occupied ? "green" : "red"}}>{Slot.occupied ? "Occupied" : "Unoccupied"}</span></Typography></li>
      </ul>
      <div>
        {Slot.occupied && <StyledButton variant="contained" onClick={exitCar} value={Slot.id}><Typography>Exit Car</Typography></StyledButton>}
        {Slot.occupied && <StyledButton variant="contained" onClick={showOccupiedCarDetails} value={Slot.vehicleid}>Show Car Details</StyledButton>}
      </div>
            
      {showCarTicketDetails &&
        <div style={{position: 'relative'}}>
          <button style={{position: 'absolute', right: 0, border: 'none'}} onClick={() => setShowCarTicketDetails(false)}>x</button>
          <ul>
            <li><Typography>Parking Gate: Gate {gate}</Typography></li>
            <li><Typography>Parking Slot: {carTicketDetails?.parkingslotid}</Typography></li>
            <li><Typography>Entry time: {carTicketDetails?.entrytime}</Typography> </li>
            <li><Typography>Car License Number: {carTicket && carTicket[0]?.licensenumber}</Typography></li>
            <li><Typography>Car Color: {carTicket && carTicket[0]?.color}</Typography></li>
            <li><Typography>Car Size: {carTicket && sizes[carTicket[0]?.size]}</Typography></li>
            {carReturned && (<><li><Typography>Exit time: {carTicketDetails?.exittime}</Typography></li>
            <li><Typography>Return time: {carTicketDetails?.returntime}</Typography></li></>)}
          </ul>
        </div>
      }

      {carExited &&
        <div style={{position: 'relative'}}>
          <button style={{position: 'absolute', right: 0, border: 'none'}} onClick={() => setCarExited(false)}>x</button>
          <ul>
            <li><Typography>Parking Gate {gate}</Typography></li>
            <li><Typography>Parking Slot: {carTicketDetails?.parkingslotid}</Typography></li>
            <li><Typography>Entry time: {carTicketDetails?.entrytime}</Typography> </li>
            <li><Typography>Exit time: {'2022-09-28 17:30:54.702898'}</Typography></li>
            <li><Typography>Car License Number: {carTicket && carTicket[0]?.licensenumber}</Typography></li>
            <li><Typography>Car Color: {carTicket && carTicket[0]?.color}</Typography></li>
            <li><Typography>Car Size: {carTicket && sizes[carTicket[0]?.size]}</Typography></li>
            <li><Typography>Parking duration: {getDateTimeDifference(carTicketDetails?.entrytime, '2022-09-28 17:30:54.702898', carTicketDetails?.returntime, carReturned)}</Typography></li>
            <li><Typography>Parking fee: ₱{getParkingFee(Slot.size)}</Typography></li>
          </ul>
        </div>
      }
    </ListDiv>
  );
};
