import React from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';

import { addNewCar, setPotentialSlot, setCP, setCarReturned } from "../../redux/actions";

import { randomColors, plateNumberGenerator, IconComponent } from "../../util/utils";
import { colorsArray  } from "../../constants/const";
import { ParkingGate } from "../ParkingGate";
import { Grid, Typography} from "@mui/material";
import { MainDiv, HeaderDiv, StyledButton, ListDiv } from "./classes";
import { sizes } from "../../constants/const";
import { CustomModal } from "../../Modal";

export const ParkingPage = () => {
  const dispatch = useDispatch();
  const carDetails = useSelector((state) => state.instances.carDetails);
  const potentialSlot = useSelector((state) => state.instances.potentialSlot);

  const [allParkingGates, setAllParkingGates] = React.useState();
  const [dispensedTicket, setDispensedTicket] = React.useState(false);
  const [carParked, setCarParked] = React.useState(false);
  const [parkingMessage, setParkingMessage] = React.useState({msg: '', state: false});
  const [_addedParkingSlot, setAddedParkingSlot] = React.useState(false);
  const [openModal,setOpenModal] = React.useState(false);
  const [parkingTicket, setParkingTicket] = React.useState();
  const [allExitedCars, setAllExitedCars] = React.useState();
  const [exitedCarDetails, setExitedCarDetails] = React.useState('');

  const handleChange = ({target}) => {
    // setParkingMessage({msg:"", state: false});
    // dispatch(setCP(false));

    dispatch(addNewCar(allExitedCars.filter((d) => d.licensenumber === target.value)[0]));
    setExitedCarDetails(target.value);


    // setCarParked(true);
  };

  const parkReturningCar = () => {
    setDispensedTicket(true);
    if(potentialSlot === undefined){ //Means no parking lot available for that vehicle
      setOpenModal(true);
      setParkingMessage({msg: "No Available Parking lot for this vehicle", state: false});
    }else{
      setOpenModal(true);
      setParkingMessage({msg: "Vehicle successfully parked!", state: true});
      dispatch(addNewCar({}));
      setDispensedTicket(false);
      dispatch(setCP(true));

      axios({
        method: "POST",
        url: "http://localhost:3001/api/updateparkingSlot",
        data: {
          psid: potentialSlot.id,
          vid: carDetails.id,
          state: true,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
      }).catch((err) => console.log(err));
      dispatch(setCarReturned(true));

      axios({
        method: "POST",
        url: "http://localhost:3001/api/updatereturntime",
        data: {
          vid: carDetails.id
        }
      })
      .then((res) => {
        setParkingTicket({vehicleid: carDetails.id});
      }).catch((err) => {
        // console.log(err, 'Error adding new Car.')
      })
    }
    setCarParked(false);
  }

  const addedParkingSlot = () => {
    setAddedParkingSlot(true)
  }

  const closeModal = () => {
    setOpenModal(false);

    dispatch(addNewCar({}));
    setDispensedTicket(false);
    dispatch(setCP(true));
  }

  const addCar = () => {
    setParkingMessage({msg:"", state: false});
    dispatch(setCP(false));
    axios({
      method: "POST",
      url: "http://localhost:3001/api/addcar",
      data: {
        size: Math.floor(Math.random() * 3).toString(),
        color: randomColors(colorsArray),
        licenseNumber: plateNumberGenerator()
      },
      headers: {
        "Content-Type": "application/json",
      }
    }).then((res) => {
      // console.log(res.data)
      dispatch(addNewCar(res.data));
    }).catch((err) => {
      console.log(err, 'Error adding new Car.')
    })
    dispatch(setPotentialSlot([]));

    setCarParked(true);
  }

  const addParkingGate = () => {
    axios({
      method: "POST",
      url: "http://localhost:3001/api/addparkinggate",
      headers: {
        "Content-Type": "application/json",
      }
    }).then((res) => {
    }).catch((err) => {
      console.log(err, 'Error adding new Parking Lot.')
    })
  }

  const parkingService = () => {
    setDispensedTicket(true);
    if(potentialSlot === undefined){ //Means no parking lot available for that vehicle
      setOpenModal(true);
      setParkingMessage({msg: "No Available Parking lot for this vehicle", state: false});
    }else{
      setOpenModal(true);
      setParkingMessage({msg: "Vehicle successfully parked!", state: true});
      dispatch(addNewCar({}));
      setDispensedTicket(false);
      dispatch(setCP(true));

      axios({
        method: "POST",
        url: "http://localhost:3001/api/updateparkingSlot",
        data: {
          psid: potentialSlot.id,
          vid: carDetails.id,
          state: true,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
      }).catch((err) => console.log(err));

      axios({
        method: "POST",
        url: "http://localhost:3001/api/addparkingticket",
        data: {
          psid: potentialSlot.id,
          vid: carDetails.id,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        setParkingTicket(res.data);
      }).catch((err) => console.log(err));
    }
    setCarParked(false);
  }

  React.useEffect(() => {
    axios({
      method: "GET",
      url: "http://localhost:3001/api/parkinggates",
      headers: {
        "Content-Type": "application/json",
      }
    }).then((res) => {
      setAllParkingGates(res.data);
    }).catch((err) => {
      console.log(err, 'Error adding new Parking Lot.')
    })
  }, [carDetails.size, carDetails.color, carDetails.licenseNumber, allParkingGates, potentialSlot, parkingTicket]);

  React.useEffect(() => {
    axios({
      method: "GET",
      url: "http://localhost:3001/api/getallparkingticket",
      headers: {
        "Content-Type": "application/json",
      }
    }).then((res) => {
      setAllExitedCars(res.data.filter((d) => d.exittime !== null && d.returntime === null))
    }).catch((err) => {
      // console.log(err, 'Error adding new Parking Lot.')
    })
  },[exitedCarDetails, allExitedCars]);

  return (
    <div>
      <MainDiv container>
        <HeaderDiv>
          <Typography>Parking Lot System</Typography>
        </HeaderDiv>
        <Grid container>
          <Grid item xs={3}>
            <StyledButton variant="contained" disabled={!_addedParkingSlot && dispensedTicket} color="primary" onClick={addCar}>Add Car</StyledButton>
          </Grid>
          <Grid item xs={3}>
            <StyledButton variant="contained" disabled={!carParked} onClick={carParked ? parkingService : null}>Park Car</StyledButton>
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
          potentialSlot={potentialSlot}
          carDetails={carDetails}
          parkingTicket={parkingTicket}/>
        <div style={{display: 'flex', justifyContent: 'space-around'}}>
          {
            allParkingGates?.map((gate, index) => {
              return (
                <ParkingGate
                  carParked={carParked}
                  gate={gate}
                  key={index}
                  addedParkingSlot={addedParkingSlot}
                />
              );
            })
          }
        </div>
      </div>
    </div>
  );
};
