"use client";
import { prependKnowledge } from "@/src/state/slices/knowledgeSlice";
import { FastApiUploadResponse } from "@/src/types/backendResponseTypes";
import { ProcessingCard } from "@/src/ui/ProcessingCard";
import { uploadFiles } from "@/src/utils/apiFunctions/uploadsAPI";
import { ChangeEvent, useRef, useState } from "react";
import { FaFileUpload } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import FilesFailedDialogBox from "./FilesFailedDialogBox";
import { setGlobalError } from "@/src/state/slices/globalErrorsSlice";
import { RootState } from "@/src/state/store";
import { updateFilesUploading } from "@/src/state/slices/generalContext";

const UploadFileComponent = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const dispatch = useDispatch();
  const filesUploading = useSelector(
    (s: RootState) => s.generalContext.filesUploading
  );
  const [filesUploadResponse, setFilesUploadResponse] =
    useState<FastApiUploadResponse | null>(null);

  const processUpload = async (incomingFiles: File[]) => {
    if (filesUploading || incomingFiles.length === 0) {
      return;
    }
    dispatch(updateFilesUploading(true));

    try {
      const data = await uploadFiles(incomingFiles);
      if ("error" in data) {
        dispatch(setGlobalError(data.error.errors[0] ?? "File upload failed."));
        return;
      }

      const { summary, results } = data.data;
      if (summary.failed > 0) {
        setFilesUploadResponse(data);
      }

      const successfulFileNames = results
        .filter((file) => file.status === "success")
        .map((file) => file.filename);

      if (successfulFileNames.length > 0) {
        dispatch(prependKnowledge(successfulFileNames));
      }
    } catch {
      dispatch(setGlobalError("Unexpected upload error. Please try again."));
    } finally {
      dispatch(updateFilesUploading(false));
    }
  };

  const handleFilesSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    await processUpload(selectedFiles);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Upload documents by dropping files or pressing Enter"
      className={`uploadArea mt-6 md:mt-8 shrink-0 w-[min(100%,18rem)] sm:w-[min(100%,20rem)] md:w-[90%] min-h-[14rem] md:min-h-60 flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed px-6 py-8 transition-all duration-200
        bg-neutral-950/60 backdrop-blur-sm
        border-neutral-600/80 shadow-[0_0_40px_-12px_rgba(168,85,247,0.35)]
        hover:border-purple-400/40 hover:shadow-[0_0_48px_-8px_rgba(168,85,247,0.45)]
        [&.drag]:border-purple-400/70 [&.drag]:bg-purple-950/30 [&.drag]:shadow-[0_0_52px_-6px_rgba(168,85,247,0.55)]
        ${isDragActive ? "drag" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragActive(true);
        if (filesUploading && e.dataTransfer) {
          e.dataTransfer.dropEffect = "none";
        }
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setIsDragActive(false);
      }}
      onDrop={async (e) => {
        e.preventDefault();
        setIsDragActive(false);
        const droppedFiles = e.dataTransfer?.files
          ? Array.from(e.dataTransfer.files)
          : [];
        await processUpload(droppedFiles);
      }}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !filesUploading) {
          e.preventDefault();
          fileInputRef.current?.click();
        }
      }}
    >
      {filesUploading && <ProcessingCard />}

      {filesUploadResponse && (
        <FilesFailedDialogBox
          filesUploadResponse={filesUploadResponse}
          setFilesUploadResponse={setFilesUploadResponse}
        />
      )}

      {!filesUploading && (
        <div className="flex flex-col items-center h-full gap-4">
          <div className="uploadIcon rounded-xl bg-neutral-800/90 p-4 ring-1 ring-white/10">
            <FaFileUpload className="size-8 text-purple-300" aria-hidden />
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-medium text-neutral-200">Drop PDFs here</p>
            <p className="text-xs text-neutral-500">or browse — max 5 MB per file</p>
          </div>
          <div className="uploadFileOption">
            <button
              type="button"
              disabled={filesUploading}
              className="rounded-md bg-linear-to-r from-purple-300 to-purple-600 font-semibold text-black text-xs uppercase tracking-wide px-6 py-2.5 shadow-md shadow-purple-900/30 transition hover:brightness-110 active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload file
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFilesSelect}
            disabled={filesUploading}
          />{" "}
        </div>
      )}
    </div>
  );
};

export default UploadFileComponent;
