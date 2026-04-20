"use client";
import { updateKnowledge } from "@/src/state/slices/knowledgeSlice";
import { FastApiUploadResponse } from "@/src/types/backendResponseTypes";
import { ProcessingCard } from "@/src/ui/ProcessingCard";
import { uploadFiles } from "@/src/utils/apiFunctions/uploadsAPI";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { FaFileUpload } from "react-icons/fa";
import { useDispatch } from "react-redux";
import FilesFailedDialogBox from "./FilesFailedDialogBox";

const UploadFileComponent = () => {
  const uploadAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const dispatch = useDispatch();
  const [filesUploading, setFilesUploading] = useState<boolean>(false);
  const [filesUploadResponse, setFilesUploadResponse] =
    useState<FastApiUploadResponse | null>(null);

  const handleFilesSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];

    setFiles((s) => [...s, ...selectedFiles]);

    setFilesUploading(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    const data = await uploadFiles(selectedFiles);


    if ("error" in data) {
      setFilesUploading(false);
      console.log("errors:: ", data.error);
      return;
    }

    if (data) {
      setFilesUploading(false);
      const fileUploadData = data;

      const { summary, results } = fileUploadData.data;
      if (summary.failed > 0) {
        setFilesUploadResponse(fileUploadData);
      }

      const successfulFileNames = results
        .filter((file) => file.status === "success")
        .map((file) => file.filename);

      if (successfulFileNames) {
        dispatch(updateKnowledge(successfulFileNames));
      }
    }
  };

  useEffect(() => {
    const uploadArea = uploadAreaRef.current;

    if (!uploadArea) return;

    const dragOverHandler = (e: DragEvent) => {
      e.preventDefault();
      uploadArea.classList.add(`drag`);
      if (filesUploading && e.dataTransfer) {
        e.dataTransfer.dropEffect = "none";
      }
    };

    const dragLeaveHandler = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      uploadArea.classList.remove(`drag`);
    };

    const handleDrop = async (e: DragEvent) => {
      console.log(e);
      e.preventDefault();
      if (filesUploading) {
        return;
      }

      if (e.dataTransfer?.files) {
        const droppedFiles = Array.from(e.dataTransfer.files);
        setFiles((s) => [...s, ...droppedFiles]);

        setFilesUploading(true);
        const data  = await uploadFiles(droppedFiles);
        console.log(data);
        if ("error" in data) {
          setFilesUploading(false);

          console.log("errors:: ", data.error);
          return;
        }

        if (data) {
          setFilesUploading(false);
          const { summary, results } = data.data;

          const successfulFileNames = results
            .filter((file) => file.status === "success")
            .map((file) => file.filename);

          if (successfulFileNames) {
            dispatch(updateKnowledge(successfulFileNames));
          }

          if (summary.failed > 0) {
            setFilesUploadResponse(data);
          }
        }
      }
    };

    uploadArea?.addEventListener("dragover", dragOverHandler);
    uploadArea?.addEventListener("dragleave", dragLeaveHandler);
    uploadArea?.addEventListener("drop", handleDrop);

    return () => {
      uploadArea?.removeEventListener("dragover", dragOverHandler);
      uploadArea?.removeEventListener("dragleave", dragLeaveHandler);
      uploadArea?.removeEventListener("drop", handleDrop);
    };
  }, [filesUploading]);

  return (
    <div
      ref={uploadAreaRef}
      className={`uploadArea mt-8 bg-[#101010] w-full h-4/10 shadow-[0px_0px_10px] [&.drag]:shadow-[0px_0px_15px] shadow-[#c082dc5f] flex flex-col items-center justify-center gap-4 border-2 border-dashed border-gray-600 rounded-md p-8`}
    >
      {filesUploading && <ProcessingCard />}

      {filesUploadResponse && (
        <FilesFailedDialogBox
          filesUploadResponse={filesUploadResponse}
          setFilesUploadResponse={setFilesUploadResponse}
        />
      )}

      {!filesUploading && (
        <>
          <div className="uploadIcon bg-gray-800 p-4 rounded-md">
            <FaFileUpload className="size-8 text-purple-300" />
          </div>
          <p>Drop Documents Here</p>
          <div className="uploadFileOption">
            <button
              disabled={filesUploading}
              className="bg-linear-to-r from-purple-300 to-purple-600 font-medium text-black px-6 p-2 rounded-sm cursor-pointer disabled:cursor-not-allowed"
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
        </>
      )}
    </div>
  );
};

export default UploadFileComponent;
