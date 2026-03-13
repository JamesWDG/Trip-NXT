import React, { useState } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    Image,
} from "react-native";
import { CardField, useStripe } from "@stripe/stripe-react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Lock } from "lucide-react-native";
import PrimaryHeader from "../../components/primaryHeader/PrimaryHeader";
import GeneralStyles from "../../utils/GeneralStyles";
import colors from "../../config/colors";
import fonts from "../../config/fonts";
import images from "../../config/images";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GradientButtonForAccomodation from "../../components/gradientButtonForAccomodation/GradientButtonForAccomodation";

const SAVED_CARD_WITH_TOKEN_KEY = "savedCardWithToken";

export type SavedCardDetails = {
    id: string;
    last4: string;
    expiryMonth: string;
    expiryYear: string;
    brand: string;
};

const AddNewCard = () => {
    const { createToken } = useStripe();
    const navigation = useNavigation();
    const { bottom } = useSafeAreaInsets();
    const [isLoading, setIsLoading] = useState(false);

    const handleCreateToken = async () => {
        setIsLoading(true);
        try {
            const { token, error } = await createToken({
                type: "Card",
            });
            // console.log('token', token?.card)
            if (error) {
                console.log("Error:", error.message);
            } else if (token?.id && token?.card) {
                const card = token.card as { last4?: string; expMonth?: number; expYear?: number; brand?: string };
                const expiryMonth = String(card.expMonth ?? 0).padStart(2, "0");
                const expiryYear = String(card.expYear ?? 0).slice(-2);
                const details: SavedCardDetails = {
                    id: token.id,
                    last4: card.last4 ?? "",
                    expiryMonth,
                    expiryYear,
                    brand: (card.brand ?? "VISA").toUpperCase(),
                };
                await AsyncStorage.setItem(SAVED_CARD_WITH_TOKEN_KEY, JSON.stringify(details));
                navigation.goBack();
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={[GeneralStyles.flex, styles.container]}>
            <PrimaryHeader
                title="Add New Card"
                color={colors.black}
                onBackPress={() => navigation.goBack()}
                onProfilePress={() => { }}
            />
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={[styles.scrollContent, { paddingBottom: bottom + 24 }]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Hero section with image */}
                <View style={styles.heroSection}>
                    <View style={styles.imageWrapper}>
                        <Image
                            source={images.card}
                            style={styles.heroImage}
                            resizeMode="contain"
                        />
                    </View>
                    <Text style={styles.heroTitle}>Add payment card</Text>
                    <Text style={styles.heroSubtitle}>
                        Add a card to pay for your orders quickly and securely.
                    </Text>
                </View>

                {/* Card form container */}
                <View style={styles.formCard}>
                    <Text style={styles.formTitle}>Card details</Text>
                    <View style={styles.cardFieldWrapper}>
                        <CardField
                            postalCodeEnabled={false}
                            placeholders={{
                                number: "4242 4242 4242 4242",
                                expiration: "MM/YY",
                                cvc: "CVC",
                            }}
                            style={styles.cardField}
                        />
                    </View>

                    <View style={styles.secureRow}>
                        <Lock size={16} color={colors.c_666666} />
                        <Text style={styles.secureText}>Your payment details are encrypted and secure.</Text>
                    </View>
                </View>

                <GradientButtonForAccomodation
                    title="Add card"
                    onPress={handleCreateToken}
                    color={colors.white}
                    fontSize={16}
                    fontFamily={fonts.semibold}
                    otherStyles={styles.buttonStyle}
                    disabled={isLoading}
                />
            </ScrollView>
        </View>
    );
};

export default AddNewCard;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 16,
    },
    heroSection: {
        alignItems: "center",
        marginBottom: 28,
    },
    imageWrapper: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: colors.c_F3F3F3,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    heroImage: {
        width: 72,
        height: 72,
    },
    heroTitle: {
        fontSize: 22,
        fontFamily: fonts.semibold,
        color: colors.black,
        marginBottom: 8,
        textAlign: "center",
    },
    heroSubtitle: {
        fontSize: 14,
        fontFamily: fonts.normal,
        color: colors.c_666666,
        textAlign: "center",
        lineHeight: 20,
        paddingHorizontal: 16,
    },
    formCard: {
        backgroundColor: colors.c_F6F6F6,
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
    },
    formTitle: {
        fontSize: 16,
        fontFamily: fonts.semibold,
        color: colors.black,
        marginBottom: 16,
    },
    cardFieldWrapper: {
        backgroundColor: colors.white,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 4,
        marginBottom: 14,
        minHeight: 50,
        justifyContent: "center",
    },
    cardField: {
        width: "100%",
        height: 50,
    },
    secureRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    secureText: {
        fontSize: 12,
        fontFamily: fonts.normal,
        color: colors.c_666666,
        flex: 1,
    },
    buttonStyle: {
        borderRadius: 100,
        height: 52,
        justifyContent: "center",
        alignItems: "center",
    },
});
