export type ReportType = 'MY_DOG' | 'FOUND_DOG';

export type DogStatus = 'LOST' | 'FOUND' | 'RESOLVED';

export type PetSpecies = 'PERRO' | 'GATO';

export interface UserProfile {
  id: string;
  username: string;
  phone: string;
  score: number; // rescue stars / points
  avatarUrl: string;
  neighborhood: string;
}

export interface DogProfile {
  id: string;
  ownerId: string;
  name: string;
  species: PetSpecies;
  breed: string;
  age: string;
  takesMedication: boolean;
  isAggressive: boolean;
  photoUrl: string; // Full body photo
  facePhotoUrl?: string; // Face only photo
  noseprintId: string; // Biometric code eg. NP-8892-MVD
  color: string;
  gender: 'Macho' | 'Hembra' | 'Desconocido';
}

export interface LostDogReport {
  id: string;
  dogId?: string; // If registered pet
  tempDogPhoto?: string; // If found unregistered pet
  tempFacePhoto?: string; // Face only photo if found
  photoUrl?: string; // Full body photo
  facePhotoUrl?: string; // Face only photo
  fullBodyPhotoUrl?: string; // Full body photo
  reportType: ReportType;
  status: DogStatus;
  species: PetSpecies;
  lastKnownLocation: {
    lat: number;
    lng: number;
    neighborhood: string;
    addressText: string;
    crossStreets?: string; // e.g. "entre calle A y calle B"
  };
  radiusKm: number;
  createdAt: string;
  updatedBy: string; // username
  description: string;
  contactPhone: string;
  rewardAmount?: number; // Optional reward in UYU
  dogName?: string;
  breed?: string;
  takesMedication?: boolean;
  isAggressive?: boolean;
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const formatReportDate = (isoDate: string): string => {
  try {
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return isoDate;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  } catch {
    return isoDate;
  }
};

export const formatReportDateTime = (isoDate: string): string => {
  try {
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return isoDate;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear()).slice(-2);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch {
    return isoDate;
  }
};

