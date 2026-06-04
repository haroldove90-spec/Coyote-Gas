import { Vendedor, Venta, CorteCaja } from './types';

// Pre-seeded salespersons
const DEFAULT_VENDEDORES: Vendedor[] = [
  { id: 'v-1', nombre: 'Carlos Mendoza (Unidad 04)', telefono: '5512345678', fechaRegistro: '2026-05-15', activo: true },
  { id: 'v-2', nombre: 'Juan Ortiz (Unidad 12)', telefono: '5576543210', fechaRegistro: '2026-05-20', activo: true },
  { id: 'v-3', nombre: 'Sofia Álvarez (Unidad 07)', telefono: '5523456789', fechaRegistro: '2026-06-01', activo: true },
];

// Pre-seeded historic sales
const DEFAULT_VENTAS: Venta[] = [
  {
    id: 'T-1001',
    vendedorId: 'v-1',
    vendedorNombre: 'Carlos Mendoza (Unidad 04)',
    litros: 45,
    precioPorLitro: 11.15,
    total: 501.75,
    fecha: new Date(Date.now() - 4 * 3600000).toISOString(), // 4 hours ago
    clienteNombre: 'Familia Ramírez',
    clienteWhats: '5544332211',
  },
  {
    id: 'T-1002',
    vendedorId: 'v-2',
    vendedorNombre: 'Juan Ortiz (Unidad 12)',
    litros: 120,
    precioPorLitro: 11.15,
    total: 1338.00,
    fecha: new Date(Date.now() - 3 * 3600000).toISOString(),
    clienteNombre: 'Restaurante El Coyote',
    clienteWhats: '5599887766',
  },
  {
    id: 'T-1003',
    vendedorId: 'v-1',
    vendedorNombre: 'Carlos Mendoza (Unidad 04)',
    litros: 20,
    precioPorLitro: 11.15,
    total: 223.00,
    fecha: new Date(Date.now() - 1 * 3600000).toISOString(),
    clienteNombre: 'Doña Martha',
    clienteWhats: '',
  },
];

const DEFAULT_CORTES: CorteCaja[] = [
  {
    id: 'C-001',
    vendedorId: 'v-3',
    vendedorNombre: 'Sofia Álvarez (Unidad 07)',
    fecha: new Date(Date.now() - 24 * 3600000).toISOString().split('T')[0],
    ventasCount: 4,
    litrosVendidos: 220,
    totalVendido: 2453.00,
    retirado: true,
  }
];

export interface AdminProfile {
  nombre: string;
  usuario: string;
  contrasena: string;
  telefono: string;
  fotoPerfil?: string;
}

export interface AppState {
  precioPorLitro: number;
  vendedores: Vendedor[];
  ventas: Venta[];
  cortes: CorteCaja[];
  activeVendedorId: string;
  adminProfile?: AdminProfile;
}

const STORAGE_KEY = 'coyo_gas_app_state_v1';

export function getInitialState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure we have properties
      if (typeof parsed.precioPorLitro === 'number' && Array.isArray(parsed.vendedores)) {
        if (!parsed.adminProfile) {
          parsed.adminProfile = {
            nombre: 'Jesús Martínez',
            usuario: 'admin_coyote',
            contrasena: 'coyote2026',
            telefono: '5512345678',
            fotoPerfil: '',
          };
        }
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load storage state', e);
  }

  // Pre-seed default state
  const state: AppState = {
    precioPorLitro: 11.15,
    vendedores: DEFAULT_VENDEDORES,
    ventas: DEFAULT_VENTAS,
    cortes: DEFAULT_CORTES,
    activeVendedorId: 'v-1',
    adminProfile: {
      nombre: 'Jesús Martínez',
      usuario: 'admin_coyote',
      contrasena: 'coyote2026',
      telefono: '5512345678',
      fotoPerfil: '',
    }
  };
  saveState(state);
  return state;
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state to localStorage', e);
  }
}
