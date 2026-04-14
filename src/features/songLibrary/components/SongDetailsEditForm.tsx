import type { Song } from "../../../shared/types/song";
import { useForm } from "react-hook-form";
import { songInputSchema } from "../../../shared/validation/songSchema";
import type { SongInput } from "../../../shared/validation/songSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import detailStyles from "./SongDetails.module.css";
import uiStyles from "../../../shared/styles/ui.module.css";
import { useState, useEffect, useRef } from "react";

type SongDetailsEditFormProps = {
  song: Song;
  setIsEditing: (isEditing: boolean) => void;
};

type ThumbnailUpload = {
  bytes: Uint8Array;
  mimeType: "image/png" | "image/jpeg";
  extension: "png" | "jpg";
};

export default function SongDetailsEditForm({
  song,
  setIsEditing,
}: SongDetailsEditFormProps) {
  const { register, handleSubmit, formState, setValue } = useForm<SongInput>({
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [thumbnailUpload, setThumbnailUpload] =
    useState<ThumbnailUpload | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  useEffect(() => {
    let imageUrl: string | null = null;
    let cancelled = false;

    const loadThumbnail = async () => {
      if (!song.thumbnailPath) {
        setImageSrc(null);
        return;
      }

      try {
        const thumbnailData = await window.songApi.getSongThumbnail(
          song.thumbnailPath,
        );
        if (!thumbnailData || cancelled) {
          setImageSrc(null);
          return;
        }
        const { bytes, mimeType } = thumbnailData;
        const safeBytes = new Uint8Array(bytes).slice();
        const blob = new Blob([safeBytes], { type: mimeType });
        imageUrl = URL.createObjectURL(blob);
        setImageSrc(imageUrl);
      } catch (error) {
        console.error("Error loading thumbnail:", error);
        setImageSrc(null);
      }
    };

    void loadThumbnail();

    return () => {
      cancelled = true;
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [song.id, song.thumbnailPath]);

  const openImagePicker = () => {
    fileInputRef.current?.click();
  };

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

  const onThumbNailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const inputEl = e.currentTarget;
    if (!file) return;

    const isCorrectFormat =
      file.type === "image/png" || file.type === "image/jpeg";
    if (!isCorrectFormat) {
      alert("Please select a valid image file");
      inputEl.value = "";
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
      inputEl.value = "";
    }
  };

  const onSubmit = async (
    data: SongInput,
    thumbnailUpload?: ThumbnailUpload,
  ) => {
    const result = await window.songApi.updateSong(
      song.id,
      data,
      thumbnailUpload ?? undefined,
    );
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
      onSubmit={handleSubmit((data) =>
        onSubmit(data, thumbnailUpload ?? undefined),
      )}
      className={`${uiStyles.form} ${detailStyles.card}`}
    >
      <div className={detailStyles.detailsLayout}>
        <div className={detailStyles.infoBlock}>
          <div className={uiStyles.field}>
            <label className={uiStyles.label}>Title:</label>
            <input className={uiStyles.input} {...register("title")} />
            {formState.errors.title && (
              <p className={uiStyles.errorText}>
                {formState.errors.title.message}
              </p>
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
              <p className={uiStyles.errorText}>
                {formState.errors.notes.message}
              </p>
            )}
          </div>
        </div>
        <div
          className={`${detailStyles.thumbnailBlock} ${detailStyles.clickableThumbnail}`}
          onClick={openImagePicker}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              openImagePicker();
            }
          }}
          title="Click to change thumbnail"
        >
          {previewUrl || imageSrc ? (
            <img
              src={previewUrl ?? imageSrc ?? undefined}
              alt={`${song.title} thumbnail`}
              className={detailStyles.thumbnail}
            />
          ) : (
            <div className={detailStyles.thumbnailPlaceholder}>
              Click to add thumbnail
            </div>
          )}
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg"
        multiple={false}
        className={detailStyles.hiddenFileInput}
        onChange={onThumbNailChange}
      />

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
