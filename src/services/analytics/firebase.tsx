import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBhUtTZjQbswIq-VCPKDcZxoIdZZZN838A",
  authDomain: "analytics-c17c7.firebaseapp.com",
  projectId: "analytics-c17c7",
  storageBucket: "analytics-c17c7.appspot.com",
  messagingSenderId: "649878805811",
  appId: "1:649878805811:web:fe887b70d6ba01c87d3246",
  measurementId: "G-G43S8VGM1R",
  databaseURL:
    "https://analytics-c17c7-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

const app = initializeApp(firebaseConfig, "analytics");

export default app;
