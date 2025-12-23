import React from "react";
import { useEffect, useRef } from "react";
import { Animated, View, Text } from "react-native";
import styles from '../styles/chatbot';
// Komponenta za animirane točkice
export const ThinkingDots = () => {
    const dot1Anim = useRef(new Animated.Value(0)).current;
    const dot2Anim = useRef(new Animated.Value(0)).current;
    const dot3Anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const createAnimation = (animValue: Animated.Value, delay: number) => {
            return Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(animValue, {
                        toValue: -8,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                    Animated.timing(animValue, {
                        toValue: 0,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                ])
            );
        };

        const animation = Animated.parallel([
            createAnimation(dot1Anim, 0),
            createAnimation(dot2Anim, 150),
            createAnimation(dot3Anim, 300),
        ]);

        animation.start();

        return () => animation.stop();
    }, []);

    return (
        <View style={styles.thinkingContainer}>
            <Text style={styles.thinkingText}>Razmišljam</Text>
            <View style={styles.dotsContainer}>
                <Animated.View style={[styles.dot, { transform: [{ translateY: dot1Anim }] }]} />
                <Animated.View style={[styles.dot, { transform: [{ translateY: dot2Anim }] }]} />
                <Animated.View style={[styles.dot, { transform: [{ translateY: dot3Anim }] }]} />
            </View>
        </View>
    );
};