import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PropertyService } from '../../services/property.service';
import { IProperty, IPropertyResponse } from '../../models/property.model';
import { UserService } from '../../services/user.service';
import { IUser, IUserResponse } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { NgxPaginationModule} from 'ngx-pagination';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';


@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  standalone: true,
  styleUrls: ['./property.component.css'],
  imports: [FormsModule, CommonModule, HttpClientModule, TruncatePipe, NgxPaginationModule]
})
export class PropertyComponent implements OnInit {
  properties: IProperty[] = []; // Lista de properties
  users: IUser[] = []; // Lista de usuarios para los desplegables
  selectedParticipants: string[] = []; // Participantes seleccionados como ObjectId
  errorMessage: string = ''; // Variable para mostrar mensajes de error
  activityId: string[] = [];
  @Input() totalUsers:any;
  @Input() totalProperty:any;
@Input()currentPage:any;
@Input()limit:any=10;
@Input()total:any;
  @Output()
  pageChange!: EventEmitter<number>;
totalPages:any;
desplegado: boolean[] = [];



  // Estructura inicial para una nueva property
  newProperty: IProperty = {
    owner: '',
    address: '',
    description: '',
  };

  propertyEdicion: IProperty | null = null; // Usuario en proceso de edición
  indiceEdicion: number | null = null; // Almacena el índice del usuario en edición
  formSubmitted: boolean = false; // Indica si se ha enviado el formulario

  count:number=0;
  page: number=1 ;
  limitUsers = [2,3, 6, 9];

  constructor(private propertyService: PropertyService, private userService: UserService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getProperties(); // Obtener la lista de properties
    this.getUsers(); // Obtener la lista de usuarios

  }

  // Obtener la lista de properties desde la API
  getProperties(): void {
    this.propertyService.getProperty(this.page, this.limit).subscribe(
      (data: IPropertyResponse) => {
        this.properties = data.properties;          // Lista de usuarios
        this.totalProperty = data.totalProperty; // Total de usuarios
        this.totalPages = data.totalPages;
        console.log('propiedaes del usuario recibidos:', data);
      },
      (error) => {
        console.error('Error al obtener las properties:', error);
      }
    );
  }

  // Obtener la lista de usuarios desde la API
  getUsers(): void {
    this.userService.getUsers(this.page, this.limit).subscribe(
      (data: IUserResponse) => {
        this.users = data.users;          // Lista de usuarios
        this.totalUsers = data.totalUsers; // Total de usuarios
        this.totalPages = data.totalPages;
        console.log('Usuarios recibidos:', data);
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
  onSubmit(propertyForm: NgForm): void {
    this.errorMessage = ''; // Limpiar mensajes de error

    // Verificar si los campos están vacíos
    if (!this.newProperty.owner || !this.newProperty.address || !this.newProperty.description) {
      this.errorMessage = 'Todos los campos son obligatorios.';
      return;
    }
    if (this.indiceEdicion !== null) {
      this.properties[this.indiceEdicion] = { ...this.newProperty, _id: this.properties[this.indiceEdicion]._id };
  
      // Actualizar el usuario en la API
      this.propertyService.updateProperty(this.properties[this.indiceEdicion]).subscribe(response => {
        console.log('Usuario actualizado:', response);
      
      })
      // Limpiar el estado de edición
      this.indiceEdicion = null;
    }else{

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

    this.resetForm();
  }

  prepararEdicion(property: IProperty, index: number): void{
    this.propertyEdicion = { ...property }; // Clonar el usuario para la edición
    this.newProperty = { ...property }; // Cargar los datos del usuario en el formulario
    this.indiceEdicion = index; // Almacenar el índice del usuario en edición
    this.desplegado[index] = true; // Abrir el desplegable del usuario que se está editando
  }

  // Método para eliminar una property por su ID
  deleteProperty(propertyId: string): void {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '350px',
      data: { mensaje: `¿Estás seguro de que deseas eliminar la propiedad?` }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) { 
        this.propertyService.deleteProperty(propertyId).subscribe(
          () => {
           console.log(`Property con ID ${propertyId} eliminada`);
            this.getProperties(); 
         },
         (error) => {
            console.error('Error al eliminar la property:', error);
         }
       );
     }
   });
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
