import firebase from 'firebase/app';

// Your web app's Firebase configuration
const api_key = process.env.REACT_APP_API_KEY;

var firebaseConfig = {
  apiKey: api_key,
  authDomain: "domments.firebaseapp.com",
  databaseURL: "https://domments.firebaseio.com",
  projectId: "domments",
  storageBucket: "domments.appspot.com",
  messagingSenderId: "75583379576",
  appId: "1:75583379576:web:321019c69fd908713a758d"
};
// Initialize Firebase
var Firebase = firebase.initializeApp(firebaseConfig);
export default Firebase;