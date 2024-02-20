import { Button, FormLabel, TextField } from '@mui/material';
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { MenuClient, MenuUI } from '../../api/server';
import { useSelector } from 'react-redux';

export default function AddMenu() {
    const navigate = useNavigate();
    const [timeout] = useState("10");
    const [dtfAudioIds] = useState("[]");
    const [description] = useState("");
    const globalInfo = useSelector((state) => state.globalInfo)

    const [actionValues] = useState([
        { "name": "1", "action": "DONOTHING", "objectId": "" },
        { "name": "2", "action": "DONOTHING", "objectId": "" },
        { "name": "3", "action": "DONOTHING", "objectId": "" },
        { "name": "4", "action": "DONOTHING", "objectId": "" },
        { "name": "5", "action": "DONOTHING", "objectId": "" },
        { "name": "6", "action": "DONOTHING", "objectId": "" },
        { "name": "7", "action": "DONOTHING", "objectId": "" },
        { "name": "8", "action": "DONOTHING", "objectId": "" },
        { "name": "9", "action": "DONOTHING", "objectId": "" },
        { "name": "*", "action": "DONOTHING", "objectId": "" },
        { "name": "0", "action": "DONOTHING", "objectId": "" },
        //{ "name": "#", "action": "DONOTHING", "objectId": "" }
    ])

    const [name, setName] = useState("");

    const onClose = () =>{
        navigate('/ivr')
    }


    function save() {
        const client = new MenuClient(globalInfo.apiRoot, undefined, globalInfo.accessToken);

        var configuration = JSON.stringify(actionValues);

        let ui = new MenuUI();
        ui.menuName = name;
        ui.description = description;
        ui.timeout = Number(timeout);
        ui.dtfAudioIds = dtfAudioIds; 
        ui.configuration = configuration;

        client.addMenu(globalInfo.currentCompanyId,ui).then((data) => {
            navigate(`/editMenu/${data}`)
        });

    }
    
    return (
    <div>
            <FormLabel>Name: </FormLabel>
            <TextField fullWidth={true} value={name} onChange={(e) => { setName(e.target.value) }}></TextField>
            <br></br>
            <br></br>
            <Button variant='outlined' disabled={name === ""} onClick={() => { save() }}>Save</Button> &nbsp;&nbsp;&nbsp;
            <Button variant='outlined' onClick={() => { onClose() }}>Close</Button>
    </div>
  )
}
