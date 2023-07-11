import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import app from "./firebase";
import { UserState } from "../store/slices/userSlice";

const provider = new GoogleAuthProvider();
const auth = getAuth(app);

const authenticate = async () => {
  const user: UserState = {
    uid: "Unknown",
    username: "Unknown",
    name: "Unknown",
    photoUrl: "Unknown",
  };
  await signInWithPopup(auth, provider)
    .then(async (response) => {
      const uid = response.user.uid;
      const name = response.user.displayName!;
      const photoUrl = response.user.photoURL!;
      user.uid = uid;
      user.name = name;
      user.photoUrl = photoUrl;
    })
    .catch((error) => {
      console.log("Authentication error: ", error);
    });
  return user;
};

export default authenticate;
