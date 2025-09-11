import { generateUUID } from './uuid';
import { asyncStorage } from './localStoragePolyfill';

// Storage keys
const USERS_KEY = '__USERS__';
const CURRENT_USER_KEY = '__CURRENT_USER__';
const SALIDAS_KEY = '__SALIDAS__';

// Estados constants
export const ESTADOS = {
  SOLICITUD: 'Solicitud',
  ACEPTADO: 'Aceptado', 
  RECHAZADO: 'Rechazado'
};

// Seed users data
const SEED_USERS = [
  { 
    id: 'u1', 
    rol: 'residente', 
    nombre: 'Alan', 
    apellido: 'Ibañez' 
  },
  { 
    id: 'u2', 
    rol: 'tutor', 
    nombre: 'Ivo', 
    apellido: 'Alabe', 
    hijoId: 'u1' 
  }
];

// Initialize data - set up users if not exists
export async function initData() {
  try {
    const existingUsers = await asyncStorage.getItem(USERS_KEY);
    if (!existingUsers) {
      await asyncStorage.setItem(USERS_KEY, JSON.stringify(SEED_USERS));
    }

    const existingSalidas = await asyncStorage.getItem(SALIDAS_KEY);
    if (!existingSalidas) {
      await asyncStorage.setItem(SALIDAS_KEY, JSON.stringify([]));
    }
  } catch (error) {
    console.error('Failed to initialize data:', error);
  }
}

// Current user management
export async function getCurrentUser() {
  try {
    const userJson = await asyncStorage.getItem(CURRENT_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
}

export async function setCurrentUser(user) {
  try {
    await asyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Failed to set current user:', error);
  }
}

// Users management
export async function listUsers() {
  try {
    const usersJson = await asyncStorage.getItem(USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (error) {
    console.error('Failed to list users:', error);
    return [];
  }
}

// Salidas management
export async function listSalidas(userId = null) {
  try {
    const salidasJson = await asyncStorage.getItem(SALIDAS_KEY);
    const allSalidas = salidasJson ? JSON.parse(salidasJson) : [];
    
    if (!userId) return allSalidas;
    
    // Filter by user or by child for tutor
    const currentUser = await getCurrentUser();
    if (currentUser?.rol === 'tutor' && currentUser?.hijoId) {
      return allSalidas.filter(salida => salida.userId === currentUser.hijoId);
    }
    
    return allSalidas.filter(salida => salida.userId === userId);
  } catch (error) {
    console.error('Failed to list salidas:', error);
    return [];
  }
}

export async function createSalida(salidaData) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error('No current user found');

    const newSalida = {
      id: generateUUID(),
      userId: currentUser.id,
      estado: ESTADOS.SOLICITUD,
      createdAt: new Date().toISOString(),
      ...salidaData
    };

    const salidasJson = await asyncStorage.getItem(SALIDAS_KEY);
    const salidas = salidasJson ? JSON.parse(salidasJson) : [];
    salidas.push(newSalida);
    
    await asyncStorage.setItem(SALIDAS_KEY, JSON.stringify(salidas));
    return newSalida;
  } catch (error) {
    console.error('Failed to create salida:', error);
    throw error;
  }
}

export async function updateSalida(id, updates) {
  try {
    const salidasJson = await asyncStorage.getItem(SALIDAS_KEY);
    const salidas = salidasJson ? JSON.parse(salidasJson) : [];
    
    const index = salidas.findIndex(salida => salida.id === id);
    if (index === -1) throw new Error('Salida not found');
    
    salidas[index] = { ...salidas[index], ...updates };
    await asyncStorage.setItem(SALIDAS_KEY, JSON.stringify(salidas));
    
    return salidas[index];
  } catch (error) {
    console.error('Failed to update salida:', error);
    throw error;
  }
}

export async function getSalida(id) {
  try {
    const salidasJson = await asyncStorage.getItem(SALIDAS_KEY);
    const salidas = salidasJson ? JSON.parse(salidasJson) : [];
    return salidas.find(salida => salida.id === id) || null;
  } catch (error) {
    console.error('Failed to get salida:', error);
    return null;
  }
}