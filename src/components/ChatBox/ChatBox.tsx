import React, { useEffect, useRef, useState } from "react";
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  limit,
  QuerySnapshot,
  DocumentData
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { Message } from "../Message/Message";
import { SendMessage } from "../SendMessage/SendMessage";
import { IMessage } from "../../types/IMessage";

export const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const scroll = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      orderBy("createdAt", "asc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot: QuerySnapshot<DocumentData>) => {
      const fetchedMessages: IMessage[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as IMessage;
        fetchedMessages.push({ ...data, id: doc.id });
      });
      const sortedMessages = fetchedMessages.sort((a: IMessage, b: IMessage) => {
        return (a.createdAt?.seconds ?? 0) - (b.createdAt?.seconds ?? 0);
      });
      setMessages(sortedMessages);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (scroll.current) {
      scroll.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]); 

  return (
    <section>
      <div className="container">
        <div className="mx-auto max-w-[600px] p-10 pb-100 overflow-auto h-[calc(100vh-_50px)] bg-light-grey">
          {messages?.map((message) => (
            <Message key={message.id} message={message} />
          ))}
          <span ref={scroll}></span>
        </div>
      </div>

      <SendMessage scroll={scroll} />
    </section>
  );
};
