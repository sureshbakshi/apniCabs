import React, { createContext, useContext, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import { calculateDistance, showErrorMessage } from '../util';

export const RideSearchContext = createContext(null);

const initialState = {
  location: { from: null, to: null },
  route: { distance: null, duration: null }
}

export const RideSearchProvider = (props) => {
  const [location, setLocation] = useState(initialState.location);
  const [route, setRoute] = useState(initialState.route)
  const [noOfSeats, setNoOfSeats] = useState(null)

  const updateLocation = (key, details) => {
    const updatedLocation = { ...location, [key]: details }
    setLocation(updatedLocation)
  }

  const resetState = () => {
    setLocation(initialState.location)
    setRoute(initialState.route)
  }

  const getDistance = async () => {
    const { from, to } = location
    if (!isEmpty(from) && !isEmpty(to)) {
      const origin = from.geometry.location
      const destination = to.geometry.location
      if (!isEmpty(origin) && !isEmpty(destination)) {
        try {
          const res = await calculateDistance(origin.lat, origin.lng, destination.lat, destination.lng)
          if (res)
            setRoute({ distance: res.distance, duration: res.duration })
          return res
        } catch (error) {
          showErrorMessage('Failed to calculate distance')
          return null
        }
      }
    } else {
      showErrorMessage('Please select Pickup and Drop Location')
      return null
    }
  }


  return (<RideSearchContext.Provider value={{ location, route, updateLocation, getDistance, setNoOfSeats, resetState, noOfSeats }}>
    {props.children}
  </RideSearchContext.Provider>);
};

export const useRideSearchContext = () => {
  return useContext(RideSearchContext)
}
