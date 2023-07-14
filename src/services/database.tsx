import { Message, UserData } from "../common/types";
import { UserState } from "../store/slices/userSlice";
import app from "./firebase";
import { child, get, getDatabase, onValue, ref, set } from "firebase/database";

const database = getDatabase(app);

const getConversationName = (sender: string, receiver: string) => {
  return sender < receiver ? sender + "_" + receiver : receiver + "_" + sender;
};

export const addUser = async (userState: UserState) => {
  await set(ref(database, `users/${userState.uid}`), {
    username: userState.username,
  })
    .then(() => {
      console.log("User saved successfully: ", userState.uid);
    })
    .catch((error) => {
      console.log("Error while saving user: ", error);
    });

  await set(ref(database, `users/${userState.username}`), {
    name: userState.name,
    photoUrl: userState.photoUrl,
  })
    .then(() => {
      console.log("User data saved successfully: ", userState.username);
    })
    .catch((error) => {
      console.log("Error while saving user data: ", error);
    });
};

export const addConnectionRequest = async (
  requester: string,
  requestee: string
) => {
  const requests: string[] = [requester];
  var isRequestExist: boolean = false;

  await get(child(ref(database), `requests/${requestee}`))
    .then(async (snapshot) => {
      if (snapshot.exists()) {
        const fetchedRequests: string[] = snapshot.val();
        isRequestExist = fetchedRequests.includes(requester);
        fetchedRequests.forEach((request) => {
          requests.push(request);
        });
      } else {
        console.log(
          "Connection requests does not exist: ",
          requester,
          requestee
        );
      }

      if (!isRequestExist) {
        await set(ref(database, `requests/${requestee}`), requests)
          .then(() => {
            console.log(
              "Connection request saved successfully: ",
              requester,
              requestee
            );
          })
          .catch((error) => {
            console.log("Error while saving connection request: ", error);
          });
      }
    })
    .catch((error) => {
      console.log("Error while fetching connection requests: ", error);
    });
};

export const addMessage = async (
  sender: string,
  receiver: string,
  message: Message
) => {
  const conversationName = getConversationName(sender, receiver);
  var fetchedMessages: Message[] = [];

  await get(child(ref(database), `chats/${conversationName}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        fetchedMessages = snapshot.val();
      }
    })
    .catch((error) => {
      console.log("Error while fetching chats: ", error);
    });

  fetchedMessages.push(message);

  await set(ref(database, `chats/${conversationName}`), fetchedMessages)
    .then(() => {
      console.log("Message saved successfully: ", conversationName);
    })
    .catch((error) => {
      console.log("Error while saving message: ", error);
    });
};

export const getUsername = async (uid: string) => {
  var username: string = "";

  await get(child(ref(database), `users/${uid}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        username = snapshot.val().username;
      } else {
        console.log("User does not exist: ", uid);
      }
    })
    .catch((error) => {
      console.log("Error while fetching user: ", error);
    });

  return username;
};

export const getUserData = async (username: string) => {
  const userData: UserData = {
    username: username,
    name: "Unknown",
    photoUrl: "Unknown",
  };

  await get(child(ref(database), `users/${username}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        userData.name = snapshot.val().name;
        userData.photoUrl = snapshot.val().photoUrl;
      } else {
        console.log("User data does not exist: ", username);
      }
    })
    .catch((error) => {
      console.log("Error while fetching user data: ", error);
    });

  return userData;
};

export const getConnectionRequestsOnUpdate = async (
  username: string,
  setConnectionRequests: React.Dispatch<React.SetStateAction<UserData[]>>
) => {
  const usersData: UserData[] = [];

  onValue(ref(database, `requests/${username}`), async (snapshot) => {
    if (snapshot.exists()) {
      const usernames: string[] = snapshot.val();
      for (const username of usernames) {
        const userData = await getUserData(username);
        usersData.push(userData);
      }
    } else {
      console.log("Connection requests does not exist: ", username);
    }
    setConnectionRequests(usersData);
  });
};

export const getConnectedUsers = async (username: string) => {
  var connectedUsers: string[] = [];

  await get(child(ref(database), `contacts/${username}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        connectedUsers = snapshot.val();
      }
    })
    .catch((error) => {
      console.log("Error while fetching contacts: ", error);
    });

  return connectedUsers;
};

export const getConnectedUsersOnUpdate = async (
  username: string,
  setConnectedUsersData: React.Dispatch<React.SetStateAction<UserData[]>>
) => {
  const usersData: UserData[] = [];

  onValue(ref(database, `contacts/${username}`), async (snapshot) => {
    if (snapshot.exists()) {
      const usernames: string[] = snapshot.val();
      for (const username of usernames) {
        const userData = await getUserData(username);
        usersData.push(userData);
      }
    } else {
      console.log("Contacts does not exist: ", username);
    }
    setConnectedUsersData(usersData);
  });
};

export const addContact = async (username: string, contact: string) => {
  await get(child(ref(database), `contacts/${username}`))
    .then(async (snapshot) => {
      if (snapshot.exists()) {
        const fetchedContacts = snapshot.val();
        fetchedContacts.push(contact);

        await set(ref(database, `contacts/${username}`), fetchedContacts)
          .then(() => {
            console.log("Contact saved successfully: ", username, contact);
          })
          .catch((error) => {
            console.log("Error while saving contact: ", error);
          });
      } else {
        await set(ref(database, `contacts/${username}`), [contact])
          .then(() => {
            console.log("Contact saved successfully: ", username, contact);
          })
          .catch((error) => {
            console.log("Error while saving contact: ", error);
          });
      }
    })
    .catch((error) => {
      console.log("Error while fetching contact: ", error);
    });
};

export const getMessagesOnUpdate = (
  sender: string,
  receiver: string,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
  const conversationName = getConversationName(sender, receiver);

  onValue(ref(database, `chats/${conversationName}`), (sanpshot) => {
    if (sanpshot.exists()) {
      setMessages(sanpshot.val().reverse());
    }
  });
};

export const removeConnectionRequest = async (
  username: string,
  contact: string
) => {
  await get(child(ref(database), `requests/${username}`)).then(
    async (snapshot) => {
      if (snapshot.exists()) {
        const fetchedRequests = snapshot.val();
        fetchedRequests.splice(fetchedRequests.indexOf(contact), 1);
        await set(ref(database, `requests/${username}`), fetchedRequests)
          .then(() => {
            console.log(
              "Connection request saved successfully: ",
              username,
              contact
            );
          })
          .catch((error) => {
            console.log("Error while saving connection request: ", error);
          });
      }
    }
  );
};

export const checkUidExist = async (uid: string) => {
  var isUidExist: boolean = false;

  await get(child(ref(database), `users/${uid}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        isUidExist = true;
      }
    })
    .catch((error) => {
      console.log("Error while checking uid: ", error);
    });

  return isUidExist;
};

export const checkUsernameExist = async (username: string) => {
  var isUsernameExist: boolean = false;

  await get(child(ref(database), `users/${username}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        isUsernameExist = true;
      }
    })
    .catch((error) => {
      console.log("Error while checking username: ", error);
    });

  return isUsernameExist;
};
