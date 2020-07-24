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
    warning = "#faa61a",
    invalid = "#fa1a1a"

export default {
  container: {
    flex: 1,
    backgroundColor: gray_dark,
  },
  input: {
    borderBottomColor: gray_light,
    borderBottomWidth: 1,
    marginLeft: '5%',
    marginRight: '5%',
    color: white
  },
  inputInvalid: {
    borderColor: invalid,
    borderWidth: 1,
    marginLeft: '5%',
    marginRight: '5%',
    color: white
  },
  inputFlat: {
    borderBottomColor: gray_light,
    borderBottomWidth: 1,
    marginLeft: '5%',
    marginRight: '5%',
    flex: 0.9
  },
  addPhotoButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    marginLeft: '5%',
    marginRight: '5%',
    color: gray_light
  },
  checkboxText: {
    fontSize: 13,
    marginLeft: 5
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center', 
    marginLeft: '10%', 
    marginBottom: '5%', 
    marginTop: '5%'
  },
  showMetersContainer: {
    marginTop: '10%',
    marginLeft: '5%',
    marginRight: '5%',
    padding: '1%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sendMetersContainer: {
    marginTop: '10%',
    marginLeft: '5%',
    marginRight: '5%',
    padding: '1%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  showMetersText: {
    color: '#3291b6'
  },
  sendMetersText: {
    color: gray_dark
  }
}