import React from 'react';
import { CustomTabs } from '../components/common';
import { useSelector } from 'react-redux';
import { COLORS } from '../constants';
import ContainerWrapper from '../components/common/ContainerWrapper';
import CustomButton from '../components/common/CustomButton';
import { useRequestAlertHandler } from '../hooks/useActiveRequestBackHandler';
import CommonStyles from '../styles/commonStyles';
import { useTranslation } from 'react-i18next';

const FindCaptainPage = () => {
  const { t } = useTranslation();
  const { requestAlertHandler } = useRequestAlertHandler(t('cancel_request'));
  const { requestInfo } = useSelector(state => state.user);

  const extraProps = {
    from: requestInfo?.from.location || '',
    to: requestInfo?.to.location || '',
  };

  return (
    <ContainerWrapper>
      <CustomTabs extraProps={extraProps} />
      <CustomButton
        onClick={requestAlertHandler}
        textStyles={{ color: COLORS.primary, fontSize: 18 }}
        label={t('cancel_all_btn')}
        isLowerCase={true}
        styles={{ backgroundColor: COLORS.white, paddingRight: 0, width: 'auto', ...CommonStyles.shadow }}
      />
    </ContainerWrapper>
  );
};
export default FindCaptainPage;
