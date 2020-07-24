Creating->
npx react-native init requests_executer

cd requests_executer
replaceAll com.requests_executer -> com.vyshgorod.dispatherhcs.requests_executer


added internet on Android 9
as network_security_config and line in AndroidManifest


added android/local.properties file with
sdk.dir=C\:\\Users\\buzit\\AppData\\Local\\Android\\sdk

Run->
run on android
cd android && .\gradlew clean && cd ../ && react-native run-android

start withour rebuild ('nmp i' Or 'new file' will fail)
react-native start

//получить android\app\build\outputs\apk\app-release.apk
cd android && .\gradlew assembleRelease && cd ../

//получить android\app\build\outputs\bundle\release\app.aab
cd android && .\gradlew bundleRelease && cd ../

//Else-> next commit
//vishgorod.mail@gmail.com

navigation->
npm i react-navigation react-native-gesture-handler react-navigation-stack
npm i react-native-safe-area-context
npm i @react-native-community/masked-view

returning code->
adding for drawer(side menu) swipe
https://medium.com/@shreyasnisal/swipe-to-toggle-drawer-in-react-native-66f01d5dc3df

npm i @react-native-community/checkbox react-native-really-awesome-button i18next @react-native-community/async-storage
npm i react-native-vector-icons react-native-progress native-base
npm i react-native-document-picker react-native-android-wifi axios
npm i react-navigation-drawer react-native-reanimated
npm i react-native-marquee react-native-material-menu react-native-restart