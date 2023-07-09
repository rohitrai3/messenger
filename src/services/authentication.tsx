import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import app from "./firebase";

const provider = new GoogleAuthProvider();
const auth = getAuth(app);

const authenticate = async () => {
  await signInWithPopup(auth, provider)
    .then((response) => {
      const user = response.user;
      console.log("user: ", user);
    })
    .catch((error) => {
      console.log("Authentication error: ", error);
    });
};

export default authenticate;
