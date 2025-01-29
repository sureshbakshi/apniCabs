import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { RadioButton } from 'react-native-paper'; // or any radio button component
import { Icon } from './Icon';
import { COLORS } from '../../constants';
import { Pressable } from 'react-native';
import CustomButton from './CustomButton';
import { getPhoneNumber } from '../../util/contactPicker';
import { useDispatch, useSelector } from 'react-redux';
import { setOtherContactList, setSelectedOtherContact } from '../../slices/userSlice';


const UserList = ({ onCloseModal }) => {
    const { otherContactList, selectedOtherContact } = useSelector((state) => state.user);
    const [selectedUser, setSelectedUser] = useState(selectedOtherContact);
    const dispatch = useDispatch();

    const handleSelectUser = (item) => {
        setSelectedUser(item.number === selectedUser?.number ? null : item); // Deselect if clicked again
    };

    const renderItem = ({ item }) => {
        return (
            <Pressable
                android_ripple={{ color: COLORS.bg_gray_secondary }}
                style={styles.item}
                onPress={() => handleSelectUser(item)}
            >
                <Icon name={'account-circle'} size={'large'} />
                <Text style={styles.userName}>{item.name}</Text>
                <RadioButton
                    value={item.number}
                    color={COLORS.primary}
                    status={selectedUser?.number === item.number ? 'checked' : 'unchecked'}
                    onPress={() => handleSelectUser(item)}
                />
            </Pressable>
        );
    };
    const getContact = async () => {
        const contact = await getPhoneNumber();
        if (contact) {
            dispatch(setOtherContactList(contact));
        }
    }

    const handleOtherContact = () => {
        dispatch(setSelectedOtherContact(selectedUser));
        onCloseModal();
    }

    return (
        <View style={{ padding: 10 }}>
            <Text style={styles.heading}>Booking ride for</Text>
            <FlatList
                data={otherContactList}
                renderItem={renderItem}
                keyExtractor={(item) => item.number}
            />
            <View>
                <Pressable
                    android_ripple={{ color: COLORS.bg_gray_secondary }}
                    style={styles.item}
                    onPress={getContact}
                >
                    <Icon name={'account-circle'} size={'large'} color={COLORS.button_blue_bg} />
                    <Text style={[styles.userName, styles.newRider]}>Add new rider</Text>
                </Pressable>
            </View>
            <View>
                <CustomButton
                    styles={{ backgroundColor: COLORS.primary, height: 50, borderRadius: 20, marginTop: 30 }}
                    textStyles={{ color: COLORS.white, fontSize: 14, fontWeight: 'bold', lineHeight: 18 }}
                    onClick={handleOtherContact}
                    label={'Done'}
                    isLowerCase
                />
            </View>
        </View>

    );
};

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginBottom: 10
    },
    userIcon: {
        fontSize: 30,
        marginRight: 15,
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20
    },
    userName: {
        flex: 1,
        fontSize: 16,
        color: COLORS.text_dark,
        marginLeft: 15,
        fontWeight: '500',
    },
    newRider: {
        color: COLORS.button_blue_bg
    },
});

export default UserList;