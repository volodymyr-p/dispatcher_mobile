import {  PermissionsAndroid } from 'react-native';
import i18next from 'i18next';

export async function RequestCameraPermission() {
    try {
        const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
            {
                title: i18next.t('camera_permission'),
                message: i18next.t('camera_permission_message'),
                buttonNeutral: i18next.t('ask_me_later'),
                buttonNegative: i18next.t('cancel'),
                buttonPositive: i18next.t('ok')
            }
        );
    } catch (err) {
        console.log(err);
    }
}

export async function RequestReadExternalStorage() {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
                title: i18next.t('camera_roll_permission'),
                message: i18next.t('camera_roll_permission_message'),
                buttonNeutral: i18next.t('ask_me_later'),
                buttonNegative: i18next.t('cancel'),
                buttonPositive: i18next.t('ok')
            }
        );
    } catch (err) {
        console.warn(err);
    }
}

