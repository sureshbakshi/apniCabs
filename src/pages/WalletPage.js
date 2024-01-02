import * as React from 'react';
import { View, Button, Pressable, ScrollView, FlatList } from 'react-native';
import WalletStyles from '../styles/WalletPageStyles';
import styles from '../styles/MyRidePageStyles';
import { ImageView, Text } from '../components/common';
import images from '../util/images';
import { useLazyGetDriverTransactionsQuery } from '../slices/apiSlice';
import { COLORS } from '../constants';
import ActivityIndicator from '../components/common/ActivityIndicator';
import SearchLoader from '../components/common/SearchLoader';
import { formattedDate } from '../util';
import { useFocusEffect } from '@react-navigation/native';
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
    color: COLORS.primary,
    image: images.requested
  },
  'REFUND': {
    title: 'Credited Amount ',
    color: COLORS.green,
    image: images.accepted
  }
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

  const { transactions, balance, hold } = transactionHistory || {}

  const TransactionCard = ({ item }) => {
    const copy = walletCopy[item.type]
    return (
      <View style={WalletStyles.card} >
        <View style={WalletStyles.cardtop}>
          <View style={WalletStyles.left}>
            {/* <View style={WalletStyles.profileIcon}></View> */}
            <ImageView source={copy.image} style={styles.avatar} resizeMode='cover' />
          </View>
          <View style={WalletStyles.middle}>
            <Text style={WalletStyles.name}>{copy.title} </Text>
            <Text style={WalletStyles.review}>
              {item.description}
            </Text>
            <Text style={WalletStyles.address}>
              {/* 10-12-2023, 05:15 PM */}
              {formattedDate(item.created_at)}
            </Text>
          </View>
          <View style={WalletStyles.right}>
            <Text style={[WalletStyles.greenTxt, { color: copy.color }]}>{'\u20B9'} {item.amount}</Text>
          </View>
        </View>
      </View>
    );
  }
  return (
    <View style={WalletStyles.container}>
      <View style={WalletStyles.header}>
        <Text style={WalletStyles.headerText}>{'My Wallet'.toUpperCase()}</Text>
        <Text style={WalletStyles.whitetxt}>{'Total Balance'}</Text>
        {balance ? <Text style={WalletStyles.balTxt}>{'\u20B9'}{balance}</Text>: null}
        <View style={WalletStyles.right}>
          {/* <Pressable style={WalletStyles.button} onPress={_goToYosemite}>
            <Text style={WalletStyles.buttonTxt}>{'Add Money'.toUpperCase()}</Text>
          </Pressable> */}
        </View>
        {hold ? <View style={{ justifyContent: 'space-between', right: 20, position: 'absolute', bottom: 10 }}>
          <Text style={WalletStyles.whitetxt}>{'Hold Amount: '}
            <Text style={[WalletStyles.whitetxt, { fontSize: 16, fontWeight: 'bold' }]}>{'\u20B9'}{hold}</Text>
          </Text>
        </View>: null}
      </View>
      <View style={WalletStyles.section}>
        <FlatList
          data={transactions}
          renderItem={({ item, i }) => <TransactionCard item={item} key={i} />}
          keyExtractor={item => item.id}
          ListEmptyComponent={<SearchLoader msg="No Records found." isLoader={false} containerStyles={{ flex: 1, justifyContent: 'center' }}></SearchLoader>}
        />
      </View>
    </View>
  );
};
export default WalletPage;
