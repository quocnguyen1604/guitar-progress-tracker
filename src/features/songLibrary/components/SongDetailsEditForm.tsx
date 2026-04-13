import type { Song } from "../../../shared/types/song";
import { useForm } from "react-hook-form";
import { songInputSchema } from "../../../shared/validation/songSchema";
import type { SongInput } from "../../../shared/validation/songSchema";
import { zodResolver } from "@hookform/resolvers/zod";

type SongDetailsEditFormProps = {
  song: Song;
  setIsEditing: (isEditing: boolean) => void;
};

export default function SongDetailsEditForm({
  song,
  setIsEditing,
}: SongDetailsEditFormProps) {
  const { register, handleSubmit, formState } = useForm<SongInput>({
    resolver: zodResolver(songInputSchema),
    defaultValues: {
      title: song.title,
      artist: song.artist,
      thumbnailUrl: song.thumbnailUrl,
      thumbnailPath: song.thumbnailPath,
      songLink: song.songLink,
      tabLink: song.tabLink,
      localTabPath: song.localTabPath,
      targetBpm: song.targetBpm,
      currentPracticeBpm: song.currentPracticeBpm,
      progress: song.progress,
      notes: song.notes,
    },
  });

  const onSubmit = async (data: SongInput) => {
    const result = await window.songApi.updateSong(song.id, data);
    console.log("Update song result:", result);
    if (result) {
      alert("Song updated successfully");
    } else {
      console.error("Failed to update song");
      alert("Failed to update song");
    }
    setIsEditing(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Title:</label>
        <input {...register("title")} />
        {formState.errors.title && (
          <p style={{ color: "red" }}>{formState.errors.title.message}</p>
        )}
      </div>
      <div>
        <label>Artist:</label>
        <input {...register("artist")} />
        {formState.errors.artist && (
          <p style={{ color: "red" }}>{formState.errors.artist.message}</p>
        )}
      </div>
      <p>
        Added on:{" "}
        {new Date(song.createdAt).toLocaleString(undefined, {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })}
      </p>
      <p>
        Last updated:{" "}
        {new Date(song.updatedAt).toLocaleString(undefined, {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })}
      </p>
      <div>
        <label>Target BPM:</label>
        <input
          type="number"
          {...register("targetBpm", { valueAsNumber: true })}
        />
        {formState.errors.targetBpm && (
          <p style={{ color: "red" }}>{formState.errors.targetBpm.message}</p>
        )}
      </div>
      <div>
        <label>Current Practice BPM:</label>
        <input
          type="number"
          {...register("currentPracticeBpm", { valueAsNumber: true })}
        />
        {formState.errors.currentPracticeBpm && (
          <p style={{ color: "red" }}>
            {formState.errors.currentPracticeBpm.message}
          </p>
        )}
      </div>
      <div>
        <label>Progress:</label>
        <input
          type="number"
          {...register("progress", { valueAsNumber: true })}
        />
        {formState.errors.progress && (
          <p style={{ color: "red" }}>{formState.errors.progress.message}</p>
        )}
      </div>
      <div>
        <label>Notes:</label>
        <textarea {...register("notes")} />
        {formState.errors.notes && (
          <p style={{ color: "red" }}>{formState.errors.notes.message}</p>
        )}
      </div>
      <button type="submit">Save Changes</button>
      <button type="button" onClick={() => setIsEditing(false)}>
        Cancel
      </button>
    </form>
  );
}
