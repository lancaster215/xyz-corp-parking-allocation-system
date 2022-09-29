import { Grid, Button } from "@mui/material";
import { styled } from "@mui/material/styles";

export const MainDiv = styled(Grid)`
    width: 50%;
    margin: 0 auto;

`

export const HeaderDiv = styled(Grid)`
    text-align: center;
    width: 100%;

    p {
        font-size: 1.5em;
        margin: 0.5em;
    }

`

export const StyledButton = styled(Button)`
    background-color: #007FFF;
`

export const ListDiv = styled(Grid)`
    ul > li {
        list-style-type: none;
    }
`

export const ParkingBorder = styled(Grid)`
    position: absolute;
    border: 5px dashed #DE5307;
    width: 100%;
    height: 100%;
    margin: 8vh 0vh;
`