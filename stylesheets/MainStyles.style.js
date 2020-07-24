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
  container: {
    flex: 1,
    backgroundColor: gray_dark
  },
  card: {
    margin: '2%',
    padding: 7,
    borderRadius: 10,
    backgroundColor: blue_middle
  },
  card_success: {
    margin: '2%',
    padding: 7,
    borderRadius: 10,
    backgroundColor: success
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: gray_dark
  },
  white_text: {
    color: white
  },
  white_text_center: {
    color: white,
    textAlign: 'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  doneButton:{
    backgroundColor: "#43b581",
    borderRadius: 10
  },
  declineButton: {
    backgroundColor: "#f04747",
    borderRadius: 10
  },
  acceptButton: {
    backgroundColor: "#43b581",
    borderRadius: 10
  },
  uploadButton: {
    backgroundColor: "yellow",
    borderRadius: 10
  },
  statementButtonText: {
    fontSize: 11,
    padding: '2%'
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.9)',
  },  
  modalTextInput: {
    width: '80%',
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'white',
    textAlignVertical: "top"
  },


  text: {
    color: '#fff'
  },
  // acceptedStatement & statement info styles
  scrollView: {
    width: '100%',
  },
  item: {
    width: '50%',
    marginBottom: '5%',
    height: '100%',
  },
  itemOdd: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    alignItems: 'flex-start',
    backgroundColor: '#5c8694',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  // login styles
  loginContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#414141',
  },
  loginInput: {
    width: '80%',
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#808080",
    marginBottom: 10,
    color: '#ffffff'
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
  dropDownList: {
    height: 50,
    width: 350
  },
  bigRedText: {
    fontSize: 30,
    color: "#a00000"
  },

  // main styles
  mainButtonContainer: {
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tile: {
    backgroundColor: '#f2f4ea'
  },
  renderItemConteiner: {
    margin: '0.5%',
    backgroundColor: '#74a498'
  },

  separateLine: {
    width: '90%',
    height: 1,
    backgroundColor: 'lightgrey'
    // borderWidth: 1,
    // borderColor: 'red'
  },

  // Upload manager
  sectionHeader: {
    marginTop: 10,
    marginBottom: 10,
    width: '100%',
    alignSelf: 'center',
    textAlign: "left",
    paddingLeft: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 10,
    backgroundColor: 'grey',
  },
  settingsSelector: {
    width: '100%',
    minHeight: 50
  },
  label: {
    color: '#78a2b7',
    alignSelf: 'flex-start',
    margin: 15,
    fontSize: 16
  },
  startWorkButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    height: 200,
    width: 300,
    borderRadius: 200,
    backgroundColor: '#5c8694',
  },
  
  //SideMenu
  menuContainer: {
    flex: 1
  },
  navItemStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 15,
    height: 30
  },
  navSectionStyle: {
    backgroundColor: 'white',
    marginTop: 15
  },
  sectionHeadingStyle: {
    paddingVertical: 10,
    paddingHorizontal: 5
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 20,
    backgroundColor: '#9bc3cd'
  },
  headerContainer: {
    flexDirection: 'row',
    padding: 20,
    height: 200,
    backgroundColor: '#9bc3cd'
  },
  userImg:{
    width: 50,
    height:50
  },
  sideMenuIcon:
  {
    resizeMode: 'center',
    width: 28,
    height: 28,
    marginRight: 10,
    marginLeft: 20

  },
  SeparatorLine: {
    marginTop: 10,
    alignSelf: 'center',
    backgroundColor: 'lightgrey',
    width: 1000,
    height: 1,
  },
  startShiftBtnText: {
    color: '#fff', 
    fontSize: 25, 
    justifyContent: 'center',
    alignItems: 'center',
  }
};