import React, { useCallback, useEffect, useState } from 'react';
import { View, Button, Pressable, ScrollView, FlatList } from 'react-native';
import WalletStyles from '../styles/WalletPageStyles';
import { Icon, ImageView, Text } from '../components/common';
import images from '../util/images';
import { useLazyGetDriverTransactionsQuery } from '../slices/apiSlice';
import { COLORS, ROUTES_NAMES } from '../constants';
import ActivityIndicator from '../components/common/ActivityIndicator';
import SearchLoader from '../components/common/SearchLoader';
import { formattedDate, getScreen } from '../util';
import { useFocusEffect } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import { navigate } from '../util/navigationService';
import ContainerWrapper from '../components/common/ContainerWrapper';
import FindRideStyles from '../styles/FindRidePageStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import useGetDriverWallet from '../hooks/useGetDriverWallet';

const walletCopy = {
  'DEBIT': {
    title: "Requested Amount",
    color: COLORS.black,
    image: images.requested,
    icon: 'arrow-top-right',
    bg_color: COLORS.primary_dark,
  },
  'HOLD': {
    title: "Holding",
    color: COLORS.black,
    image: images.requested,
    icon: 'arrow-top-right',
    bg_color: COLORS.primary_dark,
  },
  'CREDIT': {
    title: 'Accepted Amount',
    color: COLORS.black,
    image: images.accepted,
    icon: 'arrow-bottom-left',
    bg_color: COLORS.primary_green,
  },
  'REFUND': {
    title: 'Credited Amount ',
    color: COLORS.black,
    image: images.accepted,
    icon: 'arrow-bottom-left',
    bg_color: COLORS.primary_green,
  },
  'REFERRAL': {
    title: 'Referral Amount ',
    color: COLORS.green,
    image: images.accepted,
    icon: 'arrow-bottom-left',
    bg_color: COLORS.primary_green,
  },
}
const PageSize = 20;

const WalletPage = ({ navigation }) => {
  const { driverInfo } = useSelector(state => state.auth);
  const { walletInfo } = useSelector(state => state.driver);
  const [page, setPage] = useState(1);
  const [lastKey, setLastKey] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [refetch, { data: transactionHistory, error: transactionHistoryError, isLoading, isFetching }] = useLazyGetDriverTransactionsQuery({ page, id: driverInfo?.id, pageSize: PageSize });
  const { t } = useTranslation()
  useGetDriverWallet();
  useEffect(() => {
    if (transactionHistory?.transactions?.length) {
      setTransactions((prevTransactionHistory) => {
        // Remove duplicate transactions by using the request_id or created_at (or another unique identifier)
        const uniqueTransactions = [
          ...prevTransactionHistory,
          ...transactionHistory.transactions.filter(
            (transaction) =>
              !prevTransactionHistory.some((prev) => prev.request_id === transaction.request_id)
          ),
        ];
        return uniqueTransactions;
      });
    }
    if (transactionHistory?.lastKey) {
      setLastKey((prevLastKey) => ({ ...prevLastKey, ...transactionHistory?.lastKey }));
    }
  }, [transactionHistory]);

  const resetState = () => {
    setPage(1);
    setLastKey({});
    setTransactions([]);
  };
  const fetchWallet = async (page) => {
    refetch({
      page: page || 1,
      id: driverInfo?.id,
      pageSize: PageSize
    });
  };

  useFocusEffect(
    useCallback(() => {
      if (transactionHistory?.total > PageSize * page || isEmpty(transactionHistory)) {
        fetchWallet();
      }
    }, [driverInfo?.id, refetch])
  );

  useEffect(() =>{
    fetchWallet(page)
  },[page])

  const loadMore = useCallback(() => {
    if (!isFetching && transactionHistory?.total >= page * PageSize) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [isFetching, transactionHistory]);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  const TransactionCard = ({ item }) => {
    const copy = walletCopy[item.type];
    return (
      <View style={[WalletStyles.cardtop]}>
        <View style={[WalletStyles.left, { paddingHorizontal: 0 }]}>
          <View style={[WalletStyles.box1, { backgroundColor: copy.bg_color }]}>
            <Icon name={copy?.icon} size='small' color={COLORS.white} />
          </View>
        </View>
        <View style={WalletStyles.middle}>
          <Text style={WalletStyles.review}>
            {item.description}
          </Text>
          <Text style={WalletStyles.address}>
            {formattedDate(item.created_at)}
          </Text>
        </View>
        <View style={WalletStyles.right}>
          <Text style={[WalletStyles.greenTxt, { color: copy.color }]}>
            {item.amount}
          </Text>
        </View>
      </View>
    );
  };

  const RequestCard = ({ item }) => {
    const { request_id } = item;
    if (isEmpty(item)) {
      return null;
    }
    return (
      <View style={WalletStyles.card} key={request_id} >
        {(!isEmpty(item?.request_id) && Array.isArray(item?.transactions)) ?
          item?.transactions?.map((transaction) => {
            return <TransactionCard item={transaction} key={transaction?.created_at} />
          })
          : <TransactionCard item={item} key={item?.created_at} />
        }
      </View>
    );
  };

  return (
    <SafeAreaView style={[WalletStyles.container]}>
      <View style={[FindRideStyles.pageContainer]}>
        <ContainerWrapper style={{ height: getScreen().screenHeight - 95 }}>
          <View style={[WalletStyles.header, { margin: 0, marginBottom: 5 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={WalletStyles.box}>
                <Icon name='wallet-outline' size='large' color={COLORS.white} />
              </View>
              <View>
                <Text style={WalletStyles.graytxt}>{t('total_credits')}</Text>
                {walletInfo?.id ? <Text style={WalletStyles.balTxt}>{walletInfo?.amount}</Text> : null}
                <Pressable style={WalletStyles.button} onPress={() => { navigate(ROUTES_NAMES.myPlans) }}>
                  <Text style={WalletStyles.buttonTxt}>{t('add_credits')}</Text>
                  <Icon name='chevron-right' size='large' color={COLORS.primary} />
                </Pressable>
              </View>
            </View>
          </View>
          <View style={WalletStyles.section}>
            <FlatList
              data={transactions}
              renderItem={({ item, i }) => <RequestCard item={item} key={i} />}
              keyExtractor={(item, index) => index.toString()}
              onEndReached={loadMore}
              onEndReachedThreshold={0.5}
              ListFooterComponent={isFetching ? <ActivityIndicator /> : null}
              ListEmptyComponent={<SearchLoader msg="No Transactions found." isLoader={false} containerStyles={{ flex: 1, justifyContent: 'center' }} />}
            />
          </View>
        </ContainerWrapper>
      </View>
    </SafeAreaView>
  );
};
export default WalletPage;
