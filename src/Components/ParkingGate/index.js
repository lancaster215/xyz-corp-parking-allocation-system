import React from "react";
import axios from "axios";

import { parkingSizes } from "../../util/utils";
import { ParkingSlot } from "../ParkingSlot";
import { StyledButton } from "./classes";
import { Typography } from "@mui/material";

export const ParkingGate = (props) => {
  const{
    addedParkingSlot
  } = props
  const { gate, carParked } = props;
  const [parkingSlot, setParkingSlot] = React.useState([]);
  const [allParkingSlots, setAllParkingSlots] = React.useState([]);

  const addParkingSlot = (id) => {
    addedParkingSlot(true);
    axios({
      method: "POST",
      url: "http://localhost:3001/api/addparkingslot",
      data: {
        size: Math.floor(Math.random() * 3).toString(),
        occupied: false,
        parkingGateId: id.target.value,
        parkingDistance: Math.floor(Math.random() * 5) //the parking gate muna yung distance
      },
    })
      .then((res) => {
        // setParkingSlots(res.data);
      })
      .catch((err) => console.log(err));
  };

  React.useEffect(() => {
    //previous state of parkingSlot
    if(carParked) {
      setAllParkingSlots(parkingSlot);
    }else{
      axios({
        method: "GET",
        url: `http://localhost:3001/api/getparkingslot/${gate.id}`,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        // console.log(res.data)
        setParkingSlot(res.data.sort((a,b) => {return a.parkingdistance - b.parkingdistance}));
      })
      .catch((err) => console.log(err));
    }
  }, [gate.id, carParked, parkingSlot, allParkingSlots]);

  return (
    <div>
      <Typography>Parking Gate {parkingSizes(gate.id)}</Typography>
      <StyledButton variant="contained" onClick={addParkingSlot} value={gate.id}>
        +
      </StyledButton>
      {/* .sort((a,b) => {return a.parkingdistance - b.parkingdistance})*/}
      {
        carParked ?
          allParkingSlots?.map((Slot, index) => {
            return (
              <ParkingSlot
                carParked={carParked}
                Slot={Slot}
                key={index}
                gate={parkingSizes(gate.id)}
              />
            );
          })
        : parkingSlot?.map((Slot, index) => {
          return (
            <ParkingSlot
              carParked={carParked}
              Slot={Slot}
              key={index}
              gate={parkingSizes(gate.id)}
            />
          );
      })}
    </div>
  );
};
