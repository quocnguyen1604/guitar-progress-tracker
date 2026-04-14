import { useForm } from "react-hook-form";
import { songInputSchema } from "../../../../shared/validation/songSchema";
import type { SongInput } from "../../../../shared/validation/songSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, useEffect } from "react";
import styles from "./AddSongForm.module.css";
import uiStyles from "../../../../shared/styles/ui.module.css";

type ThumbnailUpload = {
  bytes: Uint8Array;
  mimeType: "image/png" | "image/jpeg";
  extension: "png" | "jpg";
};

export default function AddSongForm() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [thumbnailUpload, setThumbnailUpload] =
    useState<ThumbnailUpload | null>(null);

  const { register, handleSubmit, formState, setValue } = useForm<SongInput>({
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

  const openImagePicker = () => {
    fileInputRef.current?.click();
  };

  const onThumbNailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isCorrectFormat =
      file.type === "image/png" || file.type === "image/jpeg";
    if (!isCorrectFormat) {
      alert("Please select a valid image file");
      e.currentTarget.value = "";
      return;
    }

    try {
      const image = await loadImageElement(file);
      const croppedBlob = await cropToCenterSquareBlob(image, file.type);
      const croppedBytes = new Uint8Array(await croppedBlob.arrayBuffer());
      const previewObjectUrl = URL.createObjectURL(croppedBlob);
      const extension = file.type === "image/png" ? "png" : "jpg";

      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return previewObjectUrl;
      });

      setThumbnailUpload({
        bytes: croppedBytes,
        mimeType: file.type === "image/png" ? "image/png" : "image/jpeg",
        extension,
      });

      setValue("thumbnailUrl", "", { shouldDirty: true });
      setValue("thumbnailPath", "", { shouldDirty: true });
    } catch (error) {
      console.error("Failed to process thumbnail:", error);
      alert("Failed to process selected image.");
    } finally {
      e.currentTarget.value = "";
    }
  };

  const onSubmit = async (data: SongInput) => {
    const result = await window.songApi.addSong(
      data,
      thumbnailUpload ?? undefined,
    );
    console.log("Add song result:", result);
    if (result[0]) {
      window.close();
    } else {
      console.error("Failed to add song");
      console.log(result);
      alert("Failed to add song");
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const loadImageElement = (file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const fileUrl = URL.createObjectURL(file);
      image.onload = () => {
        URL.revokeObjectURL(fileUrl);
        resolve(image);
      };
      image.onerror = () => {
        URL.revokeObjectURL(fileUrl);
        reject(new Error("Could not decode image file."));
      };
      image.src = fileUrl;
    });
  };

  const cropToCenterSquareBlob = (
    image: HTMLImageElement,
    mimeType: string,
  ): Promise<Blob> => {
    const side = Math.min(image.width, image.height);
    const sourceX = Math.floor((image.width - side) / 2);
    const sourceY = Math.floor((image.height - side) / 2);
    const canvas = document.createElement("canvas");
    canvas.width = side;
    canvas.height = side;
    const context = canvas.getContext("2d");
    if (!context) {
      return Promise.reject(new Error("Failed to get canvas context."));
    }

    context.drawImage(image, sourceX, sourceY, side, side, 0, 0, side, side);

    const outputMimeType =
      mimeType === "image/png" ? "image/png" : "image/jpeg";

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Failed to export cropped image."));
            return;
          }
          resolve(blob);
        },
        outputMimeType,
        0.92,
      );
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={uiStyles.form}>
      <button
        className={uiStyles.button}
        type="button"
        onClick={openImagePicker}
      >
        Choose Thumbnail
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg"
        multiple={false}
        className={styles.hiddenFileInput}
        onChange={onThumbNailChange}
      />

      {previewUrl && (
        <div className={styles.previewWrap}>
          <img
            className={styles.previewImage}
            src={previewUrl}
            alt="Thumbnail preview"
          />
        </div>
      )}
      <div className={uiStyles.field}>
        <label className={uiStyles.label}>Title:</label>
        <input
          className={uiStyles.input}
          placeholder="Title"
          {...register("title")}
        />
        {formState.errors.title && (
          <p className={uiStyles.errorText}>{formState.errors.title.message}</p>
        )}
      </div>
      <div className={uiStyles.field}>
        <label className={uiStyles.label}>Artist:</label>
        <input
          className={uiStyles.input}
          placeholder="Artist"
          {...register("artist")}
        />
        {formState.errors.artist && (
          <p className={uiStyles.errorText}>
            {formState.errors.artist.message}
          </p>
        )}
      </div>
      <div className={uiStyles.field}>
        <label className={uiStyles.label}>Song link:</label>
        <input
          className={uiStyles.input}
          placeholder="Song link"
          {...register("songLink")}
        />
        {formState.errors.songLink && (
          <p className={uiStyles.errorText}>
            {formState.errors.songLink.message}
          </p>
        )}
      </div>
      <div className={uiStyles.field}>
        <label className={uiStyles.label}>Tab link:</label>
        <input
          className={uiStyles.input}
          placeholder="Tab link"
          {...register("tabLink")}
        />
        {formState.errors.tabLink && (
          <p className={uiStyles.errorText}>
            {formState.errors.tabLink.message}
          </p>
        )}
      </div>
      <div className={uiStyles.field}>
        <label className={uiStyles.label}>Target BPM:</label>
        <input
          className={uiStyles.input}
          type="number"
          placeholder="Target BPM"
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
          placeholder="Current Practice BPM"
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
          placeholder="Progress"
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
        <textarea
          className={uiStyles.textarea}
          placeholder="Notes"
          {...register("notes")}
        />
        {formState.errors.notes && (
          <p className={uiStyles.errorText}>{formState.errors.notes.message}</p>
        )}
      </div>
      <div className={uiStyles.actions}>
        <button
          className={uiStyles.button}
          type="submit"
          disabled={formState.isSubmitting}
        >
          Add Song
        </button>
      </div>
    </form>
  );
}
