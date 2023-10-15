import * as React from 'react';
import { View} from 'react-native';
import { CustomTabs } from '../components/common';
import FindRideStyles from '../styles/FindRidePageStyles';

import _ from 'lodash';
import { useAppContext } from '../context/App.context'
import { useGetDriverQuery } from '../slices/apiSlice';

const FindCaptainPage = () => {
  const { data: driversList, error, isLoading } = useGetDriverQuery()
  const { route, location: { from, to } } = useAppContext()
  if (isLoading || error) {
    return null
  }
  const data = _.groupBy(driversList.data, 'type');

  const extraProps = {
    ...route,
    from: from?.formatted_address || '',
    to: to?.formatted_address || '',
  }

  return (
    <View style={FindRideStyles.container}>
      <CustomTabs data={data} extraProps={extraProps}/>
    </View>
  );
};
export default FindCaptainPage;
