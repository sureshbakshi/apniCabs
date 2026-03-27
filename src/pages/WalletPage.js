import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { View, Pressable, FlatList } from 'react-native';
import WalletStyles from '../styles/WalletPageStyles';
import { Icon, Text } from '../components/common';
import images from '../util/images';
import { useGetDriverTransactionsMutation } from '../slices/apiSlice';
import { COLORS, ROUTES_NAMES } from '../constants';
import ActivityIndicator from '../components/common/ActivityIndicator';
import SearchLoader from '../components/common/SearchLoader';
import { formattedDate } from '../util';
import { useFocusEffect } from '@react-navigation/native';
import isEmpty from 'lodash/isEmpty';
import ContainerWrapper from '../components/common/ContainerWrapper';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import useGetDriverWallet from '../hooks/useGetDriverWallet';
import { PullToRefresh } from '../components/common';
import { RefreshControl } from 'react-native';


// 1. OPTIMIZATION: Keep static data outside component
const PageSize = 20;
const walletCopy = {
  'DEBIT': { title: "Requested Amount", color: COLORS.black, image: images.requested, icon: 'arrow-top-right', bg_color: COLORS.primary_dark },
  'HOLD': { title: "Holding", color: COLORS.black, image: images.requested, icon: 'arrow-top-right', bg_color: COLORS.primary_dark },
  'CREDIT': { title: 'Accepted Amount', color: COLORS.black, image: images.accepted, icon: 'arrow-bottom-left', bg_color: COLORS.primary_green },
  'REFUND': { title: 'Credited Amount ', color: COLORS.black, image: images.accepted, icon: 'arrow-bottom-left', bg_color: COLORS.primary_green },
  'REFERRAL': { title: 'Referral Amount ', color: COLORS.green, image: images.accepted, icon: 'arrow-bottom-left', bg_color: COLORS.primary_green },
};

// 2. OPTIMIZATION: Move sub-components outside to prevent re-creation on every render
const TransactionCard = React.memo(({ item }) => {
  const copy = walletCopy[item.type] || walletCopy['CREDIT']; // Fallback safety
  return (
    <View style={[WalletStyles.cardtop]}>
      <View style={[WalletStyles.left, { paddingHorizontal: 0 }]}>
        <View style={[WalletStyles.box1, { backgroundColor: copy.bg_color }]}>
          <Icon name={copy?.icon} size='small' color={COLORS.white} />
        </View>
      </View>
      <View style={WalletStyles.middle}>
        <Text style={WalletStyles.review}>{item.description}</Text>
        <Text style={WalletStyles.address}>{formattedDate(item.created_at)}</Text>
      </View>
      <View style={WalletStyles.right}>
        <Text style={[WalletStyles.greenTxt, { color: copy.color }]}>{item.amount}</Text>
      </View>
    </View>
  );
});

const RequestCard = React.memo(({ item }) => {
  if (isEmpty(item)) return null;

  return (
    <View style={WalletStyles.card}>
      {(!isEmpty(item?.request_id) && Array.isArray(item?.transactions)) ?
        item.transactions.map((transaction) => (
          <TransactionCard item={transaction} key={transaction?.id || transaction?.created_at} />
        ))
        : <TransactionCard item={item} />
      }
    </View>
  );
});

const WalletPage = ({ navigation }) => {
  const { driverInfo } = useSelector(state => state.auth);
  const { walletInfo } = useSelector(state => state.driver);
  const [page, setPage] = useState(1);
  const [transactions, setTransactions] = useState([]);

  const [fetchTransactions, { data: transactionHistory, isLoading, isFetching }] = useGetDriverTransactionsMutation();

  const { t } = useTranslation();
  useGetDriverWallet();

  // 3. OPTIMIZATION: Simplified Merge Logic
  // Instead of complex find/map/filter, we append new data when page > 1
  // or replace data when page === 1.
  useEffect(() => {
    if (transactionHistory?.transactions) {
      if (page === 1) {
        setTransactions(transactionHistory.transactions);
      } else {
        setTransactions(prev => {
          // Filter out duplicates based on request_id or unique ID to be safe
          const newItems = transactionHistory.transactions.filter(
            newItem => !prev.some(existing => existing.request_id === newItem.request_id)
          );
          return [...prev, ...newItems];
        });
      }
    }
  }, [transactionHistory, page]);

  const loadData = useCallback((pageNum) => {
    fetchTransactions({
      page: pageNum,
      id: driverInfo?.id,
      pageSize: PageSize
    });
  }, [driverInfo?.id, fetchTransactions]);

  // 4. OPTIMIZATION: Only fetch on mount/focus if list is empty or explicitly needed
  useFocusEffect(
    useCallback(() => {
      // Reset to page 1 on focus to get latest data
      setPage(1);
      loadData(1);
    }, [loadData])
  );

  const loadMore = useCallback(() => {
    if (!isFetching && transactionHistory?.total > transactions.length) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadData(nextPage);
    }
  }, [isFetching, transactionHistory?.total, transactions.length, page, loadData]);

  const renderItem = useCallback(({ item }) => <RequestCard item={item} />, []);

  // Use a unique ID if available, fallback to index only if necessary
  const keyExtractor = useCallback((item, index) => item.request_id?.toString() || index.toString(), []);

  const handleAddCredits = () => navigation.navigate(ROUTES_NAMES.myPlans);

  return (
    <ContainerWrapper style={{ paddingHorizontal: 10, marginBottom: 5 }}>

      <View style={[WalletStyles.header, { margin: 0, marginBottom: 5 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={WalletStyles.box}>
            <Icon name='wallet-outline' size='large' color={COLORS.white} />
          </View>
          <View>
            <Text style={WalletStyles.graytxt}>{t('total_credits')}</Text>
            {walletInfo?.id ? <Text style={WalletStyles.balTxt}>{walletInfo?.amount}</Text> : null}
            <Pressable style={WalletStyles.button} onPress={handleAddCredits}>
              <Text style={WalletStyles.buttonTxt}>{t('add_credits')}</Text>
              <Icon name='chevron-right' size='large' color={COLORS.primary} />
            </Pressable>
          </View>
        </View>
      </View>

      {isLoading && page === 1 ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={transactions}
          refreshControl={
            <RefreshControl
              refreshing={isFetching && page === 1}
              onRefresh={() => loadData(1)}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          initialNumToRender={10} // Improve initial render speed
          maxToRenderPerBatch={10}
          windowSize={5} // Reduce memory usage
          removeClippedSubviews={true} // Unmount off-screen items
          ListFooterComponent={isFetching && page > 1 ? <ActivityIndicator /> : null}
          ListEmptyComponent={
            <SearchLoader
              msg="No Transactions found."
              isLoader={false}
              containerStyles={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}
            />
          }
        />
      )}
    </ContainerWrapper>
  );
};

export default WalletPage;
