import React, { useState, FormEvent, MutableRefObject } from "react";
import { auth, db } from "../../firebase/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

interface SendMessageProps {
  scroll: MutableRefObject<HTMLSpanElement | null>;
}

export const SendMessage: React.FC<SendMessageProps> = ({ scroll }) => {
  const [message, setMessage] = useState<string>('');

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!message.trim().length) {
      alert('Enter a valid message');
      return;
    }

    const { uid, displayName, photoURL } = auth.currentUser!;

    await addDoc(collection(db, 'messages'), {
      text: message,
      name: displayName,
      avatar: photoURL,
      createdAt: serverTimestamp(),
      uid,
    })
    .then(() => {
      setMessage('');
      scroll.current?.scrollIntoView({ behavior: 'smooth' });
    })
    .catch(error => {
      throw new Error('Error writing document: ', error);
    });
  };

  return (
    <form 
      onSubmit={sendMessage} 
      className="fixed left-0 right-0 bottom-0 mx-auto max-w-[600px] flex p-20 bg-grey"
    >
      <label htmlFor="messageInput" hidden>
        Enter Message
      </label>
      <input
        id="messageInput"
        name="messageInput"
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit" className="button">Send</button>
    </form>
  );
}
