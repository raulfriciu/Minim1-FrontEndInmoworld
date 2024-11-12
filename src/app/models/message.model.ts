export interface IMessage {
  _id?: string;       // ID del mensaje (opcional, ya que lo asignará la base de datos)
  sender: string;   // ID del remitente del mensaje
  receiver: string; // ID del destinatario del mensaje
  body_message: string; // Contenido del mensaje
  createdAt?: string; // Marca de tiempo del mensaje (opcional)
  parentMessage?: string; // ID del mensaje padre (opcional)
  read: boolean;      // Estado de lectura del mensaje
}
