﻿import { KahlaUser } from './KahlaUser';

export class Message {
    public id: number;
    public conversationId: number;
    public senderId: string;
    public sender: KahlaUser;
    public sendTime: Date;
    public content: string;
    public isEmoji = false;
    public read: boolean;
    public local = false;
    public avatarURL: string;
    public timeStamp: number;
}
