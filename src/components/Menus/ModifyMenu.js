import { Autocomplete } from '@mui/material';
import { TextField } from '@mui/material';
import { Grid } from '@mui/material';
import { FormLabel } from '@mui/material';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { AudioFileClient, MenuClient } from '../../api/server';
import DTF from './DTF';
import { useNavigate, useParams } from 'react-router-dom';

export default function ModifyMenu() {

    let { currentMenuId } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [timeout, setTimeout] = useState("");
    const [audioFiles, setAudioFiles] = useState([]);
    const [dtfAudioIds, setDtfAudioIds] = useState("[]");
    const globalInfo = useSelector((state) => state.globalInfo)
    const [defaultValue, setDefaultValue] = useState([]);

    const [actionValues, setActionValues] = useState([
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

    const onClose = () => {
        navigate('/ivr')
    }



    function save() {
        const client = new MenuClient(globalInfo.apiRoot, undefined, globalInfo.accessToken);

        if (currentMenuId) {

            client.updateMenu(currentMenuId, name, description, timeout, dtfAudioIds).then((data) => {
                onClose();
            })
        }

    }

    function getSelectedObjects(audioFileIds) {

        var arr = JSON.parse(audioFileIds);
        var result = [];

        arr.forEach(element => {
            var filtered = audioFiles.filter((x) => x.audioFileId === element);
            if (filtered.length > 0) {
                result.push({ audioFileId: filtered[0].audioFileId, name: filtered[0].name });
            }
        });

        return result;
    }

    useEffect(() => {
        if (!dtfAudioIds) return;
        if (audioFiles.length === 0) return;
        var x = getSelectedObjects(dtfAudioIds);

        setDefaultValue(x)
        // eslint-disable-next-line
    }, [audioFiles, dtfAudioIds])

    useEffect(() => {

        const client1 = new AudioFileClient(globalInfo.apiRoot, undefined, globalInfo.accessToken);
        const client2 = new MenuClient(globalInfo.apiRoot, undefined, globalInfo.accessToken);

        client1.getAudioFiles(globalInfo.currentCompanyId).then(
            (data) => {
                setAudioFiles(data);
            }
        )

        if (currentMenuId) {
            client2.getMenuById(currentMenuId).then((data) => {
                setName(data.menuName);
                setDescription(data.description)
                setTimeout(data.timeout);
                setActionValues(JSON.parse(data.configuration))
                setDtfAudioIds(data.dtfAudioIds ?? "[]")

            })
        }

    }, [currentMenuId, globalInfo])

    return (
        <div>
            <h2>Modify Routing Options</h2>
            <Grid container spacing={2} style={{border:"0px solid black"}}>
                <Grid item xs={12} sm={12} md={8} lg={6}>
                    <FormLabel>Name: </FormLabel>
                    <TextField fullWidth={true} value={name} onChange={(e) => { setName(e.target.value) }}></TextField>
                </Grid>
                <Grid item xs={6}></Grid>
                <Grid item xs={12} sm={12} md={8} lg={6}>
                    <FormLabel>Announcement Audio: (Multiple files can be selected in appropriate order)<br></br></FormLabel>
                    <Autocomplete
                        onChange={(event, value) => { setDtfAudioIds(JSON.stringify(value.map((x) => { return x.audioFileId }))); }} // prints the selected value
                        multiple
                        options={audioFiles.map((item) => { return { "audioFileId": item.audioFileId, "name": item.name } })}
                        value={defaultValue}
                        getOptionLabel={(option) => option.name}
                        renderOption={(props, option) => {
                            return (
                                <span {...props} key={option.audioFileId}>
                                    {option.name}
                                </span>
                            );
                        }}
                        isOptionEqualToValue={(option, value) => option.audioFileId === value.audioFileId}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="standard"
                            />
                        )}
                    />
                </Grid>

            </Grid>
            <br></br>
            <Grid container spacing={2} width={1200}>
                <Grid item xs={1}>
                    <Button variant='outlined' disabled={name === ""} onClick={() => { save() }}>Save</Button>
                </Grid>
                <Grid item xs={1}>
                    <Button variant='outlined' onClick={() => { onClose() }}>Close</Button>
                </Grid>
            </Grid>
            <br></br><br></br>
            <DTF currentMenuId={currentMenuId} actionValues={actionValues} setActionValues={setActionValues}></DTF>    <br></br>

        </div>
    )
}
