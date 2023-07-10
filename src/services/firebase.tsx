import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDnwgHj41f1FhiWUoHroxghT-fL4uEP7AA",
  authDomain: "messenger-f035e.firebaseapp.com",
  projectId: "messenger-f035e",
  storageBucket: "messenger-f035e.appspot.com",
  messagingSenderId: "821911262281",
  appId: "1:821911262281:web:3df124b8ebc485a1c89b98",
  measurementId: "G-NVYG3C8LZ1",
  databaseURL:
    "https://messenger-f035e-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

const app = initializeApp(firebaseConfig);

export default app;
