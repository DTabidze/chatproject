"use client";
import { useRef, useContext, useState, useEffect } from "react";
import { UserContext } from "../UserContext";
import { useRouter } from "next/navigation";
import ContactList from "./Contactlist";
import ChatPanel from "./ChatPanel";
import io from "socket.io-client";

function MainPanel() {
  const { loggedInUser, setLoggedInUser } = useContext(UserContext);
  const [myContacts, setMyContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  function handleSelectedContact(contact) {
    setSelectedContact(contact);
    console.log("SELECTED CONTACT: ", selectedContact);
  }
  useEffect(() => {
    if (
      loggedInUser &&
      (loggedInUser.contacts_received || loggedInUser.contacts_sent)
    ) {
      let combinedContacts = [];
      for (let i = 0; i < loggedInUser.contacts_received.length; i++) {
        combinedContacts.push(loggedInUser.contacts_received[i].user_first_obj);
      }

      for (let i = 0; i < loggedInUser.contacts_sent.length; i++) {
        combinedContacts.push(loggedInUser.contacts_sent[i].user_second_obj);
      }
      setMyContacts(combinedContacts);
    }
  }, [loggedInUser]);

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-gray-200">
        <ContactList
          loggedInUser={loggedInUser}
          myContacts={myContacts}
          handleSelectedContact={handleSelectedContact}
        />
      </div>
      {selectedContact !== null && ( // Check if selectedContact is not null
        <div className="flex-1 bg-gray-100">
          <ChatPanel
            loggedInUser={loggedInUser}
            selectedContact={selectedContact}
          />
        </div>
      )}
    </div>
  );
}

export default MainPanel;
