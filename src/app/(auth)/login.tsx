import { router } from "expo-router";
import { useFormik } from "formik";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";

import { useAuth } from "@/context/AuthContext";

const LoginScreen = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useAuth();

  const formik = useFormik({
    initialValues: {
      username: "emilys",
      password: "emilyspass",
    },
    validationSchema: Yup.object().shape({
      username: Yup.string().required("Username is required"),
      password: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await signIn(values.username, values.password);
      } catch (error: any) {
        console.error("Login error:", error);
      } finally {
        setLoading(false);
      }
    },
  });
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      {/* Username */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={[
            styles.input,
            formik.touched.username &&
              formik.errors.username &&
              styles.inputError,
          ]}
          placeholder="you@example.com"
          placeholderTextColor="#9CA3AF"
          value={formik.values.username}
          onChangeText={formik.handleChange("username")}
          onBlur={formik.handleBlur("username")}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        {formik.touched.username && formik.errors.username && (
          <Text style={styles.errorText}>{formik.errors.username}</Text>
        )}
      </View>

      {/* Password */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[
              styles.input,
              styles.passwordInput,
              formik.touched.password &&
                formik.errors.password &&
                styles.inputError,
            ]}
            placeholder="••••••••"
            placeholderTextColor="#9CA3AF"
            value={formik.values.password}
            onChangeText={formik.handleChange("password")}
            onBlur={formik.handleBlur("password")}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={styles.showButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text style={styles.showButtonText}>
              {showPassword ? "Hide" : "Show"}
            </Text>
          </TouchableOpacity>
        </View>
        {formik.touched.password && formik.errors.password && (
          <Text style={styles.errorText}>{formik.errors.password}</Text>
        )}
      </View>

      {/* Forgot Password */}
      <TouchableOpacity style={styles.forgotPassword}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity
        onPress={() => formik.handleSubmit()}
        style={[
          styles.button,
          (!formik.isValid || loading) && styles.buttonDisabled,
        ]}
        disabled={loading || !formik.isValid}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </TouchableOpacity>

      {/* Signup Link */}
      <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
        <Text style={styles.signupText}>
          Don't have an account? <Text style={styles.signupLink}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2F4768",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 32,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    color: "#1A1A1A",
  },
  inputError: {
    borderColor: "#EF4444",
  },
  inputFocused: {
    borderColor: "#2F4768",
    borderWidth: 2,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 14,
    marginTop: 4,
  },
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 56,
  },
  showButton: {
    position: "absolute",
    right: 16,
    top: 12,
  },
  showButtonText: {
    color: "#2F4768",
    fontWeight: "500",
    fontSize: 14,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "#2F4768",
    fontSize: 14,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#2F4768",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  signupText: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 16,
    fontSize: 14,
  },
  signupLink: {
    color: "#2F4768",
    fontWeight: "600",
  },
});

export default LoginScreen;
