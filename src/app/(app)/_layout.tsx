import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BottomNavigation, Drawer } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import ExploreScreen from "./explore";
import HomeScreen from "./index";

const routes = [
  {
    key: "index",
    title: "Home",
    focusedIcon: "home",
    unfocusedIcon: "home-outline",
  },
  {
    key: "explore",
    title: "Explore",
    focusedIcon: "compass",
    unfocusedIcon: "compass-outline",
  },
];

const drawerItems = [
  {
    label: "Home",
    icon: "home-outline",
    route: "/(app)",
    color: "#2F4768",
    activeColor: "#32B4C8",
  },
  {
    label: "Explore",
    icon: "compass-outline",
    route: "/(app)/explore",
    color: "#2F4768",
    activeColor: "#F59E0B",
  },
];

const AppLayout = () => {
  const router = useRouter();
  const segments = useSegments();
  const { signOut } = useAuth();
  const [index, setIndex] = useState(0);
  const [showDrawer, setShowDrawer] = useState(false);
  const [activeDrawerItem, setActiveDrawerItem] = useState("index");

  useEffect(() => {
    const currentRoute = segments[1] || "index";
    const routeIndex = routes.findIndex((r) => r.key === currentRoute);
    if (routeIndex !== -1 && routeIndex !== index) {
      setIndex(routeIndex);
      setActiveDrawerItem(currentRoute);
    }
  }, [segments]);

  const handleIndexChange = (newIndex: number) => {
    setIndex(newIndex);
    const route = routes[newIndex];
    setActiveDrawerItem(route.key);
    if (route.key === "index") {
      router.push("/(app)");
    } else if (route.key === "explore") {
      router.push("/(app)/explore");
    }
  };

  const renderScreen = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case "index":
        return <HomeScreen />;
      case "explore":
        return <ExploreScreen />;
      default:
        return <HomeScreen />;
    }
  };

  const handleSignOut = async () => {
    setShowDrawer(false);
    await signOut();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setShowDrawer(!showDrawer)}
        >
          <Ionicons name="menu" size={28} color="#2F4768" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{routes[index]?.title || "App"}</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="notifications-outline" size={24} color="#2F4768" />
          </TouchableOpacity>
        </View>
      </View>

      {showDrawer && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setShowDrawer(false)}
        />
      )}

      <Drawer.Section
        style={[
          styles.drawer,
          { transform: [{ translateX: showDrawer ? 0 : -300 }] },
        ]}
      >
        <Drawer.Section>
          <View style={styles.drawerHeader}>
            <View style={styles.drawerAvatar}>
              <Ionicons name="person" size={40} color="#FFFFFF" />
            </View>
            <Text style={styles.drawerName}>{"John Doe"}</Text>
            <Text style={styles.drawerEmail}>{"john@example.com"}</Text>
          </View>
        </Drawer.Section>

        <Drawer.Section>
          {drawerItems.map((item) => {
            const isActive =
              activeDrawerItem === item.route.replace("/(app)/", "") ||
              (item.route === "/(app)" && activeDrawerItem === "index");
            return (
              <Drawer.Item
                key={item.route}
                label={item.label}
                icon={({ color, size }) => (
                  <Ionicons
                    name={item.icon as any}
                    size={size}
                    color={isActive ? item.activeColor : item.color}
                  />
                )}
                onPress={() => {
                  setShowDrawer(false);
                  router.push(item.route as any);
                }}
              />
            );
          })}
        </Drawer.Section>

        <Drawer.Section showDivider={false}>
          <Drawer.Item
            label="Sign Out"
            icon={({ size }) => (
              <Ionicons name="log-out-outline" size={size} color="#EF4444" />
            )}
            onPress={handleSignOut}
          />
        </Drawer.Section>
      </Drawer.Section>

      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={handleIndexChange}
        renderScene={renderScreen}
        barStyle={styles.barStyle}
        inactiveColor="#6B7280"
        activeIndicatorStyle={styles.activeIndicator}
        labeled={false}
        shifting={false}
        compact
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  menuButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2F4768",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerButton: {
    padding: 4,
    marginLeft: 8,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
  },
  drawer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: 280,
    backgroundColor: "#FFFFFF",
    zIndex: 1000,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  drawerHeader: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: "#2F4768",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    marginBottom: 8,
  },
  drawerAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  drawerName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  drawerEmail: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
  },
  barStyle: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    elevation: 0,
    height: 60,
  },
  activeIndicator: {
    backgroundColor: "#2F4768",
    borderRadius: 16,
    height: 32,
    marginVertical: 4,
  },
});

export default AppLayout;
