import axios from "axios";
import { useState } from "react";

import React from 'react'
import { Button } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function Upload() {
    let { currentAudioFileId } = useParams();
    const navigate = useNavigate();



    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null)
    const globalInfo = useSelector((state) => state.globalInfo)

    const onFileChange = (event) => {
        setSelectedFile(event.target.files[0])
    };

    function onClose(){
        navigate("/audiofiles")
    }


    const onFileUpload = async () => {
        const formData = new FormData();

        formData.append(
            "myFile",
            selectedFile,
            selectedFile.name
        );

        var serverRoot = globalInfo.apiRoot;
        var url = '';
        if (currentAudioFileId) {
            url = `${serverRoot}/upload?&updateAudioFile=true&audioFileId=${currentAudioFileId}`
        }
        else {
            url = `${serverRoot}/upload?updateAudioFile=false&companyId=${globalInfo.currentCompanyId}`
        }
        setUploading(true);
        await axios
            .post(url, formData)
            .then((response) => {
                if(response.data === true) {
                    onClose(false)
                }
            }).finally(() => {
                setUploading(false);
            });
    };


    const showUploadButton = () => {
        if (selectedFile && (selectedFile.type === "audio/wav" )&& !uploading) {
            return <Button variant="outlined" onClick={() => { onFileUpload() }}>Upload</Button>
        }
        else return (
            <>
            <Button variant="outlined" disabled>Upload</Button>
            </>
        )
    }

    return (
        <div style={{padding:20}}>
            <div>
                <input type="file" onChange={(event) => { onFileChange(event) }} />
            </div>
            <div>
                {selectedFile && selectedFile.type !== "audio/wav"  && <div>Only audio/wav  files are supported</div>}
                {selectedFile && (selectedFile.type === "audio/wav"  ) && uploading &&  <div>Uploading...</div>}
                <br></br>
                {showUploadButton()} &nbsp; &nbsp; 
                <Button variant="outlined" onClick={() => { onClose(false) }}>Close</Button>
            </div>
        </div>
    );
}

