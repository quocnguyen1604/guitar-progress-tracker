import type { Song } from "../../../shared/types/song";
import { useForm } from "react-hook-form";
import { songInputSchema } from "../../../shared/validation/songSchema";
import type { SongInput } from "../../../shared/validation/songSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import detailStyles from "./SongDetails.module.css";
import uiStyles from "../../../shared/styles/ui.module.css";

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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`${uiStyles.form} ${detailStyles.card}`}
    >
      <div className={uiStyles.field}>
        <label className={uiStyles.label}>Title:</label>
        <input className={uiStyles.input} {...register("title")} />
        {formState.errors.title && (
          <p className={uiStyles.errorText}>{formState.errors.title.message}</p>
        )}
      </div>
      <div className={uiStyles.field}>
        <label className={uiStyles.label}>Artist:</label>
        <input className={uiStyles.input} {...register("artist")} />
        {formState.errors.artist && (
          <p className={uiStyles.errorText}>
            {formState.errors.artist.message}
          </p>
        )}
      </div>
      <p className={uiStyles.metaText}>
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
      <p className={uiStyles.metaText}>
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
      <div className={uiStyles.field}>
        <label className={uiStyles.label}>Target BPM:</label>
        <input
          className={uiStyles.input}
          type="number"
          {...register("targetBpm", { valueAsNumber: true })}
        />
        {formState.errors.targetBpm && (
          <p className={uiStyles.errorText}>
            {formState.errors.targetBpm.message}
          </p>
        )}
      </div>
      <div className={uiStyles.field}>
        <label className={uiStyles.label}>Current Practice BPM:</label>
        <input
          className={uiStyles.input}
          type="number"
          {...register("currentPracticeBpm", { valueAsNumber: true })}
        />
        {formState.errors.currentPracticeBpm && (
          <p className={uiStyles.errorText}>
            {formState.errors.currentPracticeBpm.message}
          </p>
        )}
      </div>
      <div className={uiStyles.field}>
        <label className={uiStyles.label}>Progress:</label>
        <input
          className={uiStyles.input}
          type="number"
          {...register("progress", { valueAsNumber: true })}
        />
        {formState.errors.progress && (
          <p className={uiStyles.errorText}>
            {formState.errors.progress.message}
          </p>
        )}
      </div>
      <div className={uiStyles.field}>
        <label className={uiStyles.label}>Notes:</label>
        <textarea className={uiStyles.textarea} {...register("notes")} />
        {formState.errors.notes && (
          <p className={uiStyles.errorText}>{formState.errors.notes.message}</p>
        )}
      </div>
      <div className={uiStyles.actions}>
        <button className={uiStyles.button} type="submit">
          Save Changes
        </button>
        <button
          className={uiStyles.buttonSecondary}
          type="button"
          onClick={() => setIsEditing(false)}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
