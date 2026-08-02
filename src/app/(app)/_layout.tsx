import { Stack } from "expo-router";

const AppLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default AppLayout;
