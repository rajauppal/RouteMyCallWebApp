import { useEffect, useState } from "react";
import { Button, Card, Grid } from "@mui/material";
import { useSelector } from "react-redux";
import { AudioFileClient, ExtensionClient, MenuClient, RuleClient } from "../../api/server";
import { Link } from "react-router-dom";

export default function DTF(props) {
    const { actionValues, currentMenuId } = props;

    const [isLoading, setIsLoading] = useState(true);

    const [actions, setActions] = useState([]);
    const globalInfo = useSelector((state) => state.globalInfo)

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

            var tempActions = [];

            tempActions.push({ action: "DONOTHING", name: "Do Nothing", objectId: "" })

            extensions.forEach(extension => {
                tempActions.push({ name: `Transfer Call To ${extension.name}`, value: `GOTOEXTENSION-${extension.extensionId}`, action: `GOTOEXTENSION`, objectId: extension.extensionId })
            });

            menus.forEach(menu => {
                tempActions.push({ name: "Go To " + menu.menuName, value: `GOTOMENU-${menu.menuId}`, action: `GOTOMENU`, objectId: menu.menuId })
            });

            rules.forEach(rule => {
                tempActions.push({ name: "Run Rule " + rule.ruleName, value: `EXECUTERULE-${rule.ruleId}`, action: `EXECUTERULE`, objectId: rule.ruleId })
            });

            audioFiles.forEach(audio => {
                tempActions.push({ name: "Play Audio File " + audio.name, value: `PLAYRECORDING-${audio.audioFileId}`, action: `PLAYRECORDING`, objectId: audio.audioFileId })
            });

            tempActions.push({ name: "Hangup", value: "Hangup", action: "HANGUP", objectId: "" })
            tempActions.push({ name: "Transfer To Voicemail", value: "Voicemail", action: "VOICEMAIL", objectId: "" })

            setActions(tempActions)

            setIsLoading(false);
        })

        setActions([])
    }, [globalInfo])

    function getActionName(action) {
        var final =  actions.filter((item) => {
            return JSON.stringify({ action: action.action, objectId: action.objectId }) === JSON.stringify({ action: item.action, objectId: item.objectId })
        })[0]?.name;

        if(final){
            return final;
        }
        else {
            return "Do Nothing"
        }
    }

    return (
        <>

            {!isLoading && actionValues.length > 0 && actions.length > 0 && <div>
                <Grid container spacing={2}>
                    {
                        actionValues.map((action, index) => {
                            return <Grid container key={index} item xs={12} sm={6} md={4} >
                                <Card variant="outlined" style={{  paddingBottom:10, paddingLeft: 10,width:"100%" }}>                                    
                                        <Grid container item xs={12} >
                                            <Grid item xs={10} >
                                                <h3>When {(action.name)} is Pressed<br></br></h3>
                                                <>Action: <br/></>
                                                <strong>
                                                {
                                                    getActionName(action)
                                                }
                                                </strong>
                                                <br></br>
                                                {
                                                    action.followupAction &&
                                                    <>
                                                        <br></br>

                                                        <>Followup Action: <br/> </>
                                                        <strong>
                                                        {
                                                            getActionName(action.followupAction)
                                                        }
                                                        </strong>
                                                        <br></br>
                                                    </>
                                                }
                                                <br></br>
                                                <Button variant="contained" component={Link} state={{ "actionValues": actionValues, currentMenuId: currentMenuId, action: action }} to={{ "pathname": `/editDtf` }}> Modify</Button>
                                            </Grid>
                                            <Grid xs={2}
                                                item
                                                container
                                                direction="row"
                                                alignItems="center"
                                                justifyContent="center"
                                            >
                                                <span style={{ fontSize: 50 }}>{(action.name)}</span>

                                            </Grid>



                                        </Grid>
                                </Card>
                            </Grid>
                        }
                        )
                    }

                </Grid>
            </div>}
        </>
    );
}

