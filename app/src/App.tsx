import React, { useState } from "react";
import "@tensorflow/tfjs-react-native";
import { registerRootComponent } from "expo";
import { Provider as PaperProvider } from "react-native-paper";
import { Start } from "./components/Start";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Home } from "./components/Home";
import { Camera } from "./components/Camera";
import { StartHeader } from "./components/Start/StartHeader";

export default function App() {
  const Stack = createStackNavigator();
  const [devMode, setDevMode] = useState(false);

  const handleChangeDevMode = () => {
    setDevMode(!devMode);
  };

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen
            name="Start"
            options={{
              headerTitle: (props) => (
                <StartHeader
                  stackHeaderTitleProps={props}
                  changeDevMode={handleChangeDevMode}
                  devMode={devMode}
                />
              ),
            }}
          >
            {(props) => <Start devMode={devMode} />}
          </Stack.Screen>
          <Stack.Screen name="Camera" component={Camera} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

registerRootComponent(App);
