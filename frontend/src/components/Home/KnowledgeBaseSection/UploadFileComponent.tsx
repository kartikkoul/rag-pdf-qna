"use client";
import { uploadFiles } from "@/src/utils/apiFunctions/uploadsAPI";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { FaFileUpload } from "react-icons/fa";


const UploadFileComponent = () => {
    const uploadAreaRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const filesUploadingErrorTimer = useRef<ReturnType<typeof setTimeout>>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [filesUploading, setFilesUploading] = useState<boolean>(false);
    const [filesUploadingError, setFilesUploadingError] = useState<string>("");

    const handleFilesSelect = async(e: ChangeEvent<HTMLInputElement>) =>{
        const selectedFiles = e.target.files ? Array.from(e.target.files) : [];

        setFiles(s => [...s, ...selectedFiles]);

        setFilesUploading(true);
        if(fileInputRef.current){
            fileInputRef.current.value = "";
        }
        const data = await uploadFiles(selectedFiles);

        if(data?.errors){
            setFilesUploading(false);
            setFilesUploadingError(data.errors);
            
            filesUploadingErrorTimer.current = setTimeout(() => setFilesUploadingError(""), 3000);
            return;
        }

        if(data){
            setFilesUploading(false);
        }
    }


    useEffect(() => {
        const uploadArea = uploadAreaRef.current
        
        if (!uploadArea) return;

        const dragOverHandler = (e: DragEvent) => {
            e.preventDefault()
            uploadArea.classList.add("drag")
        }
    
        const dragLeaveHandler = (e: DragEvent) => {
            e.preventDefault()
            e.stopPropagation()
            uploadArea.classList.remove("drag")
        }
    
        const handleDrop = async(e: DragEvent) => {
            console.log(e);
            e.preventDefault();
            // uploadArea.classList.remove("drag");

            if(e.dataTransfer?.files){
                const droppedFiles = Array.from(e.dataTransfer.files);
                console.log(droppedFiles)
                setFiles(s => [...s, ...droppedFiles]);
                
                setFilesUploading(true);
                const data = await uploadFiles(droppedFiles);

                if(data?.errors){
                    setFilesUploading(false);
                    setFilesUploadingError(data.errors);
                    
                    filesUploadingErrorTimer.current = setTimeout(() => setFilesUploadingError(""));
                    return;
                }

                if(data){
                    setFilesUploading(false);
                }
            }
        }


        uploadArea?.addEventListener("dragover", dragOverHandler)
        uploadArea?.addEventListener("dragleave", dragLeaveHandler)
        uploadArea?.addEventListener("drop", handleDrop)

        return () => {
            uploadArea?.removeEventListener("dragover", dragOverHandler)
            uploadArea?.removeEventListener("dragleave", dragLeaveHandler)
            uploadArea?.removeEventListener("drop", handleDrop)
        }
    }, [])

    return (
        <div ref={uploadAreaRef} className="uploadArea mt-8 bg-[#101010] w-full h-60 shadow-[0px_0px_10px] [&.drag]:shadow-[0px_0px_15px] shadow-[#c082dc5f] flex flex-col items-center justify-center gap-4 border-2 border-dashed border-gray-600 rounded-md p-8">
            <div className="uploadIcon bg-gray-800 p-4 rounded-md">
                <FaFileUpload className="size-8 text-purple-300" />
            </div>
            <p>Drop Documents Here</p>
            <div className="uploadFileOption">
                <button className="bg-linear-to-r from-purple-300 to-purple-600 font-medium text-black px-6 p-2 rounded-sm cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                >UPLOAD FILE</button>
            </div>
            <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFilesSelect}
            />
        </div>
    )
}

export default UploadFileComponent