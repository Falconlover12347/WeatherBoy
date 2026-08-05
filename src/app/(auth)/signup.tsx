import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { useFormik } from "formik";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";

const PasswordStrengthIndicator = ({ password }: { password: string }) => {
  const getStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z\d]/.test(password)) score++;
    return score;
  };

  const strength = getStrength();
  const colors = ["#EF4444", "#F59E0B", "#FBBF24", "#34D399"];
  const labels = ["Weak", "Fair", "Good", "Strong"];

  return (
    <View style={{ marginTop: 8 }}>
      <View style={{ flexDirection: "row", gap: 4 }}>
        {[0, 1, 2, 3].map((index) => (
          <View
            key={index}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 999,
              backgroundColor: index < strength ? colors[index] : "#E5E7EB",
            }}
          />
        ))}
      </View>
      {password.length > 0 && (
        <Text style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>
          Password strength: {labels[strength - 1] || "Weak"}
        </Text>
      )}
    </View>
  );
};

const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .required("Full name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase, one lowercase, and one number",
    ),
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password")], "Passwords do not match"),
});

const SignupScreen = () => {
  const router = useRouter();
  const { signUp } = useAuth();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },

    validationSchema: SignupSchema,

    validateOnChange: true,
    validateOnBlur: true,

    onSubmit: async (values) => {
      setLoading(true);

      try {
        await signUp(values.email, values.password, values.name);
        setShowSuccessModal(true);
      } catch (error) {
        Alert.alert(
          "Signup Failed",
          "Unable to create your account. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
  });

  const handleGoToLogin = () => {
    setShowSuccessModal(false);
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 24, paddingVertical: 32 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ marginBottom: 32 }}>
          <Text style={{ fontSize: 30, fontWeight: "bold", color: "#2F4768" }}>
            Create Account
          </Text>
          <Text style={{ color: "#6B7280", marginTop: 8 }}>
            Sign up to get started
          </Text>
        </View>

        {/* Name */}
        <View style={{ marginBottom: 16 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "500",
              color: "#374151",
              marginBottom: 8,
            }}
          >
            Full Name
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
              fontSize: 16,
              borderColor:
                formik.touched.name && formik.errors.name
                  ? "#EF4444"
                  : "#D1D5DB",
            }}
            placeholder="John Doe"
            value={formik.values.name}
            onChangeText={formik.handleChange("name")}
            onBlur={formik.handleBlur("name")}
            autoCapitalize="words"
          />
          {formik.touched.name && formik.errors.name && (
            <Text style={{ color: "#EF4444", fontSize: 14, marginTop: 4 }}>
              {formik.errors.name}
            </Text>
          )}
        </View>

        {/* Email */}
        <View style={{ marginBottom: 16 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "500",
              color: "#374151",
              marginBottom: 8,
            }}
          >
            Email
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
              fontSize: 16,
              borderColor:
                formik.touched.email && formik.errors.email
                  ? "#EF4444"
                  : "#D1D5DB",
            }}
            placeholder="you@example.com"
            value={formik.values.email}
            onChangeText={formik.handleChange("email")}
            onBlur={formik.handleBlur("email")}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          {formik.touched.email && formik.errors.email && (
            <Text style={{ color: "#EF4444", fontSize: 14, marginTop: 4 }}>
              {formik.errors.email}
            </Text>
          )}
        </View>

        {/* Password */}
        <View style={{ marginBottom: 16 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "500",
              color: "#374151",
              marginBottom: 8,
            }}
          >
            Password
          </Text>
          <View style={{ position: "relative" }}>
            <TextInput
              style={{
                borderWidth: 1,
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: 16,
                paddingRight: 48,
                borderColor:
                  formik.touched.password && formik.errors.password
                    ? "#EF4444"
                    : "#D1D5DB",
              }}
              placeholder="••••••••"
              value={formik.values.password}
              onChangeText={formik.handleChange("password")}
              onBlur={formik.handleBlur("password")}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={{ position: "absolute", right: 16, top: 12 }}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={{ color: "#2F4768", fontWeight: "500" }}>
                {showPassword ? "Hide" : "Show"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Password Strength Indicator */}
          <PasswordStrengthIndicator password={formik.values.password} />

          {formik.touched.password && formik.errors.password && (
            <Text style={{ color: "#EF4444", fontSize: 14, marginTop: 4 }}>
              {formik.errors.password}
            </Text>
          )}
        </View>

        {/* Confirm Password */}
        <View style={{ marginBottom: 16 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "500",
              color: "#374151",
              marginBottom: 8,
            }}
          >
            Confirm Password
          </Text>
          <View style={{ position: "relative" }}>
            <TextInput
              style={{
                borderWidth: 1,
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: 16,
                paddingRight: 48,
                borderColor:
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                    ? "#EF4444"
                    : "#D1D5DB",
              }}
              placeholder="••••••••"
              value={formik.values.confirmPassword}
              onChangeText={formik.handleChange("confirmPassword")}
              onBlur={formik.handleBlur("confirmPassword")}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity
              style={{ position: "absolute", right: 16, top: 12 }}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Text style={{ color: "#2F4768", fontWeight: "500" }}>
                {showConfirmPassword ? "Hide" : "Show"}
              </Text>
            </TouchableOpacity>
          </View>
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <Text style={{ color: "#EF4444", fontSize: 14, marginTop: 4 }}>
              {formik.errors.confirmPassword}
            </Text>
          )}
        </View>

        {/* Signup Button */}
        <TouchableOpacity
          style={{
            borderRadius: 12,
            paddingVertical: 16,
            backgroundColor: loading || !formik.isValid ? "#9CA3AF" : "#2F4768",
          }}
          onPress={() => formik.handleSubmit()}
          disabled={loading || !formik.isValid}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text
              style={{
                color: "#FFFFFF",
                textAlign: "center",
                fontWeight: "600",
                fontSize: 16,
              }}
            >
              Create Account
            </Text>
          )}
        </TouchableOpacity>

        {/* Login Link */}
        <TouchableOpacity
          style={{ marginTop: 16, paddingVertical: 8 }}
          onPress={() => router.push("/(auth)/login")}
        >
          <Text style={{ textAlign: "center", color: "#6B7280" }}>
            Already have an account?{" "}
            <Text style={{ color: "#2F4768", fontWeight: "600" }}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 32,
          }}
        >
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 20,
              paddingVertical: 28,
              paddingHorizontal: 24,
              width: "100%",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            {/* Success Icon */}
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: "#D1FAE5",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Text style={{ fontSize: 32, color: "#10B981" }}>✓</Text>
            </View>

            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#2F4768",
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              Account Created
            </Text>

            <Text
              style={{
                fontSize: 14,
                color: "#6B7280",
                textAlign: "center",
                lineHeight: 20,
                marginBottom: 24,
              }}
            >
              Your account has been created successfully. 
            </Text>

            <TouchableOpacity
              style={{
                backgroundColor: "#2F4768",
                borderRadius: 12,
                paddingVertical: 14,
                width: "100%",
              }}
              onPress={handleGoToLogin}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  textAlign: "center",
                  fontWeight: "600",
                  fontSize: 16,
                }}
              >
                OK, Return to Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default SignupScreen;
