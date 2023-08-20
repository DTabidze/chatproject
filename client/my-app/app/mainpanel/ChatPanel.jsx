"use client";
import { useState } from "react";
import io from "socket.io-client";
import { useRef, useEffect } from "react";

function ChatPanel({ selectedContact, loggedInUser }) {
  const socket = io("http://192.168.1.162:8080");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  // const [username, setUsername] = useState("");
  // const [recipient, setRecipient] = useState("");
  const inputRef = useRef(null);

  const handleLogin = () => {
    // Emit the login event to the server
    const username = loggedInUser.username;
    console.log("USER LOGGED IN: ", username);
    socket.emit("login", { username });
  };

  useEffect(() => {
    socket.removeAllListeners();
    socket.on("message", (message) => {
      try {
        const parsedMessage = JSON.parse(message);
        console.log(
          `SENDER: ${parsedMessage.sender}`,
          `USER: ${loggedInUser.username}`
        );

        // Only add the received message to state if the sender is not the same as the logged-in user
        if (parsedMessage.sender !== loggedInUser.username) {
          setMessages((prevMessages) => [...prevMessages, parsedMessage]);
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    });
    socket.on("connect", handleLogin);
  }, [loggedInUser.username]);

  const sendMessage = () => {
    if (newMessage.trim() === "" || selectedContact.username.trim() === "")
      return;

    const messageObject = {
      text: newMessage,
      recipient: selectedContact.username, //Add Reciver information
      sender: loggedInUser.username, // Add sender information
    };

    socket.emit("message", JSON.stringify(messageObject)); // Send the message as a JSON string
    // console.log(messages);
    setMessages((prevMessages) => [...prevMessages, messageObject]); // Append the message as an object
    setNewMessage(""); // Clear the new message input
  };

  const sendImage = () => {
    const input = inputRef.current;
    if (input && input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        const imageBase64 = event.target.result;
        const messageObject = {
          image: imageBase64,
          timestamp: new Date().getTime(),
          isMe: true,
          recipient: selectedContact.username,
        };
        socket.send(JSON.stringify(messageObject));
        setMessages((prevMessages) => [...prevMessages, messageObject]);
        // console.log(messages);
      };

      reader.readAsDataURL(file);
      setNewMessage("");
    }
  };
  return (
    <div className="App">
      <div>
        <h2 className="text-lg font-semibold mb-4">
          {selectedContact.fname + " " + selectedContact.lname}
        </h2>
        <div className="flex flex-col h-96 overflow-y-auto mb-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`Message ${
                message.sender === loggedInUser.username ? "Me" : "Other"
              }`}
            >
              {message.text && <p>{message.text}</p>}
              {message.image && (
                <img
                  src={message.image}
                  alt={`${message.sender} image`}
                  style={{ maxWidth: "100%", maxHeight: "300px" }}
                />
              )}
              <span>{message.sender}</span>
            </div>
          ))}
        </div>
        <div className="InputContainer">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <input
            type="file"
            accept="image/*"
            ref={inputRef}
            style={{ display: "none" }}
            onChange={sendImage}
          />
          <button onClick={() => inputRef.current.click()}>Choose Image</button>

          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default ChatPanel;

{
  /* <div className="p-4">
{selectedContact ? (
  <div>
    <h2 className="text-lg font-semibold mb-4">{selectedContact.name}</h2>
    <div className="flex flex-col h-96 overflow-y-auto mb-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`p-2 rounded ${
            message.isMe
              ? "bg-blue-300 self-end"
              : "bg-gray-300 self-start"
          }`}
        >
          {message.text}
        </div>
      ))}
    </div>
    <form className="flex items-center" onSubmit={handleSendMessage}>
      <input
        type="text"
        className="flex-1 p-2 border rounded"
        placeholder="Type a message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded ml-2"
      >
        Send
      </button>
    </form>
  </div>
) : (
  <p>Select a contact to start chatting.</p>
)}
</div> */
}
