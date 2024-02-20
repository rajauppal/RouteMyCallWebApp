import { useEffect, useState } from "react";
import { ListSubheader, Select } from "@mui/material";
import { MenuItem } from "@mui/material";
import { Grid } from "@mui/material";
import { FormLabel } from "@mui/material";
import { useSelector } from "react-redux";
import { AudioFileClient, ExtensionClient, MenuClient, RuleClient } from "../../api/server";

export default function Action(props) {
    const { selectedOption, setSelectedOption } = props;
    const [options, setOptions] = useState([]);
    const globalInfo = useSelector((state) => state.globalInfo)
    const [action, setAction] = useState(null);
    const [action2, setAction2] = useState({ "action": "DONOTHING", "objectId": "" });

    useEffect(() => {
        if (action === null || action.action === "DONOTHING") {
            if (selectedOption) {
                setAction(JSON.parse(getActionValue(selectedOption)))

                if ((JSON.parse(selectedOption)).followUpAction != null) {
                    setAction2((JSON.parse(selectedOption)).followUpAction)
                }
            }
        }
    }, [selectedOption, action])

    function onActionChange(e) {
        var temp = { ...action };
        temp.action = JSON.parse(e.target.value).action
        temp.objectId = JSON.parse(e.target.value).objectId
        if (temp.action === "PLAYRECORDING") {
            temp.followUpAction = action2;
        }
        else {
            temp.followUpAction = null;
        }

        var filtered = options.filter((o) => { return o.action === temp.action && o.objectId === temp.objectId });

        if (filtered.length > 0) {
            temp.name = filtered[0].name;
        }

        setSelectedOption(JSON.stringify(temp));
        setAction(temp);
    }

    function onAction2Change(e) {
        var tempAction2 = { ...action2 };
        tempAction2.action = JSON.parse(e.target.value).action
        tempAction2.objectId = JSON.parse(e.target.value).objectId

        var filtered = options.filter((o) => { return o.action === tempAction2.action && o.objectId === tempAction2.objectId });

        if (filtered.length > 0) {
            tempAction2.name = filtered[0].name;
        }

        setAction2(tempAction2);

        var tempAction = { ...action };
        tempAction.followUpAction = tempAction2;

        setSelectedOption(JSON.stringify(tempAction));
        setAction(tempAction);
    }

    function getActionValue(val) {

        if (val === "0") return JSON.stringify({ action: "DONOTHING", objectId: "" });
        if (val === "") return JSON.stringify({ action: "DONOTHING", objectId: "" });

        var temp = JSON.parse(val)

        var temp2 = { action: temp.action, objectId: temp.objectId, name: temp.name };

        return JSON.stringify(temp2);
    }


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
            arrActions.push({ "action": "DONOTHING", "objectId": "", "name": "Do Nothing" })

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])




    return (
        <>
            {
                options.length > 0 && action
                && <Select name={action.name} value={JSON.stringify({ action: action.action, objectId: action.objectId })}
                    onChange={(e) => { onActionChange(e) }}
                    style={{ width: 370 }} >
                    {/* <MenuItem key={-1} value={JSON.stringify({ action: "", objectId: "" })}>--Select an Action --</MenuItem> */}
                    {
                        options.map((item, index) => {
                            if (item.section) {
                                return <ListSubheader key={index} >{item.section}</ListSubheader>
                            }
                            else {
                                return <MenuItem key={index} name={item.name} value={JSON.stringify({ action: item.action, objectId: item.objectId })}>{item.name}</MenuItem>
                            }
                        })
                    }
                </Select>}
            <br></br>
            {
                action && action.action === "PLAYRECORDING" && <Grid item xs={12} >
                    <FormLabel>Followup Action</FormLabel>
                </Grid>
            }
            {
                action && action.action === "PLAYRECORDING" &&
                <Grid item xs={12} >
                    {options && options.length > 0 && action.action === "PLAYRECORDING" && action2 && action2.action && <>

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
                </Grid>
            }
        </>
    );
}

