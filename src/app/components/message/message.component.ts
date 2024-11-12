import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { IMessage } from '../../models/message.model';
import { UserService } from '../../services/user.service';
import { IUser } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  standalone: true,
  styleUrls: ['./message.component.css'],
  imports: [FormsModule, CommonModule, HttpClientModule, TruncatePipe, NgxPaginationModule]
})
export class MessageComponent implements OnInit {
  messages: IMessage[] = []; // Lista de mensajes
  users: IUser[] = []; // Lista de usuarios para los desplegables
  selectedParticipants: string[] = []; // Participantes seleccionados como ObjectId
  errorMessage: string = ''; // Variable para mostrar mensajes de error
  messageId: string[] = [];
  @Input() totalUsers: any;
  @Input() totalMessages: any;
  @Input() currentPage: any;
  @Input() limit: any = 2;
  @Input() total: any;
  @Input() totally: any = 0;
  @Output()
  pageChange!: EventEmitter<number>;
  totalPages: any;
  totalPagesUser: any;
  desplegado: boolean[] = [];
  message: any;

  // IDs válidos para sender y receiver (asegúrate de reemplazarlos con valores correctos)
  senderId = '67336736ad6e5284c9ec7b6f'; // Reemplaza con un ID válido
  receiverId = '6733a1eb1ccf585e7d0a7360'; // Reemplaza con un ID válido

  // Estructura inicial para un nuevo mensaje
  newMessage: IMessage = {
    sender: this.senderId,
    receiver: this.receiverId,
    body_message: '',
    read: false
  };

  formSubmitted: boolean = false; // Indica si se ha enviado el formulario

  count: number = 0;
  page: number = 1;
  pageUser: number = 1;
  limitMessages = [2, 3, 6];
  user: any;

  constructor(private messageService: MessageService, private userService: UserService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getMessages(); // Obtener la lista de mensajes
    this.getUsers(); // Obtener la lista de usuarios
  }

  // Obtener la lista de mensajes desde la API
  getMessages(): void {
    this.messageService.getMessagesBetweenUsers(this.senderId, this.receiverId).subscribe(
      messages => {
        this.message = messages; // Asignar los mensajes
        this.total = this.message.totalActivity; // Asignar el total de mensajes
        this.totalPages = this.message.totalPages;
        this.messages = this.message.messages;
        console.log('Mensajes recibidos:', this.message);
      },
      error => {
        console.error('Error al cargar los mensajes:', error); // Manejar errores de la API
      }
    );
  }

  // Obtener la lista de usuarios desde la API
  getUsers(): void {
    this.userService.getUsers(this.pageUser, this.totally).subscribe(users => {
      this.user = users; // Asignar los usuarios recibidos
      this.totalPages = this.user.totalPages;
      this.users = this.user.users;
      this.desplegado = new Array(this.users.length).fill(false); // Inicializar desplegado
      console.log('Usuarios recibidos:', this.users);
    });
  }

  handlePageChange(event: number): void {
    this.page = event;
    this.ngOnInit();
  }

  handleLimitChange(event: any): void {
    this.limit = event.target.value;
    this.page = 1;
    this.ngOnInit();
  }

  // Obtener el nombre de un usuario dado su ObjectId
  getUserNameById(userId: string): string {
    const user = this.users.find((u) => u._id === userId);
    return user ? user.name : 'Desconocido';
  }

  // Manejar el envío del formulario con validación de campos
  onSubmit(messageForm: NgForm): void {
    this.errorMessage = ''; // Limpiar mensajes de error

    // Verificar si los campos están vacíos
    if (!this.newMessage.sender || !this.newMessage.receiver || !this.newMessage.body_message) {
      this.errorMessage = 'Todos los campos son obligatorios.';
      return;
    }

    // Llamar al servicio para agregar el nuevo mensaje
    this.messageService.sendMessage(this.newMessage).subscribe(
      (response) => {
        console.log('Mensaje creado:', response);
        this.getMessages(); // Actualizar la lista de mensajes después de crear uno nuevo
        this.resetForm(); // Limpiar el formulario
      },
      (error) => {
        console.error('Error al crear el mensaje:', error);
      }
    );

    this.resetForm();
  }

  // Método para marcar un mensaje como leído
  markAsRead(messageId: string): void {
    this.messageService.markMessageAsRead(messageId).subscribe(response => {
      console.log('Mensaje marcado como leído:', response);
      this.getMessages(); // Actualizar la lista de mensajes después de marcar como leído
    });
  }

  // Método para marcar un mensaje como no leído
  markAsUnread(messageId: string): void {
    this.messageService.updateMessageReadStatus(messageId, false).subscribe(response => {
      console.log('Mensaje marcado como no leído:', response);
      this.getMessages(); // Actualizar la lista de mensajes después de marcar como no leído
    });
  }

  // Resetear el formulario después de crear un mensaje
  resetForm(): void {
    this.newMessage = {
      sender: this.senderId,
      receiver: this.receiverId,
      body_message: '',
      read: false
    };
    this.errorMessage = ''; // Limpiar el mensaje de error
  }
}





