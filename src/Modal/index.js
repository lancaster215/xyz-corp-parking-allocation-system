import React from "react";

import { Modal, Typography, Box, Button, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { sizes } from "../constants/const";

const CustomBox = styled(Box)`
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40%;
  height: 30vh;
  padding: 1em;
  border: 1px solid #000;
  background: #FFFFFF;
  text-align: center;
`

const CustomList = styled(Grid)`
  text-align: left;
  margin: 2em;
`

export const CustomModal = (props) => {
  const { modalText, open, handleClose, showTicketDetails, parkingTicket } = props;
  const [carTicket, setCarTicket] = React.useState();

  React.useEffect(() => {
    if(parkingTicket){
      try {
        const fetchTicketVID = async() => {
          const ticketVidData = await axios({
            method: "GET",
            url: `http://localhost:3001/api/getticketvid/${parkingTicket.vehicleid}`,
            headers: {
              "Content-Type": "application/json",
            }
          })
          if(ticketVidData?.data.length <= 0) {
            setTimeout(fetchTicketVID, 3000)
            return;
          }
          setCarTicket(ticketVidData?.data)
        }

        fetchTicketVID()
      } catch(err) {
        console.log(err, 'Error getting new car ticket.')
      }
    }
  }, [parkingTicket])

  return (
		<Modal open={open} onClose={handleClose}>
			<CustomBox>
        <div style={{postion: 'relative'}}>
          <Button style={{position: 'absolute', right: 0}} variant="contained" color="primary" onClick={handleClose}>x</Button>
          <Typography variant="h6" component="h2">
            {modalText}
          </Typography>
            {showTicketDetails &&
              (<CustomList>
                <Typography>Ticket Details</Typography>
                  {carTicket?.length > 0 &&
                    <ul style={{listStyleType: 'none'}}>
                      <li><Typography>Parking Slot: {carTicket && carTicket[0]?.parkingslotid}</Typography></li>
                      <li><Typography>Entry time: {carTicket && carTicket[0]?.entrytime}</Typography></li>
                      <li><Typography>Exit time: {carTicket && carTicket[0]?.exittime}</Typography></li>
                      <li><Typography>Car License Number: {carTicket && carTicket[0]?.licensenumber}</Typography></li>
                      <li><Typography>Car Color: {carTicket && carTicket[0]?.color}</Typography></li>
                      <li><Typography>Car Size: {carTicket && sizes[carTicket[0]?.size]}</Typography></li>
                    </ul>
                  }
              </CustomList>)
            }
          </div>
			</CustomBox>
    </Modal>
  );
};
