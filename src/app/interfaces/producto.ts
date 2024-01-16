export interface Producto {
    id?: number;
    imagen: string;
    nombre: string;
    marca: string;
    cantidad: number;
    precio: boolean;
    fecha_vencimiento: { year: string; month: string; day: string };
}
