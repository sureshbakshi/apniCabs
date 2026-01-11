import * as React from 'react';
import { View, Pressable, FlatList } from 'react-native';
import styles from '../styles/MyRidePageStyles';
import { COLORS, ROUTES_NAMES, RideStatus, colorsNBg } from '../constants';
import { Icon, Text } from '../components/common';
import Timeline from '../components/common/timeline/Timeline';
import { formattedDate } from '../util';
import get from 'lodash/get';
import SearchLoader from '../components/common/SearchLoader';
import { navigate } from '../util/navigationService';
import ContainerWrapper from '../components/common/ContainerWrapper';
import CommonStyles from '../styles/commonStyles';
import generateInvoice from '../util/generateInvoice';
import ActivityIndicator from '../components/common/ActivityIndicator';
import { useTranslation } from 'react-i18next';

export const getColorNBg = (status) => {
  return colorsNBg[status] || { color: COLORS.black, bg: COLORS.bg_secondary, label: status }
}

const getValue = (data, key) => {
  return get(data, key, null)
}

const ITEM_HEIGHT = 120; // approximate/fixed height used for getItemLayout

const CardComponent = ({ item, keys }) => {
  const status = getValue(item, keys.status)
  const fare = getValue(item, keys.fare)
  const time = getValue(item, keys.rideTime) || getValue(item, keys.createdAt)
  const { color, label } = getColorNBg(status)
  return (
    <Pressable style={[styles.card, {
      borderLeftWidth: 5,
      borderLeftColor: color
    }]}
      android_ripple={{ color: '#ccc' }}
      onPress={() => item?.id ? navigate(ROUTES_NAMES.rideDetails, { id: item?.id }) : null}
    >
      <View style={[styles.cardtop, { justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }]}>
        <View>
          {<Text style={styles.time}>{time && formattedDate(time)}</Text>}
        </View>
        <View style={{ alignItems: 'center', flexDirection: 'row' }}>
          {item?.status === RideStatus.COMPLETED && <Pressable onPress={(e) => {
            e.stopPropagation();
            generateInvoice(item);
          }}>
            <Icon name='download' size='large' color={COLORS.gray} />
          </Pressable>}
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <Timeline data={[getValue(item, keys.from), getValue(item, keys.to)]} numberOfLines={1} />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, alignItems: 'center' }}>
        <Text style={[CommonStyles.font14, styles.bold]}>{fare ? `\u20B9${fare}` : ''}</Text>
        <Text style={[{ color: color }]}>{label}</Text>
      </View>
    </Pressable>
  )
}

const Card = React.memo(CardComponent, (prev, next) => {
  // shallow checks for the fields we render to avoid unnecessary re-renders
  return (
    prev.item.id === next.item.id &&
    prev.item.status === next.item.status &&
    prev.item.fare === next.item.fare &&
    get(prev.item, next.keys?.rideTime) === get(next.item, next.keys?.rideTime) &&
    prev.keys === next.keys
  )
})
const MyRidePage = ({ data, keys, loadMore, isFetching, onRefresh }) => {
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = React.useCallback(async () => {
    if (onRefresh) {
      setRefreshing(true);
      await onRefresh();
      setRefreshing(false);
    }
  }, [onRefresh]);

  const renderItem = React.useCallback(({ item }) => <Card item={item} keys={keys} />, [keys])

  return (
    <ContainerWrapper style={{ paddingHorizontal: 10 }}>
      <View style={styles.section}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id?.toString()}  // ✅ Stable keys
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={isFetching ? <ActivityIndicator /> : null}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={5}
          removeClippedSubviews={true}
          getItemLayout={(listData, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}
          contentContainerStyle={data && data.length ? undefined : { flex: 1 }}
          ListEmptyComponent={<SearchLoader msg={t('no_records')} />}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ContainerWrapper>
  );
};
export default MyRidePage;
