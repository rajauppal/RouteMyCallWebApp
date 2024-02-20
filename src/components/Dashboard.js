import { Box, Button, Grid,  ListItemButton, ListItemText, } from '@mui/material'
import { useState } from 'react';
import { useSelector } from 'react-redux'
import { Routes, Route, Outlet, Link, useLocation, HashRouter } from "react-router-dom";
import Companies from '../admin/Companies'
import Users from '../admin/Users'
import AudioFiles from './AudioFiles/AudioFiles'
import Extensions from './Extensions/Extensions'
import IVRMenus from './Menus/IVRMenus'
import CallRoutingRules from './Misc/CallRoutingRules'
import PhoneNumbers from './PhoneNumbers/PhoneNumbers'
import Recordings from './Recordings/Recordings'
import Holidays from './Misc/Holidays';
import BusinessHours from './Misc/BusinessHours';
import ModifyPhoneNumber from './PhoneNumbers/ModifyPhoneNumber';
import ModifyMenu from './Menus/ModifyMenu';
import ModifyExtension from './Extensions/ModifyExtension';
import Upload from './AudioFiles/Upload';
import ModifyAudioFile from './AudioFiles/ModifyAudioFile';
import TextToAudio from './AudioFiles/TextToAudio';
import EditRule from './Misc/EditRule';
import EditDtf from './Menus/EditDtf';
import AddMenu from './Menus/AddMenu';
import CallHistory from './CallHistory/CallHistory';
import GlobalAudioFiles from './AudioFiles/GlobalAudioFiles';
import TelnyxWebRTCComponent from './Home/TelnyxWebRTCComponent';
import Billing from './Billing/Billing';

const LinkList = (props) => {
    
    const location = useLocation();
    const globalInfo = useSelector((state) => state.globalInfo)

    return (
        <div>
            <ListItemButton onClick={()=>{props.setOpen(false)}} component={Link} to={"phonenumbers"}
                selected={location.pathname === "/phonenumbers" 
                || location.pathname.includes("editphonenumber")
                || location.pathname.includes("businesshours")
                || location.pathname.includes("holidays")
                || location.pathname === "/"}
            >
                <ListItemText primary={"My Phone Numbers"} />
            </ListItemButton>
            <ListItemButton onClick={()=>{props.setOpen(false)}} component={Link} to={"ivr"}
                selected={location.pathname === "/ivr"
            ||    location.pathname.includes("editMenu")
            ||    location.pathname.includes("addMenu")
            }
            >
                <ListItemText primary={"IVR Menus"} />
            </ListItemButton>
            <ListItemButton onClick={()=>{props.setOpen(false)}}  component={Link} to={"audiofiles"}
                selected={location.pathname === "/audiofiles"
                || location.pathname.includes("addTextToAudio")
                || location.pathname.includes("editAudioName")
                || location.pathname.includes("editTextToAudio")
            }
            >
                <ListItemText primary={"Audio Library"} />
            </ListItemButton>
            
            {globalInfo.isAdministrator && <ListItemButton onClick={()=>{props.setOpen(false)}} component={Link} to={"extensions"}
                selected={location.pathname === "/extensions"
                ||location.pathname.includes( "addextension")
                ||location.pathname.includes( "editextension")
            }
            >
                <ListItemText primary={"Extensions"} />
            </ListItemButton>
            }

            <ListItemButton onClick={()=>{props.setOpen(false)}} component={Link} to={"rules"}
                selected={location.pathname === "/rules"
                ||location.pathname === "/addrule"
                ||location.pathname.includes( "editrule")
            }
            >
                <ListItemText primary={"Smart Rules"} />
            </ListItemButton>
            <ListItemButton component={Link} ></ListItemButton>
            <ListItemButton component={Link} ></ListItemButton>
            <ListItemButton onClick={()=>{props.setOpen(false)}} component={Link} to={"voicemails"}
                selected={location.pathname === "/voicemails"}
            >
                <ListItemText primary={"Voicemail"} />
            </ListItemButton>
            <ListItemButton onClick={()=>{props.setOpen(false)}} component={Link} to={"callhistory"}
                selected={location.pathname === "/callhistory"}
            >
                <ListItemText primary={"Call History"} /> 
            </ListItemButton>
            {globalInfo.currentCompanyId && globalInfo.accessToken && globalInfo.isAdministrator &&
                <ListItemButton onClick={()=>{props.setOpen(false)}} component={Link} to={"users"}
                    selected={location.pathname === "/users"}
                >
                    <ListItemText primary={"Users"} />
                </ListItemButton>
            }
            {globalInfo.currentCompanyId && globalInfo.accessToken && globalInfo.isAdministrator &&
                <ListItemButton onClick={()=>{props.setOpen(false)}} component={Link} to={"companies"}
                    selected={location.pathname === "/companies"}
                >
                    <ListItemText primary={"Companies"} />
                </ListItemButton>
            }
            {globalInfo.currentCompanyId && globalInfo.accessToken && globalInfo.isAdministrator &&
                <ListItemButton onClick={()=>{props.setOpen(false)}} component={Link} to={"billing"}
                    selected={location.pathname === "/billing"}
                >
                    <ListItemText primary={"Billing"} />
                </ListItemButton>
            }
           
        </div>
    )
}

