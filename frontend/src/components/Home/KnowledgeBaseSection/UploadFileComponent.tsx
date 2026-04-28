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
      className={`uploadArea mt-8 shrink-0 bg-[#101010] w-[min(100%,18rem)] sm:w-[min(100%,20rem)] md:w-[80%] min-h-60 shadow-[0px_0px_10px] [&.drag]:shadow-[0px_0px_15px] shadow-[#c082dc5f] flex flex-col items-center justify-center gap-4 border-2 border-dashed border-gray-600 rounded-md px-6 py-8 ${
        isDragActive ? "drag" : ""
      }`}
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
          <div className="uploadIcon bg-gray-800 p-4 rounded-md">
            <FaFileUpload className="size-8 text-purple-300" />
          </div>
          <p className="text-sm text-center">Drop Documents Here</p>
          <div className="uploadFileOption">
            <button
              type="button"
              disabled={filesUploading}
              className="bg-linear-to-r from-purple-300 to-purple-600 font-medium text-black text-sm px-6 p-2 rounded-sm cursor-pointer disabled:cursor-not-allowed"
              onClick={() => fileInputRef.current?.click()}
            >
              UPLOAD FILE
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
