import * as React from 'react';
import { View, Button, Pressable, ScrollView, FlatList } from 'react-native';
import WalletStyles from '../styles/WalletPageStyles';
import styles from '../styles/MyRidePageStyles';
import { ImageView, Text } from '../components/common';
import images from '../util/images';
import { useLazyGetDriverTransactionsQuery } from '../slices/apiSlice';
import { COLORS, ROUTES_NAMES } from '../constants';
import ActivityIndicator from '../components/common/ActivityIndicator';
import SearchLoader from '../components/common/SearchLoader';
import { formattedDate } from '../util';
import { useFocusEffect } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import { navigate } from '../util/navigationService';

const walletCopy = {
  'DEBIT': {
    title: "Requested Amount",
    color: COLORS.primary,
    image: images.requested
  },
  'HOLD': {
    title: "Holding",
    color: COLORS.primary,
    image: images.requested
  },
  'CREDIT': {
    title: 'Accepted Amount',
    color: COLORS.green,
    image: images.accepted
  },
  'REFUND': {
    title: 'Credited Amount ',
    color: COLORS.green,
    image: images.accepted
  },
  'REFERRAL': {
    title: 'Referral Amount ',
    color: COLORS.green,
    image: images.accepted
  },
}

const WalletPage = ({ navigation }) => {
  const [refetch, { data: transactionHistory, error: transactionHistoryError, isLoading }] = useLazyGetDriverTransactionsQuery({}, { refetchOnMountOrArgChange: true });
  useFocusEffect(
    React.useCallback(() => {
      refetch?.()
    }, [])
  );
  if (isLoading) {
    return <ActivityIndicator />
  }

  const { transactions: formattedTransactions, balance, hold } = transactionHistory || {}

  const TransactionCard = ({ item }) => {
    const copy = walletCopy[item.type]
    return (
      <View style={WalletStyles.cardtop}>
        <View style={WalletStyles.left}>
          <ImageView source={copy.image} style={styles.avatar} resizeMode='cover' />
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
    const { request_id, transactions } = item

    return (
      <View style={WalletStyles.card} key={request_id} >
        {/* {request_id && <Text style={WalletStyles.name} numberOfLines={1}>
            Request: {request_id} 
            </Text>} */}
        {(!isEmpty(transactions)) ?
          transactions.map((transaction) => {
            return !isEmpty(request_id) ? <TransactionCard item={transaction} key={transaction?.id} /> : <RequestCard item={transaction} key={transaction?.id} />
          })
          : (!isEmpty(item)) ?
            <TransactionCard item={item} key={request_id} />
            : null
        }
      </View>
    );
  }


  return (
    <View style={WalletStyles.container}>
      <View style={WalletStyles.header}>
        {/* <Text style={WalletStyles.headerText}>{'My Wallet'.toUpperCase()}</Text> */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <View>
            <Text style={WalletStyles.whitetxt}>{'Total Credits'}</Text>
            {balance ? <Text style={WalletStyles.balTxt}>{balance}</Text> : null}
          </View>
          {/* <View style={WalletStyles.right}> */}
          <View>
            <Pressable style={WalletStyles.button} onPress={() => { navigate(ROUTES_NAMES.myPlans)}}>
              <Text style={WalletStyles.buttonTxt}>{'Add Credits'}</Text>
            </Pressable>
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
          data={formattedTransactions}
          renderItem={({ item, i }) => <RequestCard item={item} key={i} />}
          keyExtractor={(item, index) => index}
          ListEmptyComponent={<SearchLoader msg="No Transactions found." isLoader={false} containerStyles={{ flex: 1, justifyContent: 'center' }}></SearchLoader>}
        />
      </View>
    </View>
  );
};
export default WalletPage;
