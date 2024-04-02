import React from 'react';

function AppContainer(WrappedComponent) {
  return props => {
    return <WrappedComponent  {...props} />;
  };
}

export default AppContainer;
