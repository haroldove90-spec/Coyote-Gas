export type Role = 'admin' | 'vendedor';

export interface Vendedor {
  id: string;
  nombre: string;
  usuario?: string;
  contrasena?: string;
  telefono: string;
  fechaRegistro: string;
  activo: boolean;
  fotoPerfil?: string;
}

export interface Venta {
  id: string;
  vendedorId: string;
  vendedorNombre: string;
  litros: number;
  total: number;
  precioPorLitro: number;
  fecha: string; // ISO string
  clienteNombre: string;
  clienteWhats: string;
}

export interface CorteCaja {
  id: string;
  vendedorId: string;
  vendedorNombre: string;
  fecha: string;
  ventasCount: number;
  litrosVendidos: number;
  totalVendido: number;
  retirado: boolean;
}
