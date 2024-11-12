import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { COLORS } from '../constants';
import { useCreateOrderMutation, useSubscriptionListQuery } from '../slices/apiSlice';
import { useSelector } from 'react-redux';
import { openUrl, webLinks } from '../util/config';

const SubscriptionPlans = () => {
    const { data: subscriptions, isLoading } = useSubscriptionListQuery(null, { refetchOnMountOrArgChange: true })
    const userInfo = useSelector((state) => state.auth.userInfo)
    const access_token = useSelector((state) => state.auth.access_token)
    const [createOrder, { data: orderDetails }] = useCreateOrderMutation();

    useEffect(() => {
        if (orderDetails) {
            const { gateway_request, order_id } = orderDetails
            const parsedRes = JSON.parse(gateway_request)
            const parsedRequest = parsedRes?.links?.[1]
            if (parsedRequest?.headers?.authorization && parsedRequest?.parameters?.bdorderid) {
                const { headers: { authorization }, parameters: { bdorderid } } = parsedRequest
                openUrl(`${webLinks.payment}?bdOrderId=${bdorderid}&authToken=${authorization}&authorization=${access_token}&order_id=${order_id}`)
            }
        }
    }, [orderDetails])

    const renderSubscription = ({ item }) => (
        <Card style={styles.card}>
            <Card.Content>
                <Title style={styles.planName}>{item.name}</Title>
                <Paragraph style={styles.description}>{item.description}</Paragraph>
                <View style={styles.row}>
                    <Text style={styles.credits}>Get <Text style={{ fontWeight: 'bold' }}>{item.credit_amount}</Text> Credits.</Text>
                    <Button mode="contained" onPress={() => {
                        console.log({ item })
                        if (userInfo.id) {
                            createOrder({
                                "status": "ORDER",
                                "subscription_id": item.id,
                            })
                        }
                    }} style={{ backgroundColor: COLORS.brand_yellow }} textColor={COLORS.black} labelStyle={{ fontWeight: 'bold' }}>
                        Pay {'\u20B9'}{item.plan_amount}
                    </Button>
                </View>
            </Card.Content>
        </Card>
    );
    const renderEmptyList = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No subscription plans available.</Text>
        </View>
    );

    return (
        <View style={styles.container}>
                <FlatList
                    data={subscriptions}
                    renderItem={renderSubscription}
                    keyExtractor={(item) => item.id}
                    ListEmptyComponent={renderEmptyList}
                    contentContainerStyle={{ paddingBottom: 50 }}

                />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: COLORS.bg_gray_primary,
    },
    card: {
        marginBottom: 16,
        backgroundColor: COLORS.white
    },
    planName: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    description: {
        fontSize: 16,
        marginVertical: 8,
        color: COLORS.text_gray
    },
    credits: {
        fontSize: 18,
        // fontWeight: 'bold',
        // color: COLORS.text_gray
        color: COLORS.green,
    },
    amount: {
        fontSize: 16,
        marginVertical: 8,
    },
});

export default SubscriptionPlans;
