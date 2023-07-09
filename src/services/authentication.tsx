import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import app from "./firebase";
import { UserState } from "../store/slices/userSlice";

const provider = new GoogleAuthProvider();
const auth = getAuth(app);

const authenticate = async () => {
  const user: UserState = { name: "Unknown", email: "Unknown" };
  await signInWithPopup(auth, provider)
    .then((response) => {
      console.log("response: ", response);
      (user.name = response.user.displayName!),
        (user.email = response.user.email!);
    })
    .catch((error) => {
      console.log("Authentication error: ", error);
    });
  return user;
};

export default authenticate;
