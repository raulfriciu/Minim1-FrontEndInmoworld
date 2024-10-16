import { Component, OnInit } from '@angular/core';
import { PropertyService } from '../../services/property.service';
import { IProperty } from '../../models/property.model';
import { UserService } from '../../services/user.service';
import { IUser, IUsersResponse } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TruncatePipe } from '../../pipes/truncate.pipe';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  standalone: true,
  styleUrls: ['./property.component.css'],
  imports: [FormsModule, CommonModule, HttpClientModule, TruncatePipe]
})
export class PropertyComponent implements OnInit {
  properties: IProperty[] = []; // Lista de properties
  users: IUser[] = []; // Lista de usuarios para los desplegables
  selectedParticipants: string[] = []; // Participantes seleccionados como ObjectId
  errorMessage: string = ''; // Variable para mostrar mensajes de error
  activityId: string[] = [];

  // Estructura inicial para una nueva property
  newProperty: IProperty = {
    owner: '',
    address: '',
    description: '',
  };

  constructor(private propertyService: PropertyService, private userService: UserService) {}

  ngOnInit(): void {
    this.getProperties(); // Obtener la lista de properties
    this.getUsers(); // Obtener la lista de usuarios

  }

  // Obtener la lista de properties desde la API
  getProperties(): void {
    this.propertyService.getProperty().subscribe(
      (data: IProperty[]) => {
        // Filtrar properties que tengan _id definido
        this.properties = data.filter(exp => exp._id !== undefined);
        console.log('Properties recibidas:', data);
      },
      (error) => {
        console.error('Error al obtener las properties:', error);
      }
    );
  }

  // Obtener la lista de usuarios desde la API
  getUsers(): void {
    this.userService.getUsers().subscribe(
      (data: IUsersResponse) => { // Asegúrate de usar la nueva interfaz
        this.users = data.users; // Accede a data.users
        console.log('Usuarios recibidos:', this.users);
      },
      (error) => {
        console.error('Error al obtener los usuarios:', error);
      }
    );
  }


  // Obtener el nombre de un usuario dado su ObjectId
  getUserNameById(userId: string): string {
    const user = this.users.find((u) => u._id === userId);
    return user ? user.name : 'Desconocido';
  }

  // Manejar el envío del formulario con validación de campos
  onSubmit(): void {
    this.errorMessage = ''; // Limpiar mensajes de error

    // Verificar si los campos están vacíos
    if (!this.newProperty.owner || !this.newProperty.address || !this.newProperty.description) {
      this.errorMessage = 'Todos los campos son obligatorios.';
      return;
    }

    // Llamar al servicio para agregar la nueva property
    this.propertyService.addProperty(this.newProperty).subscribe(
      (response) => {
        console.log('Property creada:', response);
        this.getProperties(); // Actualizar la lista de properties después de crear una nueva
        this.resetForm(); // Limpiar el formulario
      },
      (error) => {
        console.error('Error al crear la property:', error);
      }
    );
  }

  // Método para eliminar una property por su ID
  deleteProperty(propertyId: string): void {
    this.propertyService.deleteProperty(propertyId).subscribe(
      () => {
        console.log(`Property con ID ${propertyId} eliminada`);
        this.getProperties(); // Actualizar la lista de properties después de la eliminación
      },
      (error) => {
        console.error('Error al eliminar la property:', error);
      }
    );
  }

  // Resetear el formulario después de crear una property
  resetForm(): void {
    this.newProperty = {
      owner: '',
      address: '',
      description: '',
    };
    this.errorMessage = ''; // Limpiar el mensaje de error
  }
}
