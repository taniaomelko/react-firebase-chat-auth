import React from "react";
import { auth } from "../../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { User } from "firebase/auth";
import { IMessage } from "../../types/IMessage";
import { ProfileIcon } from "../icons";
import { Timestamp } from "firebase/firestore";

interface MessageProps {
  message: IMessage;
}

export const Message: React.FC<MessageProps> = ({ message }) => {  
  const [user] = useAuthState(auth) as [User | null, boolean, Error | undefined];

  const formatDate = (timestamp?: Timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleTimeString([], { 
      hour: '2-digit', minute: '2-digit', hour12: true 
    });
  };

  return (
    <div 
      className={`mb-10 p-8 w-fit max-w-[calc(100%_-_50px)] flex gap-8 bg-white rounded-small shadow-small 
        ${message.uid === user?.uid ? "ml-auto" : ""}`
      }>
        {message.avatar ? (
          <img
            className="shrink-0 w-30 h-30 rounded-full object-cover"
            src={message.avatar}
            alt=""
          />
        ) : (
          <ProfileIcon className="shrink-0 w-30 h-30" />
        )}
      <div className="chat-bubble__right">
        <div className="text-16 leading-12 font-bold">
          {message.name || 'Anonymous'}
        </div>
        <div>
          {message.text}
        </div>
        <div className="text-12 text-grey text-right">
          {formatDate(message.createdAt)} 
        </div>
      </div>
    </div>
  );
};
