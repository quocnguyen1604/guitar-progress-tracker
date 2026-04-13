import { rmSync } from "node:fs";
import path from "node:path";
import { describe, it, expect, afterAll, beforeAll } from "vitest";
import { createSong, getAllSongs, updateSong, deleteSong } from "./song.js";
import { initializeDatabase, resetDatabaseForTests } from "./db.js";
import { get } from "node:http";

const TEST_DB_ROOT = path.join(process.cwd(), ".test-data");

describe("Song Service", () => {
  beforeAll(() => {
    resetDatabaseForTests();
    rmSync(TEST_DB_ROOT, { recursive: true, force: true });
    initializeDatabase(TEST_DB_ROOT);
  });

  afterAll(() => {
    resetDatabaseForTests();
    rmSync(TEST_DB_ROOT, { recursive: true, force: true });
  });

  it("should create a song", () => {
    const [ok] = createSong({
      title: "Awakening",
      artist: "Ichika Nito",
      targetBpm: 180,
      currentPracticeBpm: 100,
      progress: 0,
    });
    expect(ok).toBe(true);
    expect(getAllSongs()).toHaveLength(1);
  });

  it("should not create a song with invalid input", () => {
    const [ok] = createSong({
      title: "",
      targetBpm: -120,
      currentPracticeBpm: 0,
      progress: 150,
    } as any);
    expect(ok).toBe(false);
    expect(getAllSongs()).toHaveLength(1);
  });

  it("should update a song", () => {
    const songId = getAllSongs()[0].id;
    const result = updateSong(songId, {
      title: "Awakening (Updated)",
      artist: "Ichika Nito (Updated)",
      targetBpm: 190,
      currentPracticeBpm: 110,
      progress: 50,
    });
    expect(result).toBe(true);
    expect(getAllSongs()).toHaveLength(1);
    expect(getAllSongs()[0].title).toBe("Awakening (Updated)");
  });

  it("should not update a song with invalid input", () => {
    const songId = getAllSongs()[0].id;
    const result = updateSong(songId, {
      title: "",
      targetBpm: -190,
      currentPracticeBpm: -110,
      progress: 150,
    } as any);
    expect(result).toBe(false);
    expect(getAllSongs()).toHaveLength(1);
    expect(getAllSongs()[0].title).toBe("Awakening (Updated)");
  });

  it("should not delete a non-existent song", () => {
    const result = deleteSong("non-existent-id");
    expect(result).toBe(false);
    expect(getAllSongs()).toHaveLength(1);
  });

  it("should delete a song", () => {
    const songId = getAllSongs()[0].id;
    const result = deleteSong(songId);
    expect(result).toBe(true);
    expect(getAllSongs()).toHaveLength(0);
  });
});
