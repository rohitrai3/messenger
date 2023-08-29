import {
  AcceptConnectionRequestInput,
  AddConnectionRequestInput,
  AddMessageInput,
  AddUserInput,
  FeedbackData,
  MessageData,
  UserData,
} from "../common/types";
import app from "./firebase";
import { child, get, getDatabase, ref, set } from "firebase/database";
import config from "./config.json";

const database = getDatabase(app);
const baseUrl = config.serviceEndpointUrl;
const headers = config.headers;

export const addUser = async (input: AddUserInput) => {
  await fetch(`${baseUrl}user/add-user`, {
    method: "POST",
    body: JSON.stringify(input),
    headers: headers,
  }).catch((error) => {
    console.log("error: ", error);
  });
};

export const addConnectionRequest = async (
  input: AddConnectionRequestInput
) => {
  await fetch(`${baseUrl}connection/add-connection-request`, {
    method: "POST",
    body: JSON.stringify(input),
    headers: headers,
  }).catch((error) => {
    console.log("error: ", error);
  });
};

export const addMessage = async (input: AddMessageInput) => {
  await fetch(`${baseUrl}chat/add-message`, {
    method: "POST",
    body: JSON.stringify(input),
    headers: headers,
  }).catch((error) => {
    console.log("error: ", error);
  });
};

export const acceptConnectionRequest = async (
  input: AcceptConnectionRequestInput
) => {
  await fetch(`${baseUrl}connection/accept-connection-request`, {
    method: "POST",
    body: JSON.stringify(input),
    headers: headers,
  }).catch((error) => {
    console.log("error: ", error);
  });
};

export const getUsername = async (uid: string) => {
  var username = "";

  await fetch(`${baseUrl}user/get-username/${uid}`, {
    method: "GET",
    headers: headers,
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      username = data.username;
    })
    .catch((error) => {
      console.log("error: ", error);
    });

  return username;
};

export const getUser = async (username: string) => {
  var userData: UserData = {
    username: username,
    name: "",
    photoUrl: "",
  };

  await fetch(`${baseUrl}user/get-user/${username}`, {
    method: "GET",
    headers: headers,
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      userData = data.userData;
    })
    .catch((error) => {
      console.log("error: ", error);
    });

  return userData;
};

export const getConnectionRequests = async (username: string) => {
  var requestIdToUserData: Map<string, UserData> = new Map();

  await fetch(`${baseUrl}connection/get-connection-requests/${username}`, {
    method: "GET",
    headers: headers,
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      requestIdToUserData = new Map(Object.entries(data.requestIdToUserData));
    })
    .catch((error) => {
      console.log("error: ", error);
    });

  return requestIdToUserData;
};

export const getConnections = async (username: string) => {
  var userDataList: UserData[] = [];

  await fetch(`${baseUrl}connection/get-connections/${username}`, {
    method: "GET",
    headers: headers,
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      userDataList = data.userDataList;
    })
    .catch((error) => {
      console.log("error: ", error);
    });

  return userDataList;
};

export const addFeedback = async (username: string, feedback: FeedbackData) => {
  await get(child(ref(database), `feedbacks/${username}`))
    .then(async (snapshot) => {
      if (snapshot.exists()) {
        const fetchedFeedbacks = snapshot.val();
        fetchedFeedbacks.push(feedback);

        await set(ref(database, `feedbacks/${username}`), fetchedFeedbacks)
          .then(() => {
            console.log("Feedback saved successfully: ", username, feedback);
          })
          .catch((error) => {
            console.log("Error while saving feedback: ", error);
          });
      } else {
        await set(ref(database, `feedbacks/${username}`), [feedback])
          .then(() => {
            console.log("Feedback saved successfully: ", username, feedback);
          })
          .catch((error) => {
            console.log("Error while saving feedback: ", error);
          });
      }
    })
    .catch((error) => {
      console.log("Error while fetching feedback: ", error);
    });
};

export const getMessages = async (sender: string, receiver: string) => {
  var messageDataList: MessageData[] = [];

  await fetch(
    `${baseUrl}chat/get-messages?sender=${sender}&receiver=${receiver}`,
    {
      method: "GET",
      headers: headers,
    }
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      messageDataList = data.messageDataList;
    })
    .catch((error) => {
      console.log("error: ", error);
    });

  return messageDataList;
};

export const getChatName = async (sender: string, receiver: string) => {
  var chatName = "";

  await fetch(
    `${baseUrl}chat/get-chat-name?sender=${sender}&receiver=${receiver}`,
    {
      method: "GET",
      headers: headers,
    }
  )
    .then((response) => response.json())
    .then((data) => {
      chatName = data.chatName;
    })
    .catch((error) => {
      console.log("error: ", error);
    });

  return chatName;
};

export const checkUidExist = async (uid: string) => {
  var isUidExist = false;

  await fetch(`${baseUrl}user/check-uid-exist/${uid}`, {
    method: "GET",
    headers: headers,
  })
    .then((response) => response.json())
    .then((data) => {
      isUidExist = data.isUidExist;
    })
    .catch((error) => {
      console.log("error: ", error);
    });

  return isUidExist;
};

export const checkUsernameExist = async (username: string) => {
  var isUsernameExist = false;

  await fetch(`${baseUrl}user/check-username-exist/${username}`, {
    method: "GET",
    headers: headers,
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      isUsernameExist = data.isUsernameExist;
    })
    .catch((error) => {
      console.log("error: ", error);
    });

  return isUsernameExist;
};
