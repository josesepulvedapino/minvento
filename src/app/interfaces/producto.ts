export interface Producto {
    id?: string;
    imagen: string;
    nombre: string;
    marca: string;
    cantidad: number;
    precio: number;
    fecha_vencimiento: { year: number; month: number; day: number };
}
