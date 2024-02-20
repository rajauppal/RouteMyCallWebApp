import { Button, FormLabel, Grid, ListSubheader, MenuItem, Select } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { AudioFileClient, ExtensionClient, MenuClient, RuleClient } from '../../api/server';

export default function EditDtf() {
    const location = useLocation();

    const navigate = useNavigate();
    const globalInfo = useSelector((state) => state.globalInfo)
    const [options, setOptions] = useState([]);

    const [action, setAction] = useState(null);
    const [action2, setAction2] = useState(null);

    const onClose = () => {
        navigate(`/editMenu/${location.state.currentMenuId}`)
    }

    function save() {
        const client = new MenuClient(globalInfo.apiRoot, undefined, globalInfo.accessToken);

        var tempAction = { ...action };

        if (action.action === "PLAYRECORDING") {
            tempAction.followupAction = action2;
        }
        else {
            tempAction.followupAction = null;
        }

        client.updateMenuAction(location.state.currentMenuId, JSON.stringify(tempAction)).then((data) => {
            onClose();
        })

    }

    useEffect(() => {
        setAction(location.state.action);
        setAction2(location.state.action.followupAction ? location.state.action.followupAction : { "action": "DONOTHING", "objectId": "" });
    }, [location]);



    useEffect(() => {
        const client1 = new ExtensionClient(globalInfo.apiRoot, undefined, globalInfo.accessToken);
        const client2 = new MenuClient(globalInfo.apiRoot, undefined, globalInfo.accessToken);
        const client3 = new RuleClient(globalInfo.apiRoot, undefined, globalInfo.accessToken);
        const client4 = new AudioFileClient(globalInfo.apiRoot, undefined, globalInfo.accessToken);

        Promise.all([
            client1.getExtensions(globalInfo.currentCompanyId),
            client2.getMenus(globalInfo.currentCompanyId),
            client3.getRules(globalInfo.currentCompanyId),
            client4.getAudioFiles(globalInfo.currentCompanyId)
        ]).then((data) => {
            var extensions = data[0];
            var menus = data[1];
            var rules = data[2];
            var audioFiles = data[3]

            var arrActions = [];
            arrActions.push({ action: "DONOTHING", name: "Do Nothing", objectId: "" })

            arrActions.push({ "section": "-- Extensions --" })
            extensions.forEach(extension => {
                arrActions.push({ name: `Transfer Call To ${extension.name}`, value: `GOTOEXTENSION-${extension.extensionId}`, action: `GOTOEXTENSION`, objectId: extension.extensionId })
            });

            arrActions.push({ "section": "-- Menu Items --" })
            menus.forEach(menu => {
                arrActions.push({ name: "Go To " + menu.menuName, value: `GOTOMENU-${menu.menuId}`, action: `GOTOMENU`, objectId: menu.menuId })
            });

            arrActions.push({ "section": "-- Rules --" })
            rules.forEach(rule => {
                arrActions.push({ name: "Run Rule " + rule.ruleName, value: `EXECUTERULE-${rule.ruleId}`, action: `EXECUTERULE`, objectId: rule.ruleId })
            });

            arrActions.push({ "section": "-- Audio Files --" })
            audioFiles.forEach(audio => {
                arrActions.push({ name: "Play Audio File " + audio.name, value: `PLAYRECORDING-${audio.audioFileId}`, action: `PLAYRECORDING`, objectId: audio.audioFileId })
            });

            arrActions.push({ "section": "-- Other Actions --" })
            arrActions.push({ name: "Hangup", value: "Hangup", action: "HANGUP", objectId: "" })
            arrActions.push({ name: "Transfer To Voicemail", value: "Voicemail", action: "VOICEMAIL", objectId: "" })

            setOptions(arrActions)
        })

        setOptions([])
    }, [globalInfo])

    function onActionChange(e) {
        var temp = { ...action };
        temp.action = JSON.parse(e.target.value).action
        temp.objectId = JSON.parse(e.target.value).objectId

        setAction(temp);
    }

    function onAction2Change(e) {
        var temp = { ...action2 };
        temp.action = JSON.parse(e.target.value).action
        temp.objectId = JSON.parse(e.target.value).objectId

        setAction2(temp);
    }

    return (
        <div>

            <br></br>
            {
                action && <>
                    <div>
                        <Grid container spacing={2} >
                            <Grid item xs={12} >
                                <FormLabel>When {(action.name)} is Pressed<br></br></FormLabel>
                            </Grid>
                            <Grid item xs={12} xl={6}>
                                {options && options.length > 0 && <Select value={JSON.stringify({ action: action.action, objectId: action.objectId })}
                                    onChange={(e) => { onActionChange(e) }}
                                    style={{ width: 370 }}>
                                    {
                                        options.map((item, index) => {
                                            if (item.section) {
                                                return <ListSubheader key={index} >{item.section}</ListSubheader>
                                            }
                                            else {
                                                return <MenuItem key={index} value={JSON.stringify({ action: item.action, objectId: item.objectId })}>{item.name}</MenuItem>
                                            }
                                        })
                                    }
                                </Select>}
                            </Grid>
                            {
                                action.action === "PLAYRECORDING" && <Grid item xs={12} >
                                    <FormLabel>Followup Action</FormLabel>
                                </Grid>}
                            {
                                action.action === "PLAYRECORDING" &&
                                <Grid item xs={12} >
                                    {options && options.length > 0 && action.action === "PLAYRECORDING" && <>

                                        <Select value={JSON.stringify({ action: action2.action, objectId: action2.objectId })}
                                            onChange={(e) => { onAction2Change(e) }}
                                            style={{ width: 370 }}>
                                            {
                                                options.map((item, index) => {
                                                    if (item.section) {
                                                        return <ListSubheader key={index} >{item.section}</ListSubheader>
                                                    }
                                                    else {
                                                        return <MenuItem key={index} value={JSON.stringify({ action: item.action, objectId: item.objectId })}>{item.name}</MenuItem>
                                                    }
                                                })
                                            }
                                        </Select>
                                    </>
                                    }
                                </Grid>}
                        </Grid>

                    </div>
                </>
            }
            <br></br>
            <Button variant='outlined' onClick={() => { save() }}>Save</Button> &nbsp; &nbsp;
            <Button variant='outlined' onClick={() => { onClose() }}>Cancel</Button>
        </div>
    )
}
