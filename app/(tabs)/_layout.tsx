import { COLORS } from "@/constants/theme";
import { FontAwesome } from "@expo/vector-icons"; // Example for icons
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarInactiveTintColor: COLORS.grey,
        tabBarActiveTintColor: COLORS.primary, // Customize active tab color
        headerShown: false, // Hide the header for individual tab screens if your tabs handle it
        tabBarStyle: {
          backgroundColor: "black",
          borderTopWidth: 0,
          position: "absolute",
          elevation: 0,
          height: 40,
          paddingBottom: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index" // Corresponds to app/(tabs)/index.tsx
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          title: "Bookmarks",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="bookmark" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="plus-circle" color={COLORS.primary} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile" // Corresponds to app/(tabs)/profile.tsx
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="user" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications" // Corresponds to app/(tabs)/notifications.tsx
        options={{
          title: "Notifications",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="bell" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
