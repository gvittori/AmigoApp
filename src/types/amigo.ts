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
  photoUrl: string;
  noseprintId: string; // Biometric code eg. NP-8892-MVD
  color: string;
  gender: 'Macho' | 'Hembra' | 'Desconocido';
}

export interface LostDogReport {
  id: string;
  dogId?: string; // If registered pet
  tempDogPhoto?: string; // If found unregistered pet
  reportType: ReportType;
  status: DogStatus;
  species: PetSpecies;
  lastKnownLocation: {
    lat: number;
    lng: number;
    neighborhood: string;
    addressText: string;
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
