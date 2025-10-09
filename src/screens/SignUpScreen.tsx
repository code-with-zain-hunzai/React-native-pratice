"use client"

import type React from "react"
import { useState } from "react"
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from "react-native"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { colors } from "../style/colors"
import { spacing, borderRadius, shadows } from "../style/spacing"
import { typography } from "../style/typography"
import { signUpSchema, type SignUpFormData } from "../schemas/authSchemas"
import { useAuth } from "../hooks/useAuth"

interface SignUpScreenProps {
    onNavigateToSignIn: () => void
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({ onNavigateToSignIn }) => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const { signUp, isLoading, error } = useAuth()

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
        defaultValues: { fullName: "", email: "", password: "", confirmPassword: "" },
    })

    const onSubmit = async (data: SignUpFormData) => {
        try {
            await signUp({
                email: data.email,
                password: data.password,
                name: data.fullName, // Map fullName to name for API
            })
            
            Alert.alert(
                "Success", 
                "Account created successfully!", 
                [{ text: "OK", onPress: onNavigateToSignIn }]
            )
        } catch (err) {
            // Error is already handled by useAuth hook
            Alert.alert(
                "Sign Up Failed", 
                error || "An error occurred during sign up. Please try again."
            )
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.container}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
            <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Sign up to get started</Text>
                </View>

                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Full Name</Text>
                            <Controller
                                control={control}
                                name="fullName"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        style={[styles.input, errors.fullName && styles.inputError]}
                                        placeholder="Enter your full name"
                                        placeholderTextColor={colors.text.hint}
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        autoCapitalize="words"
                                        autoComplete="name"
                                        textContentType="name"
                                        accessible
                                        accessibilityLabel="Full Name"
                                    />
                                )}
                            />
                            {errors.fullName && <Text style={styles.errorText}>{errors.fullName.message}</Text>}
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Email</Text>
                            <Controller
                                control={control}
                                name="email"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        style={[styles.input, errors.email && styles.inputError]}
                                        placeholder="Enter your email"
                                        placeholderTextColor={colors.text.hint}
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoComplete="email"
                                        textContentType="emailAddress"
                                        accessible
                                        accessibilityLabel="Email"
                                    />
                                )}
                            />
                            {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.inputRow}>
                                <Controller
                                    control={control}
                                    name="password"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            style={[styles.input, styles.inputFlex, errors.password && styles.inputError]}
                                            placeholder="Create a password"
                                            placeholderTextColor={colors.text.hint}
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            secureTextEntry={!showPassword}
                                            autoCapitalize="none"
                                            autoComplete="password-new"
                                            textContentType="newPassword"
                                            accessible
                                            accessibilityLabel="Password"
                                        />
                                    )}
                                />
                            </View>
                            {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Confirm Password</Text>
                            <View style={styles.inputRow}>
                                <Controller
                                    control={control}
                                    name="confirmPassword"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            style={[styles.input, styles.inputFlex, errors.confirmPassword && styles.inputError]}
                                            placeholder="Confirm your password"
                                            placeholderTextColor={colors.text.hint}
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            secureTextEntry={!showConfirm}
                                            autoCapitalize="none"
                                            autoComplete="password-new"
                                            textContentType="newPassword"
                                            accessible
                                            accessibilityLabel="Confirm Password"
                                        />
                                    )}
                                />
                            </View>
                            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}
                        </View>

                        <TouchableOpacity
                            style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
                            onPress={handleSubmit(onSubmit)}
                            disabled={isLoading}
                            accessibilityRole="button"
                        >
                            <Text style={styles.primaryButtonText}>{isLoading ? "Creating Account..." : "Sign Up"}</Text>
                        </TouchableOpacity>

                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>OR</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        <TouchableOpacity style={styles.secondaryButton}>
                            <Text style={styles.secondaryButtonText}>Continue with Google</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.secondaryButton}>
                            <Text style={styles.secondaryButtonText}>Continue with Facebook</Text>
                        </TouchableOpacity>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Already have an account? </Text>
                            <TouchableOpacity onPress={onNavigateToSignIn}>
                                <Text style={styles.linkText}>Sign In</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.termsText}>
                            By signing up, you agree to our <Text style={styles.linkText}>Terms of Service</Text> and{" "}
                            <Text style={styles.linkText}>Privacy Policy</Text>
                        </Text>
                    </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.xxl,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.lg,
        justifyContent: "center",
    },
    header: {
        marginBottom: spacing.lg,
    },
    title: {
        ...typography.h1,
        color: colors.text.primary,
        marginBottom: spacing.sm,
    },
    subtitle: {
        ...typography.body1,
        color: colors.text.secondary,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.xl,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.large,
    },
    form: {
        flex: 1,
    },
    inputContainer: {
        marginBottom: spacing.lg,
    },
    label: {
        ...typography.body2,
        color: colors.text.primary,
        marginBottom: spacing.sm,
        fontWeight: "600",
    },
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    inputFlex: {
        flex: 1,
    },
    input: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        ...typography.body1,
        color: colors.text.primary,
    },
    eyeToggle: {
        marginLeft: spacing.sm,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.sm,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: "#FBFBFF",
    },
    eyeToggleText: {
        ...typography.body2,
        color: colors.primary,
        fontWeight: "600",
    },
    inputError: {
        borderColor: colors.error,
        borderWidth: 1.5,
    },
    errorText: {
        ...typography.caption,
        color: colors.error,
        marginTop: spacing.xs,
    },
    primaryButton: {
        backgroundColor: colors.primary,
        borderRadius: borderRadius.md,
        paddingVertical: spacing.md,
        alignItems: "center",
        ...shadows.medium,
        marginBottom: spacing.lg,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    primaryButtonText: {
        ...typography.buttonLarge,
        color: colors.surface,
    },
    divider: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: spacing.lg,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: colors.border,
    },
    dividerText: {
        ...typography.body2,
        color: colors.text.secondary,
        marginHorizontal: spacing.md,
    },
    secondaryButton: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.md,
        paddingVertical: spacing.md,
        alignItems: "center",
        marginBottom: spacing.md,
    },
    secondaryButtonText: {
        ...typography.button,
        color: colors.text.primary,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: spacing.xl,
    },
    footerText: {
        ...typography.body2,
        color: colors.text.secondary,
    },
    linkText: {
        ...typography.body2,
        color: colors.primary,
        fontWeight: "700",
    },
    termsText: {
        ...typography.caption,
        color: colors.text.secondary,
        textAlign: "center",
        marginTop: spacing.lg,
    },
})
