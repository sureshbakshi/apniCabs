import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Icon } from './Icon';
import { COLORS } from '../../constants';

const StarRating = ({ onSubmit, isLoading = false }) => {
    const [rating, setRating] = useState(0); // Rating state (0 to 5)

    // Function to handle star press
    const handlePress = (ratingValue) => {
        if (!isLoading) {
            setRating(ratingValue);
            onSubmit(ratingValue)
        }
    };

    // Function to render stars
    const renderStars = () => {
        let stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <TouchableOpacity key={i} onPress={() => handlePress(i)}>
                    <Icon
                        name={i <= rating ? 'star' : 'star-outline'} // 'star' for filled, 'star-o' for empty
                        size='doubleLarge'
                        color={COLORS.primary}// Gold color for stars
                    />
                </TouchableOpacity>
            );
        }
        return stars;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.ratingText}>Rate this driver:</Text>
            <View style={styles.starContainer}>
                {renderStars()}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 18,
        marginBottom: 10,
    },
    starContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
    },
    ratingValue: {
        fontSize: 16,
        marginTop: 10,
    },
});

export default StarRating;
