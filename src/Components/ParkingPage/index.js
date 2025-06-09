import React, { useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';

import { addNewCar, setCP, setCarReturned, setCarExited } from "../../redux/actions";

import { randomColors, plateNumberGenerator, IconComponent } from "../../util/utils";
import { colorsArray  } from "../../constants/const";
import { ParkingGate } from "../ParkingGate";
import { Grid, Typography} from "@mui/material";
import { MainDiv, HeaderDiv, StyledButton, ListDiv } from "./classes";
import { sizes } from "../../constants/const";
import { CustomModal } from "../../Modal";

export const ParkingPage = () => {
  const dispatch = useDispatch();
  const {carDetails, carExited, potentialSlot} = useSelector((state) => state.instances);

  const [allParkingGates, setAllParkingGates] = React.useState();
  const [parkingMessage, setParkingMessage] = React.useState({msg: '', state: false});
  const [openModal,setOpenModal] = React.useState(false);
  const [parkingTicket, setParkingTicket] = React.useState();
  const [allExitedCars, setAllExitedCars] = React.useState();
  const [addedParkingGate, setAddedParkingGate] = React.useState(false);
  let isMounted = useRef(true);
  const pollInterval = 3000;

  const handleChange = ({target}) => {
    dispatch(addNewCar(allExitedCars.filter((d) => d.licensenumber === target.value)[0]));
  };

  const parkReturningCar = async () => {
    if(potentialSlot === undefined){ //Means no parking lot available for that vehicle
      setOpenModal(true);
      setParkingMessage({msg: "No Available Parking lot for this vehicle", state: false});
    }else{
      setOpenModal(true);
      setParkingMessage({msg: "Vehicle successfully parked!", state: true});
      dispatch(addNewCar({}));
      dispatch(setCP(true));

      try {
        await Promise.all([
          axios({
            method: "POST",
            url: `http://localhost:3001/api/returntime/${carDetails.id}`,
          }),
          axios({
            method: "POST",
            url: `http://localhost:3001/api/parkingslot/${carDetails.id}`,
            data: {
              psid: potentialSlot.id,
              state: true,
            },
            headers: {
              "Content-Type": "application/json",
            },
          })
        ])

        setParkingTicket({vehicleid: carDetails.id});
      } catch (err) {
        console.log()
      }
      dispatch(setCarReturned(true));
    }
  }

  const closeModal = () => {
    setOpenModal(false);
    dispatch(addNewCar({}));
  }

  const addCar = async () => {
    setParkingMessage({msg:"", state: false});
    await axios({
      method: "POST",
      url: "http://localhost:3001/api/car",
      data: {
        size: Math.floor(Math.random() * 3).toString(),
        color: randomColors(colorsArray),
        licenseNumber: plateNumberGenerator()
      },
      headers: {
        "Content-Type": "application/json",
      }
    }).then((res) => {
      dispatch(setCarExited(false));
      dispatch(addNewCar(res.data));
    }).catch((err) => {
      console.log(err, 'Error adding new Car.')
    })
    
    // dispatch(setPotentialSlot([]));
  }

  const addParkingGate = async () => {
    setAddedParkingGate(true)
    try {
      await axios({
        method: "POST",
        url: "http://localhost:3001/api/parkinggate",
        headers: {
          "Content-Type": "application/json",
        }
      })
    } catch(err) {
      console.log(err, 'Error adding new Parking Lot.')
    }
  }

  const parkingService = async () => {
    // setDispensedTicket(true);
    if(potentialSlot === undefined){ //Means no parking lot available for that vehicle
      setOpenModal(true);
      setParkingMessage({msg: "No Available Parking lot for this vehicle", state: false});
    }else{
      try {
        const [parkingTicket] = await Promise.all([
          await axios({
            method: "POST",
            url: "http://localhost:3001/api/parkingticket",
            data: {
              psid: potentialSlot.id,
              vid: carDetails.id,
            },
            headers: {
              "Content-Type": "application/json",
            },
          }),
          await axios({
            method: "POST",
            url: `http://localhost:3001/api/parkingslot/${carDetails.id}`,
            data: {
              psid: potentialSlot.id,
              state: true,
            },
            headers: {
              "Content-Type": "application/json",
            },
          })
        ])
        const [parkingJSON] = await Promise.all([
          parkingTicket.data,
        ])

        if(parkingJSON) {
          setOpenModal(true);
          setParkingMessage({msg: "Vehicle successfully parked!", state: true});
          dispatch(addNewCar({}));
          dispatch(setCarReturned(false));
          dispatch(setCP(true));
        }

        setParkingTicket(parkingJSON);
      } catch(err) {
        setOpenModal(true);
        setParkingMessage({msg: "There was an error encountered during parking!", state: false});
      }
      
    }
  }

  const fetchParkingGateAndTicket = useCallback(async () => {
    try {
      const[parkingGateData, parkingTicketData] = await Promise.all([
        axios({
          method: 'GET',
          url: "http://localhost:3001/api/parkinggates",
          headers: {
            "Content-Type": "application/json",
          }
        }),
        axios({
          method: "GET",
          url: "http://localhost:3001/api/parkingtickets",
          headers: {
            "Content-Type": "application/json",
          }
        })
      ])
      const [gateJSON, ticketJSON] = await Promise.all([
        parkingGateData.data,
        parkingTicketData.data,
      ])

      if(!gateJSON || !ticketJSON) {
        if (isMounted.current) {
          setTimeout(fetchParkingGateAndTicket, pollInterval);
        }
        return;
      }
      console.log(ticketJSON.filter((d) => d.exittime !== null && d.returntime === null), 'tickets')
      setAllParkingGates(gateJSON);
      setAllExitedCars(ticketJSON.filter((d) => d.exittime !== null && d.returntime === null))
    } catch(err) {
      console.log(err, 'Error adding new Parking Lot.')
    }
  },[isMounted])

  React.useEffect(() => {
    fetchParkingGateAndTicket()
    return () => {
      isMounted.current = false;
    };
  }, [isMounted, fetchParkingGateAndTicket]);

  React.useEffect(() => {
    if(addedParkingGate || carExited){
      fetchParkingGateAndTicket(); //fetch another
      setAddedParkingGate(false)
    }
  },[addedParkingGate, carExited, fetchParkingGateAndTicket])

  return (
    <div>
      <MainDiv container>
        <HeaderDiv>
          <Typography>Parking Lot System</Typography>
        </HeaderDiv>
        <Grid container>
          <Grid item xs={3}>
            <StyledButton variant="contained" color="primary" onClick={addCar}>Add Car</StyledButton>
          </Grid>
          <Grid item xs={3}>
            <StyledButton variant="contained" onClick={parkingService}>Park Car</StyledButton>
          </Grid>
          <Grid item xs={3}>
            <StyledButton variant="contained" onClick={addParkingGate}><Typography style={{fontSize: '0.70em'}}>Add Parking Gate</Typography></StyledButton>
          </Grid>
          <Grid item xs={3}>
            
            <StyledButton variant="contained" onClick={parkReturningCar}><Typography style={{fontSize: '0.70em'}}>Park Returning Car</Typography></StyledButton>
            <select id="cars" onChange={handleChange} style={{
              margin: '1em 0em',
              padding: '0.5em',
              borderRadius: '5px',
              background: '#FFFFFF',
              border: '1px solid #007fff',
              color: '#000000'
            }}>
              <option>SELECT CAR TO RETURN</option>
              {allExitedCars?.map((name, i) => (
                <option key={i}>{name.licensenumber}</option>
              ))}
            </select>
          </Grid>
        </Grid>
        <Grid style={{display: 'flex', justifyContent: 'center', width: '100%'}}>
          <ListDiv item xs={6}>
            <Typography><b>Car Details</b></Typography>
            <div style={{display: 'flex'}}>
              <IconComponent icon2={'Car'} color={carDetails?.color} height='15vh' width='10vw'/>
              <ul>
                <li><Typography>Size: { sizes[carDetails?.size] } car</Typography></li>
                <li><Typography style={{color: carDetails?.color}}>Color: {carDetails?.color}</Typography></li>
                <li><Typography>LicenseNumber: {carDetails?.licensenumber}</Typography></li>
              </ul>
            </div>
          </ListDiv>
        </Grid>
      </MainDiv>
      <div>
        <CustomModal 
          open={openModal} 
          handleClose={closeModal}
          modalText={parkingMessage.msg}
          showTicketDetails={parkingMessage.state}
          parkingTicket={parkingTicket}/>
        <div style={{display: 'flex', justifyContent: 'space-around'}}>
          {
            allParkingGates?.map((gate, index) => {
              return (
                <ParkingGate
                  gate={gate}
                  key={index}
                />
              );
            })
          }
        </div>
      </div>
    </div>
  );
};
