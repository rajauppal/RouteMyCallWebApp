import { TextField } from '@mui/material';
import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { ExtensionClient } from '../../api/server';
import { useNavigate, useParams } from 'react-router-dom';

export default function ModifyExtension() {
    
    let { currentExtensionId } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [extensionType, setExtensionType] = useState("");
    const [address, setAddress] = useState("");
    const globalInfo = useSelector((state) => state.globalInfo)

    function save() {
        const client = new ExtensionClient(globalInfo.apiRoot, undefined, globalInfo.accessToken);

        if (currentExtensionId) {
            client.updateExtension(currentExtensionId, name, extensionType, address).then((data) => {
                onClose();
            })
        }
        else {
            client.addExtension(globalInfo.currentCompanyId, name, extensionType, address).then((data) => {
                onClose();
            });
        }

    }
    useEffect(() => {

        const client = new ExtensionClient(globalInfo.apiRoot, undefined, globalInfo.accessToken);

        if (currentExtensionId) {
            client.getExtensionById(currentExtensionId).then((data) => {
                setName(data.name);
                setAddress(data.address);
                setExtensionType(data.extensionType);
            })
        }
        else {
            setName("");
            setExtensionType("SIP");
            setAddress("");
        }
    }, [currentExtensionId, globalInfo])

    const onClose = () =>{
        navigate('/extensions')
    }


    return (
        <div style={{padding:20}}>
            <br></br>

            Name:  <br></br>
            <TextField value={name} onChange={(e) => { setName(e.target.value) }}></TextField>
            <br></br>
            {/* Type: <select value={extensionType} onChange={(e) => { setExtensionType(e.target.value) }}>
                <option value={"SIP"}>SIP</option>
                <option value={"PHONE"}>Phone</option>
            </select>
            <br></br> */}
            <br></br>
            Number/Address: <br></br><TextField value={address} onChange={(e) => setAddress(e.target.value)}></TextField>
            <br></br>
            <br></br>
            <Button variant='outlined' onClick={() => { save() }} disabled={name==="" || address===""} >Save</Button> &nbsp;&nbsp;
            <Button  variant='outlined' onClick={() => { onClose() }}>Close</Button>
            <br></br>
        </div>
    )
}
