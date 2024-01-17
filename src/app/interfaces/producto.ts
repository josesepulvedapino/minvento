export interface Producto {
    id?: number;
    imagen: string;
    nombre: string;
    marca: string;
    cantidad: number;
    precio: number;
    fecha_vencimiento: { year: string; month: string; day: string };
}
