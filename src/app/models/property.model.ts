export interface IProperty {
  _id?: string;  // Propiedad opcional _id para el ID de la experiencia
  owner: string; // ID del propietario (usuario)
  address: string; 
  description?: string; // Descripción de la experiencia
}
export interface IPropertyResponse {
  properties: IProperty[]; // Arreglo de propiedades
  totalPages: number;
  totalProperty: number;
}
  