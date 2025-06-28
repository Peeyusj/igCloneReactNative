import { Link } from "expo-router";
import React from "react";
import { Text } from "react-native";

export default function Profile() {
  return <Link href="/profile">
    <Text>
    Go to Profile Tab
    </Text>
    
    </Link>;
}
