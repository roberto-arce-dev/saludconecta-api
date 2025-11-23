export class HistorialClinico {
  id: number;
  nombre: string;
  descripcion?: string;
  imagen?: string;
  imagenThumbnail?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<HistorialClinico>) {
    Object.assign(this, partial);
  }
}
