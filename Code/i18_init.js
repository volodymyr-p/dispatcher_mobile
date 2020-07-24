import AsyncStorage from '@react-native-community/async-storage';
import i18next from 'i18next';

export async function i18init() {
    let language = await AsyncStorage.getItem('language');
    let langDictionary;

    if (language == 'en') {
        langDictionary = require(`../locale/en.json`);
    }
    else if (language == 'ru') {
        langDictionary = require(`../locale/ru.json`);
    }
    else if (language == 'uk') {
        langDictionary = require(`../locale/uk.json`);
    }
    else {
        language = 'uk'
        langDictionary = require(`../locale/uk.json`);
    }

    i18next.init({
        lng: language,
        resources: langDictionary,
        preload: true,
        react: {
            wait: true,
        }
    });
}