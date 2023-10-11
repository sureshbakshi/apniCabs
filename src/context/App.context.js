import React, { createContext, useContext , useState} from 'react';
import { isEmpty } from 'lodash';
import { calculateDistance, showErrorMessage } from '../util';

export const AppContext = createContext(null);

const initialState = {
  location: { from: null, to: null },
}

export const AppProvider = (props) => {
  const [location, setLocation] = useState(initialState.location);
  const [distance, setDistance] = useState(null)
  const [noOfSeats, setNoOfSeats] = useState(null)

  const updateLocation = (key, details) => {
    const updatedLocation = { ...location, [key]: details }
    setLocation(updatedLocation)
  }

  const getDistance = async() =>{
    const { from, to } = location
    if (!isEmpty(from) && !isEmpty(to)) {
      const origin = from.geometry.location
      const destination = to.geometry.location
      if (!isEmpty(origin) && !isEmpty(to)) {
        try {
          const res = await calculateDistance(origin, destination)
          if (res)
            setDistance(res)
          return res
        } catch (error) {
          showErrorMessage('Failed to calculate distance')
        }
      }
    }else{
      showErrorMessage('Please select Pickup and Drop Location')
    }
  }
  

  return (<AppContext.Provider value={{ location, distance, updateLocation, getDistance, setNoOfSeats, noOfSeats }}>
    {props.children}
  </AppContext.Provider>);
};

export const useAppContext = () => {
  return useContext(AppContext)
}
