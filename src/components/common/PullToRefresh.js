import React, { useState, useCallback } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { COLORS } from '../../constants'; // Adjust path to your constants

const PullToRefresh = ({ 
    children, 
    onRefresh, 
    refreshing = false, 
    style, 
    contentContainerStyle,
    colors = [COLORS.primary], // Android spinner colors
    tintColor = COLORS.primary, // iOS spinner color
    ...props 
}) => {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = useCallback(async () => {
        if (onRefresh) {
            setIsRefreshing(true);
            try {
                await onRefresh();
            } catch (error) {
                console.error("PullToRefresh Error:", error);
            } finally {
                setIsRefreshing(false);
            }
        }
    }, [onRefresh]);

    // Allow parent to control refreshing state if passed, otherwise use local state
    const activeRefreshing = refreshing || isRefreshing;

    return (
        <ScrollView
            style={style}
            contentContainerStyle={contentContainerStyle}
            refreshControl={
                <RefreshControl
                    refreshing={activeRefreshing}
                    onRefresh={handleRefresh}
                    colors={colors} 
                    tintColor={tintColor}
                    title="Pull to refresh" // iOS only
                    titleColor={tintColor}
                />
            }
            {...props}
        >
            {children}
        </ScrollView>
    );
};

export default PullToRefresh;