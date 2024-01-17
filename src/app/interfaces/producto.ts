export interface Producto {
    id?: number;
    imagen: string;
    nombre: string;
    marca: string;
    cantidad: string;
    precio: string;
    fecha_vencimiento: { year: string; month: string; day: string };
}
