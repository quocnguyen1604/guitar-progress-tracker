import { useForm } from "react-hook-form";
import { songInputSchema } from "../../../../shared/validation/songSchema";
import type { SongInput } from "../../../../shared/validation/songSchema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function AddSongForm() {
  const { register, handleSubmit, formState } = useForm<SongInput>({
    resolver: zodResolver(songInputSchema),
    defaultValues: {
      title: "",
      artist: "",
      thumbnailUrl: "",
      thumbnailPath: "",
      songLink: "",
      tabLink: "",
      localTabPath: "",
      targetBpm: 120,
      currentPracticeBpm: 60,
      progress: 0,
      notes: "",
    },
  });

  const onSubmit = async (data: SongInput) => {
    const result = await window.songApi.addSong(data);
    console.log("Add song result:", result);
    if (result) {
      window.close();
    } else {
      console.error("Failed to add song");
      console.log(result);
      alert("Failed to add song");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Title:</label>
        <input placeholder="Title" {...register("title")} />
        {formState.errors.title && (
          <p style={{ color: "red" }}>{formState.errors.title.message}</p>
        )}
      </div>
      <div>
        <label>Artist:</label>
        <input placeholder="Artist" {...register("artist")} />
        {formState.errors.artist && (
          <p style={{ color: "red" }}>{formState.errors.artist.message}</p>
        )}
      </div>
      <div>
        <label>Song link:</label>
        <input placeholder="Song link" {...register("songLink")} />
        {formState.errors.songLink && (
          <p style={{ color: "red" }}>{formState.errors.songLink.message}</p>
        )}
      </div>
      <div>
        <label>Tab link:</label>
        <input placeholder="Tab link" {...register("tabLink")} />
        {formState.errors.tabLink && (
          <p style={{ color: "red" }}>{formState.errors.tabLink.message}</p>
        )}
      </div>
      <div>
        <label>Target BPM:</label>
        <input
          type="number"
          placeholder="Target BPM"
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
          placeholder="Current Practice BPM"
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
          placeholder="Progress"
          {...register("progress", { valueAsNumber: true })}
        />
        {formState.errors.progress && (
          <p style={{ color: "red" }}>{formState.errors.progress.message}</p>
        )}
      </div>
      <div>
        <label>Notes:</label>
        <textarea placeholder="Notes" {...register("notes")} />
        {formState.errors.notes && (
          <p style={{ color: "red" }}>{formState.errors.notes.message}</p>
        )}
      </div>
      <button type="submit" disabled={formState.isSubmitting}>
        Add Song
      </button>
    </form>
  );
}
