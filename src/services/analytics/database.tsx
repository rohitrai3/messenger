import app from "./firebase";
import { child, get, getDatabase, ref, set } from "firebase/database";

const database = getDatabase(app);

export const incrementVisitorCounter = async (projectName: string) => {
  await get(child(ref(database), `${projectName}/visitorCount`))
    .then(async (snapshot) => {
      if (snapshot.exists()) {
        const count = snapshot.val();
        await set(ref(database, `${projectName}/visitorCount`), count + 1)
          .then(() => {
            console.log("Visitor count incremented.");
          })
          .catch((error) => {
            console.log("Error while incrementing visitor count: ", error);
          });
      } else {
        await set(ref(database, `${projectName}/visitorCount`), 1)
          .then(() => {
            console.log("Visitor count initialized.");
          })
          .catch((error) => {
            console.log("Error while initializing visitor count: ", error);
          });
      }
    })
    .catch((error) => {
      console.log("Error while fetching visitor count: ", error);
    });
};
