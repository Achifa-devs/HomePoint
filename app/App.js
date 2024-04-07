/*
  @format

*/

import React, { 
  useEffect, 
  useState 
} from 'react';
// import BackImgSvg from './android/app/src/studio/assets/back-svgrepo-com (1).svg'

import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';



import { 
  Provider, 
  useSelector 
} from 'react-redux';

import {
  createNativeStackNavigator
} from '@react-navigation/native-stack';

import ProductData from './android/app/src/studio/screen/ProductData';
import { 
  NavigationContainer 
} from '@react-navigation/native';



function App(){
  
  return (
    
    <Provider store={store}>
      <NavigationContainer>
        {/* <Stack.Navigator >

          <BuyerRoutes stack={Stack} />
          <SellerRoutes stack={Stack} selected_profession={selected_profession} seller_menu={menu} />
    
          
            

        </Stack.Navigator> */}

        <SellerNavigator /> 
        {/* <FlashMessage position="top" backgroundColor="red" />  */}

        

        
      </NavigationContainer>
    </Provider> 
  );
}



function SellerNavigator() {
  const Stack = createNativeStackNavigator();
  

  
 
  

  
  return(
    <Stack.Navigator>

      <Stack.Screen name={'seller-login'}
        options={{

          header: () =>
          (
            <View style={{ height: 100, display: 'none'}}>
            
             
            </View>
          ),
            
            
      }} component={WelcomeScreen} />

     
    </Stack.Navigator>
  )
}

export default App;
