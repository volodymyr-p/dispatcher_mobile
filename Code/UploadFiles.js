import DocumentPicker from 'react-native-document-picker';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
// import RNFetchBlob from 'rn-fetch-blob'
// import Upload from 'react-native-background-upload';

// export const pickFiles = async (additionalInfo, updateCallback) => {
//   try {
//     const results = await DocumentPicker.pickMultiple({ // Pick files
//       type: [DocumentPicker.types.allFiles],
//     });

//     uploadFiles(additionalInfo, results, 'files', updateCallback);

//     // let tempUploads = await AsyncStorage.getItem('delayed_uploads');

//     // // Check if delayed_uploads is not empty
//     // if (tempUploads === null)
//     //   tempUploads = [];
//     // else
//     //   tempUploads = JSON.parse(tempUploads);


//     // tempUploads.push({
//     //   results: results,
//     //   additionalInfo: additionalInfo,
//     //   date: new Date().toLocaleDateString()
//     // });
//     // await AsyncStorage.setItem('delayed_uploads', JSON.stringify(tempUploads));

//   } catch (err) {
//     if (DocumentPicker.isCancel(err)) {
//       // User cancelled the picker, exit any dialogs or menus and move on
//     } else {
//       throw err;
//     }
//   }
// }

// export const uploadFiles = async (additionalInfo, results, url, updateCallback) => {
//   const token = await AsyncStorage.getItem('token');
//   let data = new FormData();
//   for (var prop in additionalInfo) {
//     data.append(prop, additionalInfo[prop]);
//   }

//   for (const [index, res] of results.entries()) {
//     data.append(`file_${index}`, {
//       uri: res.uri,
//       type: res.type,
//       name: res.name
//     });
//   }

//   axios.request({
//     method: "post",
//     url: `${global.DOMAIN}${url}`,
//     headers: {
//       Accept: "application/x-www-form-urlencoded",
//       Authorization: token,
//     },
//     data: data,
//     onUploadProgress: (progressEvent) => {
//       if (updateCallback) updateCallback((progressEvent.loaded) / progressEvent.total);
//       console.log(Math.round((progressEvent.loaded * 100) / progressEvent.total));
//     }
//   }).catch(err => {
//     alert("error uploading images: " + err);
//   });
// }

export const uploadFiles = async (additionalInfo, results, url, updateCallback) => {
  const token = await AsyncStorage.getItem('token');
  let data = new FormData();

  for (var prop in additionalInfo) {
    data.append(prop, additionalInfo[prop]);
  }

    data.append(`file_`, {
      uri: additionalInfo.uri,
      type: additionalInfo.type,
      name: additionalInfo.name
    });

  axios.request({
    method: "post",
    url: `${global.DOMAIN}files`,
    headers: {
      Accept: "application/x-www-form-urlencoded",
      Authorization: token,
    },
    data: data,
    onUploadProgress: (progressEvent) => {
      if (updateCallback) updateCallback((progressEvent.loaded) / progressEvent.total);
      let uploadSt = (Math.round((progressEvent.loaded * 100) / progressEvent.total));
      console.log(progressEvent);
    }
  }).catch(err => {
    alert("error uploading images: " + err);
  });
}