const Layout = () => {
    const [open, setOpen] = useState(false);

    function toggle() {
        setOpen(!open)
    }
    return (
        <>
            <Box sx={{ display: { xs: "block", md: "none" } }}>
                 <Button variant="outlined" size="small" onClick={() => toggle()}>Menu</Button>
                <div style={{ display: open ? "block" : "none" }}>
                    <LinkList setOpen={setOpen} open={open}></LinkList>
                </div>

            </Box>
            <Grid container spacing={2} >

                <Grid item xs={2}>
                    <Box sx={{ display: { xs: "none", md: "block" } }}>
                        <LinkList  setOpen={()=>{}} open={open}></LinkList>
                    </Box>
                </Grid>
                <Grid item xs={12} md={10} >
                    <div>
                        <Outlet />
                    </div>
                    
                </Grid>

            </Grid>
        </>
    )
}

const Dashboard = () => {

    return (

        <HashRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<PhoneNumbers />} />
                    <Route path="/voicemails" element={<Recordings />} />
                    <Route path="/phonenumbers" element={<PhoneNumbers />} />
                    <Route path="/companies" element={<Companies />} />
                    <Route path="/ivr" element={<IVRMenus />} />
                    <Route path="/extensions" element={<Extensions />} />
                    <Route path="/rules" element={<CallRoutingRules />} />
                    <Route path="/audiofiles" element={<AudioFiles />} />
                    <Route path="/globalaudiofiles" element={<GlobalAudioFiles />} />
                    <Route path="/companies" element={<Companies />} />
                    <Route path="/billing" element={<Billing />} />
                    <Route path="/callhistory" element={<CallHistory />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/businesshours/:currentPhoneNumberId" element={<BusinessHours />} />
                    <Route path="/holidays/:currentPhoneNumberId" element={<Holidays />} />
                    <Route path="/webrtc/:currentPhoneNumberId" element={<TelnyxWebRTCComponent></TelnyxWebRTCComponent>} />
                    <Route path="/editPhoneNumber/:currentPhoneNumberId" element={<ModifyPhoneNumber />} />
                    <Route path="/addPhoneNumber" element={<ModifyPhoneNumber />} />
                    <Route path="/editMenu/:currentMenuId" element={<ModifyMenu />} />
                    <Route path="/addMenu" element={<AddMenu />} />
                    <Route path="/editExtension/:currentExtensionId" element={<ModifyExtension />} />
                    <Route path="/addextension" element={<ModifyExtension />} />


                    <Route path="/editAudioName/:currentAudioFileId" element={<ModifyAudioFile />} />

                    <Route path="/addAudioFile" element={<Upload />} />
                    <Route path="/editAudioFile/:currentAudioFileId" element={<Upload />} />

                    <Route path="/addTextToAudio" element={<TextToAudio />} />
                    <Route path="/editTextToAudio/:currentAudioFileId" element={<TextToAudio />} />

                    <Route path="/addRule" element={<EditRule />} />
                    <Route path="/editRule/:currentRuleId" element={<EditRule />} />

                    <Route path="/editDtf" element={<EditDtf />} />


                </Route>
            </Routes>
        </HashRouter>


    )
}

export default Dashboard