import { TextField } from '@mui/material';
import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { AudioFileClient } from '../../api/server';
import { useNavigate, useParams } from 'react-router-dom';

export default function ModifyAudioFile() {

    let { currentAudioFileId } = useParams();
    const navigate = useNavigate();


    const [name, setName] = useState("");
    const globalInfo = useSelector((state) => state.globalInfo)

    function save() {
        const client = new AudioFileClient(globalInfo.apiRoot, undefined, globalInfo.accessToken);

        if (currentAudioFileId) {
            client.updateAudioFile(currentAudioFileId, name).then((data) => {
                onClose();
            })
        }
    }

    function onClose(){
        navigate("/audiofiles")
    }

    useEffect(() => {
        const client = new AudioFileClient(globalInfo.apiRoot, undefined, globalInfo.accessToken);
        if (currentAudioFileId) {
            client.getAudioFileById(currentAudioFileId).then((data) => {
                setName(data.name);
            })
        }
        else {
            setName("");
        }
    }, [currentAudioFileId, globalInfo])

    return (
        <div style={{padding:20}}>
            {
                currentAudioFileId &&
                <div>
                    Name:<br></br> <TextField value={name} onChange={(e) => { setName(e.target.value) }}></TextField>
                    <br></br>
                    <br></br>
                    <Button variant='outlined' disabled={name===""} onClick={() => { save() }}>Save</Button>&nbsp;&nbsp;
                    <Button variant='outlined' onClick={() => { onClose() }}>Close</Button>
                    <br></br>
                </div>
            }
    </div>
  )
}
