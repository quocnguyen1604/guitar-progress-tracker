export type Song = {
  id: string;
  title: string;
  artist?: string;
  thumbnailUrl?: string;
  thumbnailPath?: string;
  songLink?: string;
  tabLink?: string;
  localTabPath?: string;
  targetBpm: number;
  currentPracticeBpm: number;
  progress: number;
  notes?: string;
  createdAt: number;
  updatedAt: number;
};

export type AddSongInput = {
  title: string;
  artist?: string;
  thumbnailUrl?: string;
  thumbnailPath?: string;
  songLink?: string;
  tabLink?: string;
  localTabPath?: string;
  targetBpm: number;
  currentPracticeBpm: number;
  progress: number;
  notes?: string;
};

export type UpdateSongInput = Partial<AddSongInput>;
