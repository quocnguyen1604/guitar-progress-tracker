import { useForm } from "react-hook-form";
import { songInputSchema } from "../schemas/songInputSchema";
import type { SongInput } from "../schemas/songInputSchema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function AddSongForm() {
  const { register, handleSubmit, formState } = useForm<SongInput>({
    resolver: zodResolver(songInputSchema),
    defaultValues: {
      title: "",
      artist: "",
    },
  });

  const onSubmit = (data: SongInput) => {
    console.log("Valid data:", data);
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
      <button type="submit" disabled={formState.isSubmitting}>
        Add Song
      </button>
    </form>
  );
}
