import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IMessage } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private API_URL = 'http://localhost:3001/message'; 

  constructor(private http: HttpClient) {}

  sendMessage(message: IMessage): Observable<IMessage> {
    return this.http.post<IMessage>(`${this.API_URL}/send`, message);
  }

  getMessagesBetweenUsers(senderId: string, receiverId: string): Observable<IMessage[]> {
    return this.http.get<IMessage[]>(`${this.API_URL}/${senderId}/${receiverId}`);
  }

  respondToMessage(messageId: string, response: string): Observable<IMessage> {
    return this.http.post<IMessage>(`${this.API_URL}/respond/${messageId}`, { response });
  }

  markMessageAsRead(messageId: string): Observable<IMessage> {
    return this.http.put<IMessage>(`${this.API_URL}/read/${messageId}`, {});
  }

  getUnreadMessages(userId: string): Observable<IMessage[]> {
    return this.http.get<IMessage[]>(`${this.API_URL}/unread/${userId}`);
  }

  updateMessage(id: string, message: IMessage): Observable<IMessage> {
    return this.http.put<IMessage>(`${this.API_URL}/${id}`, message);
  }

  deleteMessage(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  updateMessageReadStatus(messageId: string, read: boolean): Observable<IMessage> {
    return this.http.put<IMessage>(`${this.API_URL}/read/${messageId}`, { read }); 
  }
}
