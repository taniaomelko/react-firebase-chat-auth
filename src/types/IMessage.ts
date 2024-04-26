import { Timestamp } from 'firebase/firestore';

export interface IMessage {
  id: string;
  uid: string;
  avatar?: string;
  createdAt?: Timestamp;
  name: string | null;
  text: string;
}
