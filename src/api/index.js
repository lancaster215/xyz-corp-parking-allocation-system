import axios from "axios";

const URI = `${process.env.REACT_APP_URI}/api`

const defaultHeaders = {
    "Content-Type": "application/json"
}

const APIWrapper = (method, url, body, headers) => {
    return body ? axios({
        method: method,
        url: URI+url,
        data: body,
        headers: defaultHeaders
    }) : axios({
        method: method,
        url: URI+url,
        headers: defaultHeaders
    })
}

const updateReturnTime = (endpoint) => {
    return APIWrapper("POST", endpoint)
}

const addNewParkingSlot = (endpoint, payload) => {
    return APIWrapper(
        "POST",
        endpoint,
        payload,
    )
}

const updateParkingSlotPerId = (endpoint, payload) => {
    return APIWrapper(
        "POST", 
        endpoint,
        payload,
    )
}

const getParkingSlotPerId = (endpoint) => {
    return APIWrapper(
        "GET", 
        endpoint,
    )
}

const getAllParkingSlots = (endpoint) => {
    return APIWrapper(
        "GET", 
        endpoint,
    )
}

const postNewCar = (endpoint, payload) => {
    return APIWrapper(
        "POST",
        endpoint,
        payload,
    )
}

const addNewParkingGate = (endpoint) => {
    return APIWrapper(
        "POST",
        endpoint,
    )
}

const getParkingGates = (endpoint) => {
    return APIWrapper(
        "GET", 
        endpoint,
    )
}

const addNewParkingTicket = (endpoint, payload) => {
    return APIWrapper(
        "POST",
        endpoint,
        payload,
    )
}

const getParkingTickets = (endpoint) => {
    return APIWrapper(
        "GET",
        endpoint,
    )
}

const getParkingTicketById = (endpoint) => {
    return APIWrapper(
        "GET",
        endpoint,
    )
}

const updateParkingTicketById = (endpoint) => {
    return APIWrapper(
        "POST",
        endpoint,
    )
}


export { 
    updateReturnTime,
    addNewParkingSlot,
    updateParkingSlotPerId,
    getParkingSlotPerId,
    getAllParkingSlots,
    postNewCar,
    addNewParkingGate,
    getParkingGates, 
    addNewParkingTicket,
    getParkingTickets,
    getParkingTicketById,
    updateParkingTicketById,    
}