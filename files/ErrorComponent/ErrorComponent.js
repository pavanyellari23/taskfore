import React from 'react';
import Footer from '@revin-utils/components/footer';
import ErrorScreen from '@revin-utils/components/error-screen';
import { BACK } from 'utils/constants';

export const ErrorComponent = () => {

  const handleBack = () => {
    window.history.go(-2);
  };

  return (
    <>
      <ErrorScreen />
      <Footer
        handleFooterSecondaryButton={handleBack}
        hideSave
        secondaryLabel={BACK}
      />
    </>
  );
};

export default ErrorComponent;