import React, { useCallback, useRef } from "react";
import axios from "axios";

import { parkingSizes } from "../../util/utils";
import { ParkingSlot } from "../ParkingSlot";
import { StyledButton } from "./classes";
import { Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setPotentialSlot } from "../../redux/actions";

export const ParkingGate = (props) => {
  const dispatch = useDispatch()
  const { gate, carParked } = props;
  const [parkingSlot, setParkingSlot] = React.useState([]);
  const [addedParkingSlot, setAddedParkingSlot] = React.useState(false);
  const { potentialSlot, carDetails, carExited, c_p } = useSelector((state) => state.instances);
  let isMounted = useRef(true)
  const pollInterval = 3000

  const slotAllocationService = useCallback((carDetails, allParkingSlotTest) => {
    let potentialParkingSlot = []
    potentialParkingSlot = allParkingSlotTest.filter((d) => d.size >= carDetails.size && d.occupied === false );
    const parkingdistancesss = potentialParkingSlot.map(d => d.parkingdistance)
    const lowest = Math.min(...parkingdistancesss);
    const newbiew = potentialParkingSlot.filter((data) => data.parkingdistance === lowest);
    return newbiew[0];
  }, []);
  
  const addParkingSlotById = async (id) => {
    id.preventDefault();
    await axios({
      method: "POST",
      url: "http://localhost:3001/api/addparkingslot",
      data: {
        size: Math.floor(Math.random() * 3).toString(),
        occupied: false,
        parkingGateId: id.target.value,
        parkingDistance: Math.floor(Math.random() * 5) //the parking gate muna yung distance
      },
    }).catch((err) => console.log(err));

    setAddedParkingSlot(true)
  };

  const fetchPakingSlotById = useCallback(async(carDetails) => {
    try {
      const [parkingSlotDataPerId, parkingSlotData] = await Promise.all([
        axios({
          method: "GET",
          url: `http://localhost:3001/api/getparkingslot/${gate.id}`,
          headers: {
            "Content-Type": "application/json",
          },
        }),
        axios({
          method: "GET",
          url: 'http://localhost:3001/api/getallparkingslots',
          headers: {
            "Content-Type": "application/json",
          }
        })
      ])

      const [parkingSlotPerIdJSON, parkingSlotDataJSON] = await Promise.all([
        parkingSlotDataPerId.data, 
        parkingSlotData.data
      ])
      if(!parkingSlotPerIdJSON || !parkingSlotDataJSON) {
        if(isMounted.current) {
          setTimeout(fetchPakingSlotById, pollInterval)
        }
        return;
      }
      setParkingSlot([...parkingSlotPerIdJSON].sort((a, b) => a.parkingDistance - b.parkingDistance));
      dispatch(setPotentialSlot(slotAllocationService(carDetails, parkingSlotDataJSON)));
    } catch (err) {
      console.log(err)
    }
  },[isMounted, gate.id, dispatch, slotAllocationService]);

  React.useEffect(() => {
    fetchPakingSlotById(carDetails)
    return () => {
      isMounted.current = false;
    }
  }, [isMounted, carDetails, fetchPakingSlotById]);

  React.useEffect(() => {
    // Retrigger fetching if nothing to return
    if(addedParkingSlot || carExited || c_p) {
      fetchPakingSlotById(carDetails);
      setAddedParkingSlot(false);
    }
  },[addedParkingSlot, carExited, carDetails, c_p, fetchPakingSlotById])

  return (
    <div>
      <Typography>Parking Gate {parkingSizes(gate.id)}</Typography>
      <StyledButton variant="contained" onClick={addParkingSlotById} value={gate.id}>
        +
      </StyledButton>
      {
        potentialSlot?.length > 0 ?
          potentialSlot?.map((Slot, index) => {
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
