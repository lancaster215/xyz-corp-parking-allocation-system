import { Typography } from "@mui/material";
import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { getDateTimeDifference, getParkingFee, getFormattedNowDate } from "../../util/utils";
import { ListDiv, StyledButton } from "./classes";
import { sizes } from "../../constants/const";
import { setCarExited } from "../../redux/actions";

export const ParkingSlot = ({ Slot, gate}) => {
  const dispatch = useDispatch();
  const { carReturned } = useSelector((state) => state.instances);
  const [carTicket, setCarTicket] = React.useState();
  const [localCarExited, setLocalCarExited] = React.useState(false)
  const [showCarTicketDetails, setShowCarTicketDetails] = React.useState(false);

  const exitCar = async ({ currentTarget }) => {
    try {
      const [ticketIdData] = await Promise.all([
        axios({
          method: "GET",
          url: `http://localhost:3001/api/getticketvid/${Slot.vehicleid}`,
          headers: {
            "Content-Type": "application/json",
          }
        }),
        axios({
          method: "POST",
          url: `http://localhost:3001/api/updateparkingticket`,
          data: {
            vid: Slot.vehicleid,
          }
        }),
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
        })
      ])
      setCarTicket(ticketIdData?.data)
    } catch (err) {
      console.log(err, 'Error getting new car ticket, updating parking ticket, or updating parking slot.')
    }

    setTimeout(() => {
      setLocalCarExited(true);
      setShowCarTicketDetails(false);
      dispatch(setCarExited(true));
    }, 3000)
  }

  const showOccupiedCarDetails = async ({ target }) => {
    setShowCarTicketDetails(true)
    try {
      await axios({
        method: "GET",
        url: `http://localhost:3001/api/getticketvid/${target.value}`,
        headers: {
          "Content-Type": "application/json",
        }
      }).then((res) => {
        setCarTicket(res?.data);
      })
    } catch (err) {
      console.log(err, 'Error getting new car ticket.')
    }
  }

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
            
      {showCarTicketDetails && carTicket &&
        <div style={{position: 'relative'}}>
          <button style={{position: 'absolute', right: 0, border: 'none'}} onClick={() => setShowCarTicketDetails(false)}>x</button>
          <ul>
            <li><Typography>Parking Gate: Gate {gate}</Typography></li>
            <li><Typography>Parking Slot: {carTicket && carTicket[0]?.parkingslotid}</Typography></li>
            <li><Typography>Entry time: {carTicket && carTicket[0]?.entrytime}</Typography> </li>
            <li><Typography>Car License Number: {carTicket && carTicket[0]?.licensenumber}</Typography></li>
            <li><Typography>Car Color: {carTicket && carTicket[0]?.color}</Typography></li>
            <li><Typography>Car Size: {carTicket && sizes[carTicket[0]?.size]}</Typography></li>
            {carReturned && (<><li><Typography>Exit time: {carTicket[0]?.exittime}</Typography></li>
            <li><Typography>Return time: {carTicket && carTicket[0]?.returntime}</Typography></li></>)}
          </ul>
        </div>
      }

      {localCarExited && carTicket &&
        <div style={{position: 'relative'}}>
          <button 
            style={{
              position: 'absolute', 
              right: 0, 
              border: 'none'
            }} 
            onClick={() => {
              setLocalCarExited(false);
              dispatch(setCarExited(false))
            }}
          >x</button>
          <ul>
            <li><Typography>Parking Gate {gate}</Typography></li>
            <li><Typography>Parking Slot: {carTicket && carTicket[0]?.parkingslotid}</Typography></li>
            <li><Typography>Entry time: {carTicket && carTicket[0]?.entrytime}</Typography> </li>
            <li><Typography>Exit time: {'2022-09-28 17:30:54.702898'}</Typography></li>
            <li><Typography>Car License Number: {carTicket && carTicket[0]?.licensenumber}</Typography></li>
            <li><Typography>Car Color: {carTicket && carTicket[0]?.color}</Typography></li>
            <li><Typography>Car Size: {carTicket && sizes[carTicket[0]?.size]}</Typography></li>
            <li><Typography>Parking duration: {getDateTimeDifference(carTicket && carTicket[0], getFormattedNowDate(), carReturned)}</Typography></li>
            <li><Typography>Parking fee: ₱{getParkingFee(Slot.size)}</Typography></li>
          </ul>
        </div>
      }
    </ListDiv>
  );
};
