import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProperty } from '../models/property.model';
import { IUser } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private apiUrl = 'http://localhost:3001/property'; 

  constructor(private http: HttpClient) {}

  // Obtener la lista
  getProperty(): Observable<IProperty[]> {
    return this.http.get<IProperty[]>(this.apiUrl);
  }

  // Agregar una nueva al backend
  addProperty(activityId: string[]): Observable<IProperty> {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = user._id;
    return this.http.post<IProperty>(`${this.apiUrl}/${userId}`, activityId);
  }

  // Actualizar un usuario existente
  updateProperty(property: IProperty): Observable<IProperty> {
    return this.http.put<IProperty>(`${this.apiUrl}/${property._id}`, property);
  }

  // Eliminar una por su ID
  deleteProperty(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
