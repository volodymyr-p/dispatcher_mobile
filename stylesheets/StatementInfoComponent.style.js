"use strict"
const
    white = "#ffffff",
    blue_dark = "#496974",
    blue_middle = "#5c8694",
    gray_dark = "#414141",
    gray_middle = "#656565",
    gray_light = "#8f8f8f",
    danger = "#f04747",
    success = "#43b581",
    warning = "#faa61a"

export default {
    flatListItemSeparator: {
        height: 0.5,
        width: '90%',
        borderColor: 'white',
        alignSelf: 'center'
    },
    pictureNumberText: {
        fontSize: 15, 
        color: 'white',
        marginRight: 5
    },
    image: {
        width: 51,
        height: 51, 
        resizeMode: 'contain'
    },
    entypoIcons: {
        position: 'absolute',
         right: 45, 
        alignItems: 'center'
    },
    activityIndicator: {
        position: 'absolute', 
        right: 50, 
        alignItems: 'center'
    },
    menu: {
        position: 'absolute', 
        right: 10, 
        alignItems: 'center'
    },
    uploadManagerText: {
        textAlign: 'center', 
        fontWeight: 'bold',
        fontSize: 18,
    },
    uploadManagerView: {
        alignItems: 'center', 
        marginTop: 30,
        marginRight: 30,
        marginLeft: 30,
        borderRadius: 20,
        backgroundColor: gray_light,
        width: '80%',
    },
    noPhotoInfoView: {
        alignItems: 'center', 
        margin: 60,
    },
    noPhotoInfoText: {
        textAlign: 'center', 
        fontWeight: 'bold',
        fontSize: 15,
        color: gray_light
    },
}