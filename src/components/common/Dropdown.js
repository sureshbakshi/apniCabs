import { StyleSheet, View } from "react-native"
import SelectDropdown from 'react-native-select-dropdown';
import { Icon } from "./Icon";
import { Text } from "./Text";

export default ({ label, name, options,onChange, ...props }) => {
    return <View style={styles.dropdown}>
        <SelectDropdown
            data={options || []}
            onSelect={(selectedItem, index) => {
                onChange(selectedItem?.id);
            }}
            renderButton={(selectedItem, isOpened) => {
                return (
                    <View style={styles.dropdownButtonStyle}>
                        <Text style={styles.dropdownButtonTxtStyle}>
                            {(selectedItem && selectedItem.name) || label}
                        </Text>
                        <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={styles.dropdownButtonArrowStyle} />
                    </View>
                );
            }}
            renderItem={(item, index, isSelected) => {
                return (
                    <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                        <Text style={styles.dropdownItemTxtStyle}>{item.name}</Text>
                    </View>
                );
            }}
            showsVerticalScrollIndicator={false}
            dropdownStyle={styles.dropdownMenuStyle}
        />
        {/* {error && <Text style={CommonStyles.errorTxt}>{error?.message}</Text>} */}

    </View>
};

const styles = StyleSheet.create({
    dropdownButtonStyle: {
        width: '100%',
        borderColor: '#CCCCCC',
        borderRadius: 8,
        borderWidth: 0.5,
        paddingHorizontal: 15,
        height: 44,
        fontSize: 16,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    dropdownButtonTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
    },
    dropdownButtonArrowStyle: {
        fontSize: 28,
    },
    dropdownButtonIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
    dropdownMenuStyle: {
        backgroundColor: '#E9ECEF',
        borderRadius: 8,
    },
    dropdownItemStyle: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
    },
    dropdownItemTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
    },
    dropdownItemIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
});