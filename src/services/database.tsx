import { Message, UserData } from "../common/types";
import app from "./firebase";
import { child, get, getDatabase, onValue, ref, set } from "firebase/database";

const database = getDatabase(app);

const getConversationName = (sender: string, receiver: string) => {
  return sender < receiver ? sender + "_" + receiver : receiver + "_" + sender;
};

export const createUser = async (
  uid: string,
  username: string,
  name: string,
  photoUrl: string
) => {
  var notification = "";

  await get(child(ref(database), `users/${uid}`))
    .then(async (snapshot) => {
      if (snapshot.exists()) {
        const fetchedUsername = snapshot.val().username;
        if (fetchedUsername !== username) {
          notification = `Wrong username: ${username}`;
        }
      } else {
        console.log("User does not exist: ", uid);
        await set(ref(database, `users/${uid}`), {
          username: username,
        })
          .then(() => {
            console.log("User saved successfully: ", uid);
          })
          .catch((error) => {
            console.log("Error while saving user: ", error);
          });
        await set(ref(database, `users/${username}`), {
          name: name,
          photoUrl: photoUrl,
        })
          .then(() => {
            console.log("User data saved successfully: ", username);
          })
          .catch((error) => {
            console.log("Error while saving user data: ", error);
          });
      }
    })
    .catch((error) => {
      console.log("Error while fetching user: ", error);
    });

  return notification;
};

export const createContact = async (username: string) => {
  await get(child(ref(database), `contacts/${username}`))
    .then(async (snapshot) => {
      if (!snapshot.exists()) {
        console.log("Contact does not exist: ", username);
        await set(ref(database, `contacts/${username}`), [username])
          .then(() => {
            console.log("Contact saved successfully: ", username);
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

export const createConnectionRequest = async (
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

export const createMessage = async (
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
  var username: string = "Unknown";

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

export const getConnectionRequests = async (username: string) => {
  const usersData: UserData[] = [];

  await get(child(ref(database), `requests/${username}`))
    .then(async (snapshot) => {
      if (snapshot.exists()) {
        const usernames: string[] = snapshot.val();
        for (const username of usernames) {
          const userData = await getUserData(username);
          usersData.push(userData);
        }
      } else {
        console.log("Connection requests does not exist: ", username);
      }
    })
    .catch((error) => {
      console.log("Error while fetching connection requests: ", error);
    });

  return usersData;
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

export const getConnectedUsersData = async (username: string) => {
  const usersData: UserData[] = [];
  const users = await getConnectedUsers(username);
  users.splice(users.indexOf(username), 1);

  for (const username of users) {
    const userData = await getUserData(username);
    usersData.push(userData);
  }

  return usersData;
};

export const updateContact = async (username: string, contact: string) => {
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

        await get(child(ref(database), `contacts/${contact}`)).then(
          async (snapshot) => {
            if (snapshot.exists()) {
              const fetchedContacts = snapshot.val();
              fetchedContacts.push(username);
              await set(ref(database, `contacts/${contact}`), fetchedContacts)
                .then(() => {
                  console.log(
                    "Contact saved successfully: ",
                    username,
                    contact
                  );
                })
                .catch((error) => {
                  console.log("Error while saving contact: ", error);
                });
            }
          }
        );
      }
    })
    .catch((error) => {
      console.log("Error while fetching contact: ", error);
    });

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

export const getMessagesOnUpdate = async (
  sender: string,
  receiver: string,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
  const conversationName = getConversationName(sender, receiver);

  onValue(ref(database, `chats/${conversationName}`), (sanpshot) => {
    setMessages(sanpshot.val());
  });
};
