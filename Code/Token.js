import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

export async function RefreshToken(new_login, new_pass) {
  let login = await AsyncStorage.getItem('login');
  let pass = await AsyncStorage.getItem('password');

  if(new_login) {
    login = new_login;
  }

  if(new_pass){
    pass = new_pass;
  } 
  
  try {
    const response = await axios.request({
      method: "post",
      url: `${global.DOMAIN}logreg/login`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        email: login,
        password: pass
      }),
      timeout: 6000
    });

    if (response.status === 200) {
        const token = response.data;
        StoreToken(token);
        return true;
      } else {
        global.navigation.navigate('Login');
        return false
      }
  } catch (error) {
      console.log(error)
      if(error.message === 'timeout of 6000ms exceeded'){
      return 'timeout';
    }
  }
}

export async function StoreToken(tokenValue) {
  try {
    global.token = tokenValue;
    await AsyncStorage.setItem('token', tokenValue);
  } catch (err) {
    console.error(`The error is: ${err}`)
  }
};

export async function DeleteToken() {
  try {
    await AsyncStorage.removeItem('token')
  } catch (err) {
    console.error(`The error is: ${err}`)
  }
}

export async function ChangeLoginStatus(data) {
  try {
    await AsyncStorage.setItem('isLogged', JSON.stringify(data))
  } catch (err) {
    console.error(`The error is: ${err}`)
  }
}

export async function StoreLogPass(log, pass) {
  try {
    await AsyncStorage.setItem('login', JSON.stringify(log));
    await AsyncStorage.setItem('password', JSON.stringify(pass));
  } catch (err) {
    console.error(`The error is: ${err}`)
  }
}
export async function DeleteLogPass() {
    await AsyncStorage.multiRemove(['login', 'password']);
}
//(isActiveResponse.message == 'invalid token' || isActiveResponse.message == 'jwt expired' || isActiveResponse.message == 'jwt malformed')
