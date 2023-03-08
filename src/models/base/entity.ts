export abstract class Entity {
  id: string;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;

  constructor(id: string) {
    this.id = id;
    this.createdAt = new Date();
    this.deletedAt = null;
    this.updatedAt = null;
  }
}
