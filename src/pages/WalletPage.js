import React, { useCallback, useEffect, useState } from 'react';
import { View, Button, Pressable, ScrollView, FlatList } from 'react-native';
import WalletStyles from '../styles/WalletPageStyles';
import styles from '../styles/MyRidePageStyles';
import { Icon, ImageView, Text } from '../components/common';
import images from '../util/images';
import {  useLazyGetDriverTransactionsQuery } from '../slices/apiSlice';
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
  const [refetch, { data: transactionHistory, error: transactionHistoryError,isLoading, isFetching }] = useLazyGetDriverTransactionsQuery({ page, id: driverInfo?.id, pageSize: PageSize });

  useEffect(() => {
    if (transactionHistory?.transactions?.length) {
      setTransactions((prevTransactionHistory) => ([...prevTransactionHistory, ...transactionHistory?.transactions]));
    }
    if (transactionHistory?.lastKey) {
      setLastKey((prevLastKey) => ({ ...prevLastKey, ...transactionHistory?.lastKey }));
    }
  }, [isFetching, transactionHistory]);

  useFocusEffect(
    useCallback(() => {
      const fetchInitialData = async () => {
        await refetch({
          page: 1,
          id: driverInfo?.id,
          pageSize: PageSize
        });
      };
      fetchInitialData();
      return () => {
        setPage(1);
        setLastKey({});
        setTransactions([]);
      };
    }, [driverInfo?.id, refetch])
  );

  const loadMore = useCallback(() => {
    if (!isFetching && transactionHistory?.total >= (page * PageSize)) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [isFetching, transactionHistory]);
  // const [refetch, { data: transactionHistory, error: transactionHistoryError, isLoading }] = useGetDriverTransactionsQuery({}, { refetchOnMountOrArgChange: true });
  // useFocusEffect(
  //   React.useCallback(() => {
  //     refetch?.()
  //   }, [])
  // );
  if (isLoading) {
    return <ActivityIndicator />
  }

  // const { transactions: formattedTransactions, balance, hold } = transactionHistory || {}

  const TransactionCard = ({ item }) => {
    const copy = walletCopy[item.type]
    return (
      <View style={[WalletStyles.cardtop]}>
        <View style={[WalletStyles.left, { paddingHorizontal: 0 }]}>
          <View style={[WalletStyles.box1, { backgroundColor: copy.bg_color }]}>
            <Icon name={copy?.icon} size='small' color={COLORS.white} />
          </View>
          {/* <ImageView source={copy.image} style={styles.avatar} resizeMode='cover' /> */}
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
            {/* {'\u20B9'}  */}
            {item.amount}
          </Text>
        </View>
      </View>
    );
  }

  const RequestCard = ({ item }) => {
    const { request_id } = item
    if (isEmpty(item)) {
      return null;
    }
    return (
      <View style={WalletStyles.card} key={request_id} >

        {/* {request_id && <Text style={WalletStyles.name} numberOfLines={1}>
            Request: {request_id} 
            </Text>} */}
        {(!isEmpty(item?.request_id) && Array.isArray(item?.transactions)) ?
          item?.transactions?.map((transaction) => {
            return <TransactionCard item={transaction} key={transaction?.created_at} />
          })
          : <TransactionCard item={item} key={item?.created_at} />
        }
      </View>
    );
  }


  return (
    <SafeAreaView style={[WalletStyles.container]}>
      <View style={[FindRideStyles.pageContainer]}>
        <ContainerWrapper style={{ height: getScreen().screenHeight - 95 }}>
          <View style={[WalletStyles.header, { margin: 0, marginBottom: 5 }]}>
            {/* <Text style={WalletStyles.headerText}>{'My Wallet'.toUpperCase()}</Text> */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={WalletStyles.box}>
                <Icon name='wallet-outline' size='large' color={COLORS.white} />
              </View>
              <View>
                <Text style={WalletStyles.graytxt}>{'Total Credits'}</Text>
                {walletInfo?.id ? <Text style={WalletStyles.balTxt}>{walletInfo?.amount}</Text> : null}
                <Pressable style={WalletStyles.button} onPress={() => { navigate(ROUTES_NAMES.myPlans) }}>
                  <Text style={WalletStyles.buttonTxt}>{'Add Credits'}</Text>
                  <Icon name='chevron-right' size='large' color={COLORS.primary} />
                </Pressable>
              </View>
              {/* <View style={WalletStyles.right}> */}
              <View>

              </View>
            </View>
          </View>
          {/* {hold ? <View style={{ justifyContent: 'space-between', right: 20, position: 'absolute', bottom: 10 }}>
          <Text style={WalletStyles.whitetxt}>{'Hold Amount: '}
            <Text style={[WalletStyles.whitetxt, { fontSize: 16, fontWeight: 'bold' }]}>{'\u20B9'}{hold}</Text>
          </Text>
        </View>: null} */}
          {/* </View> */}
          <View style={WalletStyles.section}>
            <FlatList
              data={transactions}
              renderItem={({ item, i }) => <RequestCard item={item} key={i} />}
              keyExtractor={(item, index) => index}
              onEndReached={loadMore}
              onEndReachedThreshold={0.5}
              ListFooterComponent={isFetching ? <ActivityIndicator /> : null}
              ListEmptyComponent={<SearchLoader msg="No Transactions found." isLoader={false} containerStyles={{ flex: 1, justifyContent: 'center' }}></SearchLoader>}
            />
          </View>
        </ContainerWrapper>
      </View>
    </SafeAreaView>
  );
};
export default WalletPage;
