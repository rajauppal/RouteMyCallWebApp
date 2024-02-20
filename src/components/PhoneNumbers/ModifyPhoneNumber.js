import { FormLabel, Input, MenuItem, Select, TextField } from '@mui/material';
import { Grid } from '@mui/material';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { AudioFileClient, PhoneNumberClient, PhoneNumberUI } from '../../api/server';
import Action from './Action';
import { Link, useNavigate, useParams } from 'react-router-dom';
import MarketingMessages from '../Marketing/MarketingMessages';

export default function ModifyPhoneNumber() {

    let { currentPhoneNumberId } = useParams();
    const navigate = useNavigate();
    
    const [voicemailAudioId, setVoicemailAudioId] = useState("");
    const [audioFiles, setAudioFiles] = useState([]);

    const globalInfo = useSelector((state) => state.globalInfo)
    const [selectedAction, setSelectedAction] = useState("")

    const [ringTimeout, setRingTimeout] = useState(45)
    const [emailAddress, setEmailAddress] = useState("")
    const [timeZone, setTimeZone] = useState("Pacific Standard Time")

    const [phoneNumber, setPhoneNumber] = useState({});
    const [phoneNumberdDigits, setPhoneNumberDigits] = useState("");

    const [audioIds, setAudioIds] = useState([]); // useState('["b4a79154-dcb6-4b49-8995-00da90886d99","b3a5b5fe-cb6d-4a16-8d72-ace58da1ce02"]');

    const onClose = () =>{
        navigate('/phonenumbers')
    }

    /*
    function validateAndSetRingTimeout(value) {
        value = value.trim();
        if (!value) {
            return false;
        }
        value = value.replace(/^0+/, "") || "0";

        if (!Number.isNaN(value)) {
            if (Number.isInteger(Number(value))) {
                if (Number(value) > 0 && Number(value) < 1000){
                    setRingTimeout(Number(value))
                }
            }
        }
    }
    */

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    function isFormValid() {

        if (!validateEmail(emailAddress)) {
            return false;
        }

        if (!selectedAction) {
            return false;
        }

        if (!currentPhoneNumberId && !phoneNumberdDigits) {
            return false;
        }

        if (JSON.parse(selectedAction).action === "") {
            return false;
        }

        return true;
    }

    
    function save() {

        const client = new PhoneNumberClient(globalInfo.apiRoot, undefined, globalInfo.accessToken);
        if (currentPhoneNumberId) {
            var phoneNumberUI = new PhoneNumberUI();
            phoneNumberUI.phoneNumberId = currentPhoneNumberId;
            if(voicemailAudioId){
                phoneNumberUI.voicemailAudioId = voicemailAudioId;
            }
            
            phoneNumberUI.action = selectedAction;
            phoneNumberUI.ringTimeout = ringTimeout;
            phoneNumberUI.voicemailEmail = emailAddress;
            phoneNumberUI.timeZone = timeZone;
            phoneNumberUI.businessHours = "";
            phoneNumberUI.holidays = "";
            phoneNumberUI.phoneNumberDigits = "";
            phoneNumberUI.marketingMessages = (audioIds)

            client.updatePhoneNumber(currentPhoneNumberId,phoneNumberUI).then((data) => {
                onClose()
            })
        }
        else {
            client.addPhoneNumber(globalInfo.currentCompanyId, phoneNumberdDigits, selectedAction).then((data) => {
                onClose()
            })
        }
    }

    useEffect(() => {
        const client1 = new AudioFileClient(globalInfo.apiRoot, undefined, globalInfo.accessToken);
        const client2 = new PhoneNumberClient(globalInfo.apiRoot, undefined, globalInfo.accessToken);

        client1.getAudioFiles(globalInfo.currentCompanyId).then(
            (data) => {
                setAudioFiles(data);
            }
        )

        if (currentPhoneNumberId) {

            client2.getPhoneNumberById(currentPhoneNumberId).then((data) => {
                setPhoneNumber(data)
                setSelectedAction(data.action)
                setVoicemailAudioId(data.voicemailAudioId ?? "")
                
                setEmailAddress(data.voicemailEmail)
                setRingTimeout(data.ringTimeout)
                setTimeZone(data.timeZone)
                
                setAudioIds((data.marketingMessages))

            })
        } else {
            setPhoneNumber(null)
            setSelectedAction("")
            setVoicemailAudioId("")
        }
    }, [globalInfo, currentPhoneNumberId])

     return (
        <Grid container spacing={1} width={500}>
            <div style={{ padding: 20 }}>
                {!currentPhoneNumberId && <><Input value={phoneNumberdDigits} onChange={(e) => { setPhoneNumberDigits(e.target.value) }} style={{ width: 400 }} placeholder={"New Phone Number"}></Input> <br></br></>}

                <FormLabel>When {currentPhoneNumberId && phoneNumber && phoneNumber.phoneNumberDigits && <>{phoneNumber.phoneNumberDigits.getFormattedPhoneNum()} </>} is called <br /></FormLabel>
                <Link variant='contained' component={Link} to={`/holidays/${phoneNumber.phoneNumberId}`}>Play Holiday/Greeting Messages followed by</Link> &nbsp; &nbsp;
                
                <br></br>

                <Action selectedOption={selectedAction} setSelectedOption={setSelectedAction}></Action>    <br></br>
                <br></br>
                <FormLabel>Voicemail Audio: <br></br></FormLabel>
                <Select fullWidth={true}
                    value={voicemailAudioId}
                    onChange={e => setVoicemailAudioId(e.target.value)}>
                    <MenuItem key={-1} value={""}>&nbsp;</MenuItem>
                    {
                        audioFiles.map((item, index) => {
                            return <MenuItem key={index} value={item.audioFileId}>{item.name}</MenuItem>
                        })
                    }

                </Select>
                <br></br>
                <br></br>
                <FormLabel>Voicemail Email Address:</FormLabel>
                <br></br>
                <TextField fullWidth={true} value={emailAddress} onChange={(e) => { setEmailAddress(e.target.value) }} ></TextField>
                <br></br>
                <br></br>
                <FormLabel>Marketing Messages (Select 1 or more, will play in random order): </FormLabel>
                <br></br>
                    <MarketingMessages audioIds={audioIds} setAudioIds={setAudioIds}></MarketingMessages>
                <br></br>
                <br></br>
                {/*<FormLabel>Call Transfer Ring Timeout (before Voicemail):</FormLabel>
                <br></br>
                 <TextField fullWidth={true} value={ringTimeout} onChange={(e) => { validateAndSetRingTimeout(e.target.value) }}></TextField>
                <br></br><br></br> */}
                <FormLabel>Timezone:</FormLabel>
                <Select fullWidth={true}
                    value={timeZone}
                    onChange={e => setTimeZone(e.target.value)}>

                    <MenuItem key={"Dateline Standard Time"} value={"Dateline Standard Time"}>Dateline Standard Time</MenuItem>
                    <MenuItem key={"UTC-11"} value={"UTC-11"}>UTC-11</MenuItem>
                    <MenuItem key={"Aleutian Standard Time"} value={"Aleutian Standard Time"}>Aleutian Standard Time</MenuItem>
                    <MenuItem key={"Hawaiian Standard Time"} value={"Hawaiian Standard Time"}>Hawaiian Standard Time</MenuItem>
                    <MenuItem key={"Marquesas Standard Time"} value={"Marquesas Standard Time"}>Marquesas Standard Time</MenuItem>
                    <MenuItem key={"Alaskan Standard Time"} value={"Alaskan Standard Time"}>Alaskan Standard Time</MenuItem>
                    <MenuItem key={"UTC-09"} value={"UTC-09"}>UTC-09</MenuItem>
                    <MenuItem key={"Pacific Standard Time (Mexico)"} value={"Pacific Standard Time (Mexico)"}>Pacific Standard Time (Mexico)</MenuItem>
                    <MenuItem key={"UTC-08"} value={"UTC-08"}>UTC-08</MenuItem>
                    <MenuItem key={"Pacific Standard Time"} value={"Pacific Standard Time"}>Pacific Standard Time</MenuItem>
                    <MenuItem key={"US Mountain Standard Time"} value={"US Mountain Standard Time"}>US Mountain Standard Time</MenuItem>
                    <MenuItem key={"Mountain Standard Time (Mexico)"} value={"Mountain Standard Time (Mexico)"}>Mountain Standard Time (Mexico)</MenuItem>
                    <MenuItem key={"Mountain Standard Time"} value={"Mountain Standard Time"}>Mountain Standard Time</MenuItem>
                    <MenuItem key={"Yukon Standard Time"} value={"Yukon Standard Time"}>Yukon Standard Time</MenuItem>
                    <MenuItem key={"Central America Standard Time"} value={"Central America Standard Time"}>Central America Standard Time</MenuItem>
                    <MenuItem key={"Central Standard Time"} value={"Central Standard Time"}>Central Standard Time</MenuItem>
                    <MenuItem key={"Easter Island Standard Time"} value={"Easter Island Standard Time"}>Easter Island Standard Time</MenuItem>
                    <MenuItem key={"Central Standard Time (Mexico)"} value={"Central Standard Time (Mexico)"}>Central Standard Time (Mexico)</MenuItem>
                    <MenuItem key={"Canada Central Standard Time"} value={"Canada Central Standard Time"}>Canada Central Standard Time</MenuItem>
                    <MenuItem key={"SA Pacific Standard Time"} value={"SA Pacific Standard Time"}>SA Pacific Standard Time</MenuItem>
                    <MenuItem key={"Eastern Standard Time (Mexico)"} value={"Eastern Standard Time (Mexico)"}>Eastern Standard Time (Mexico)</MenuItem>
                    <MenuItem key={"Eastern Standard Time"} value={"Eastern Standard Time"}>Eastern Standard Time</MenuItem>
                    <MenuItem key={"Haiti Standard Time"} value={"Haiti Standard Time"}>Haiti Standard Time</MenuItem>
                    <MenuItem key={"Cuba Standard Time"} value={"Cuba Standard Time"}>Cuba Standard Time</MenuItem>
                    <MenuItem key={"US Eastern Standard Time"} value={"US Eastern Standard Time"}>US Eastern Standard Time</MenuItem>
                    <MenuItem key={"Turks And Caicos Standard Time"} value={"Turks And Caicos Standard Time"}>Turks And Caicos Standard Time</MenuItem>
                    <MenuItem key={"Paraguay Standard Time"} value={"Paraguay Standard Time"}>Paraguay Standard Time</MenuItem>
                    <MenuItem key={"Atlantic Standard Time"} value={"Atlantic Standard Time"}>Atlantic Standard Time</MenuItem>
                    <MenuItem key={"Venezuela Standard Time"} value={"Venezuela Standard Time"}>Venezuela Standard Time</MenuItem>
                    <MenuItem key={"Central Brazilian Standard Time"} value={"Central Brazilian Standard Time"}>Central Brazilian Standard Time</MenuItem>
                    <MenuItem key={"SA Western Standard Time"} value={"SA Western Standard Time"}>SA Western Standard Time</MenuItem>
                    <MenuItem key={"Pacific SA Standard Time"} value={"Pacific SA Standard Time"}>Pacific SA Standard Time</MenuItem>
                    <MenuItem key={"Newfoundland Standard Time"} value={"Newfoundland Standard Time"}>Newfoundland Standard Time</MenuItem>
                    <MenuItem key={"Tocantins Standard Time"} value={"Tocantins Standard Time"}>Tocantins Standard Time</MenuItem>
                    <MenuItem key={"E. South America Standard Time"} value={"E. South America Standard Time"}>E. South America Standard Time</MenuItem>
                    <MenuItem key={"SA Eastern Standard Time"} value={"SA Eastern Standard Time"}>SA Eastern Standard Time</MenuItem>
                    <MenuItem key={"Argentina Standard Time"} value={"Argentina Standard Time"}>Argentina Standard Time</MenuItem>
                    <MenuItem key={"Greenland Standard Time"} value={"Greenland Standard Time"}>Greenland Standard Time</MenuItem>
                    <MenuItem key={"Montevideo Standard Time"} value={"Montevideo Standard Time"}>Montevideo Standard Time</MenuItem>
                    <MenuItem key={"Magallanes Standard Time"} value={"Magallanes Standard Time"}>Magallanes Standard Time</MenuItem>
                    <MenuItem key={"Saint Pierre Standard Time"} value={"Saint Pierre Standard Time"}>Saint Pierre Standard Time</MenuItem>
                    <MenuItem key={"Bahia Standard Time"} value={"Bahia Standard Time"}>Bahia Standard Time</MenuItem>
                    <MenuItem key={"UTC-02"} value={"UTC-02"}>UTC-02</MenuItem>
                    <MenuItem key={"Mid-Atlantic Standard Time"} value={"Mid-Atlantic Standard Time"}>Mid-Atlantic Standard Time</MenuItem>
                    <MenuItem key={"Azores Standard Time"} value={"Azores Standard Time"}>Azores Standard Time</MenuItem>
                    <MenuItem key={"Cape Verde Standard Time"} value={"Cape Verde Standard Time"}>Cape Verde Standard Time</MenuItem>
                    <MenuItem key={"UTC"} value={"UTC"}>UTC</MenuItem>
                    <MenuItem key={"GMT Standard Time"} value={"GMT Standard Time"}>GMT Standard Time</MenuItem>
                    <MenuItem key={"Greenwich Standard Time"} value={"Greenwich Standard Time"}>Greenwich Standard Time</MenuItem>
                    <MenuItem key={"Sao Tome Standard Time"} value={"Sao Tome Standard Time"}>Sao Tome Standard Time</MenuItem>
                    <MenuItem key={"Morocco Standard Time"} value={"Morocco Standard Time"}>Morocco Standard Time</MenuItem>
                    <MenuItem key={"W. Europe Standard Time"} value={"W. Europe Standard Time"}>W. Europe Standard Time</MenuItem>
                    <MenuItem key={"Central Europe Standard Time"} value={"Central Europe Standard Time"}>Central Europe Standard Time</MenuItem>
                    <MenuItem key={"Romance Standard Time"} value={"Romance Standard Time"}>Romance Standard Time</MenuItem>
                    <MenuItem key={"Central European Standard Time"} value={"Central European Standard Time"}>Central European Standard Time</MenuItem>
                    <MenuItem key={"W. Central Africa Standard Time"} value={"W. Central Africa Standard Time"}>W. Central Africa Standard Time</MenuItem>
                    <MenuItem key={"GTB Standard Time"} value={"GTB Standard Time"}>GTB Standard Time</MenuItem>
                    <MenuItem key={"Middle East Standard Time"} value={"Middle East Standard Time"}>Middle East Standard Time</MenuItem>
                    <MenuItem key={"Egypt Standard Time"} value={"Egypt Standard Time"}>Egypt Standard Time</MenuItem>
                    <MenuItem key={"E. Europe Standard Time"} value={"E. Europe Standard Time"}>E. Europe Standard Time</MenuItem>
                    <MenuItem key={"Syria Standard Time"} value={"Syria Standard Time"}>Syria Standard Time</MenuItem>
                    <MenuItem key={"West Bank Standard Time"} value={"West Bank Standard Time"}>West Bank Standard Time</MenuItem>
                    <MenuItem key={"South Africa Standard Time"} value={"South Africa Standard Time"}>South Africa Standard Time</MenuItem>
                    <MenuItem key={"FLE Standard Time"} value={"FLE Standard Time"}>FLE Standard Time</MenuItem>
                    <MenuItem key={"Israel Standard Time"} value={"Israel Standard Time"}>Israel Standard Time</MenuItem>
                    <MenuItem key={"South Sudan Standard Time"} value={"South Sudan Standard Time"}>South Sudan Standard Time</MenuItem>
                    <MenuItem key={"Kaliningrad Standard Time"} value={"Kaliningrad Standard Time"}>Kaliningrad Standard Time</MenuItem>
                    <MenuItem key={"Sudan Standard Time"} value={"Sudan Standard Time"}>Sudan Standard Time</MenuItem>
                    <MenuItem key={"Libya Standard Time"} value={"Libya Standard Time"}>Libya Standard Time</MenuItem>
                    <MenuItem key={"Namibia Standard Time"} value={"Namibia Standard Time"}>Namibia Standard Time</MenuItem>
                    <MenuItem key={"Jordan Standard Time"} value={"Jordan Standard Time"}>Jordan Standard Time</MenuItem>
                    <MenuItem key={"Arabic Standard Time"} value={"Arabic Standard Time"}>Arabic Standard Time</MenuItem>
                    <MenuItem key={"Turkey Standard Time"} value={"Turkey Standard Time"}>Turkey Standard Time</MenuItem>
                    <MenuItem key={"Arab Standard Time"} value={"Arab Standard Time"}>Arab Standard Time</MenuItem>
                    <MenuItem key={"Belarus Standard Time"} value={"Belarus Standard Time"}>Belarus Standard Time</MenuItem>
                    <MenuItem key={"Russian Standard Time"} value={"Russian Standard Time"}>Russian Standard Time</MenuItem>
                    <MenuItem key={"E. Africa Standard Time"} value={"E. Africa Standard Time"}>E. Africa Standard Time</MenuItem>
                    <MenuItem key={"Volgograd Standard Time"} value={"Volgograd Standard Time"}>Volgograd Standard Time</MenuItem>
                    <MenuItem key={"Iran Standard Time"} value={"Iran Standard Time"}>Iran Standard Time</MenuItem>
                    <MenuItem key={"Arabian Standard Time"} value={"Arabian Standard Time"}>Arabian Standard Time</MenuItem>
                    <MenuItem key={"Astrakhan Standard Time"} value={"Astrakhan Standard Time"}>Astrakhan Standard Time</MenuItem>
                    <MenuItem key={"Azerbaijan Standard Time"} value={"Azerbaijan Standard Time"}>Azerbaijan Standard Time</MenuItem>
                    <MenuItem key={"Russia Time Zone 3"} value={"Russia Time Zone 3"}>Russia Time Zone 3</MenuItem>
                    <MenuItem key={"Mauritius Standard Time"} value={"Mauritius Standard Time"}>Mauritius Standard Time</MenuItem>
                    <MenuItem key={"Saratov Standard Time"} value={"Saratov Standard Time"}>Saratov Standard Time</MenuItem>
                    <MenuItem key={"Georgian Standard Time"} value={"Georgian Standard Time"}>Georgian Standard Time</MenuItem>
                    <MenuItem key={"Caucasus Standard Time"} value={"Caucasus Standard Time"}>Caucasus Standard Time</MenuItem>
                    <MenuItem key={"Afghanistan Standard Time"} value={"Afghanistan Standard Time"}>Afghanistan Standard Time</MenuItem>
                    <MenuItem key={"West Asia Standard Time"} value={"West Asia Standard Time"}>West Asia Standard Time</MenuItem>
                    <MenuItem key={"Ekaterinburg Standard Time"} value={"Ekaterinburg Standard Time"}>Ekaterinburg Standard Time</MenuItem>
                    <MenuItem key={"Pakistan Standard Time"} value={"Pakistan Standard Time"}>Pakistan Standard Time</MenuItem>
                    <MenuItem key={"Qyzylorda Standard Time"} value={"Qyzylorda Standard Time"}>Qyzylorda Standard Time</MenuItem>
                    <MenuItem key={"India Standard Time"} value={"India Standard Time"}>India Standard Time</MenuItem>
                    <MenuItem key={"Sri Lanka Standard Time"} value={"Sri Lanka Standard Time"}>Sri Lanka Standard Time</MenuItem>
                    <MenuItem key={"Nepal Standard Time"} value={"Nepal Standard Time"}>Nepal Standard Time</MenuItem>
                    <MenuItem key={"Central Asia Standard Time"} value={"Central Asia Standard Time"}>Central Asia Standard Time</MenuItem>
                    <MenuItem key={"Bangladesh Standard Time"} value={"Bangladesh Standard Time"}>Bangladesh Standard Time</MenuItem>
                    <MenuItem key={"Omsk Standard Time"} value={"Omsk Standard Time"}>Omsk Standard Time</MenuItem>
                    <MenuItem key={"Myanmar Standard Time"} value={"Myanmar Standard Time"}>Myanmar Standard Time</MenuItem>
                    <MenuItem key={"SE Asia Standard Time"} value={"SE Asia Standard Time"}>SE Asia Standard Time</MenuItem>
                    <MenuItem key={"Altai Standard Time"} value={"Altai Standard Time"}>Altai Standard Time</MenuItem>
                    <MenuItem key={"W. Mongolia Standard Time"} value={"W. Mongolia Standard Time"}>W. Mongolia Standard Time</MenuItem>
                    <MenuItem key={"North Asia Standard Time"} value={"North Asia Standard Time"}>North Asia Standard Time</MenuItem>
                    <MenuItem key={"N. Central Asia Standard Time"} value={"N. Central Asia Standard Time"}>N. Central Asia Standard Time</MenuItem>
                    <MenuItem key={"Tomsk Standard Time"} value={"Tomsk Standard Time"}>Tomsk Standard Time</MenuItem>
                    <MenuItem key={"China Standard Time"} value={"China Standard Time"}>China Standard Time</MenuItem>
                    <MenuItem key={"North Asia East Standard Time"} value={"North Asia East Standard Time"}>North Asia East Standard Time</MenuItem>
                    <MenuItem key={"Singapore Standard Time"} value={"Singapore Standard Time"}>Singapore Standard Time</MenuItem>
                    <MenuItem key={"W. Australia Standard Time"} value={"W. Australia Standard Time"}>W. Australia Standard Time</MenuItem>
                    <MenuItem key={"Taipei Standard Time"} value={"Taipei Standard Time"}>Taipei Standard Time</MenuItem>
                    <MenuItem key={"Ulaanbaatar Standard Time"} value={"Ulaanbaatar Standard Time"}>Ulaanbaatar Standard Time</MenuItem>
                    <MenuItem key={"Aus Central W. Standard Time"} value={"Aus Central W. Standard Time"}>Aus Central W. Standard Time</MenuItem>
                    <MenuItem key={"Transbaikal Standard Time"} value={"Transbaikal Standard Time"}>Transbaikal Standard Time</MenuItem>
                    <MenuItem key={"Tokyo Standard Time"} value={"Tokyo Standard Time"}>Tokyo Standard Time</MenuItem>
                    <MenuItem key={"North Korea Standard Time"} value={"North Korea Standard Time"}>North Korea Standard Time</MenuItem>
                    <MenuItem key={"Korea Standard Time"} value={"Korea Standard Time"}>Korea Standard Time</MenuItem>
                    <MenuItem key={"Yakutsk Standard Time"} value={"Yakutsk Standard Time"}>Yakutsk Standard Time</MenuItem>
                    <MenuItem key={"Cen. Australia Standard Time"} value={"Cen. Australia Standard Time"}>Cen. Australia Standard Time</MenuItem>
                    <MenuItem key={"AUS Central Standard Time"} value={"AUS Central Standard Time"}>AUS Central Standard Time</MenuItem>
                    <MenuItem key={"E. Australia Standard Time"} value={"E. Australia Standard Time"}>E. Australia Standard Time</MenuItem>
                    <MenuItem key={"AUS Eastern Standard Time"} value={"AUS Eastern Standard Time"}>AUS Eastern Standard Time</MenuItem>
                    <MenuItem key={"West Pacific Standard Time"} value={"West Pacific Standard Time"}>West Pacific Standard Time</MenuItem>
                    <MenuItem key={"Tasmania Standard Time"} value={"Tasmania Standard Time"}>Tasmania Standard Time</MenuItem>
                    <MenuItem key={"Vladivostok Standard Time"} value={"Vladivostok Standard Time"}>Vladivostok Standard Time</MenuItem>
                    <MenuItem key={"Lord Howe Standard Time"} value={"Lord Howe Standard Time"}>Lord Howe Standard Time</MenuItem>
                    <MenuItem key={"Bougainville Standard Time"} value={"Bougainville Standard Time"}>Bougainville Standard Time</MenuItem>
                    <MenuItem key={"Russia Time Zone 10"} value={"Russia Time Zone 10"}>Russia Time Zone 10</MenuItem>
                    <MenuItem key={"Magadan Standard Time"} value={"Magadan Standard Time"}>Magadan Standard Time</MenuItem>
                    <MenuItem key={"Norfolk Standard Time"} value={"Norfolk Standard Time"}>Norfolk Standard Time</MenuItem>
                    <MenuItem key={"Sakhalin Standard Time"} value={"Sakhalin Standard Time"}>Sakhalin Standard Time</MenuItem>
                    <MenuItem key={"Central Pacific Standard Time"} value={"Central Pacific Standard Time"}>Central Pacific Standard Time</MenuItem>
                    <MenuItem key={"Russia Time Zone 11"} value={"Russia Time Zone 11"}>Russia Time Zone 11</MenuItem>
                    <MenuItem key={"New Zealand Standard Time"} value={"New Zealand Standard Time"}>New Zealand Standard Time</MenuItem>
                    <MenuItem key={"UTC+12"} value={"UTC+12"}>UTC+12</MenuItem>
                    <MenuItem key={"Fiji Standard Time"} value={"Fiji Standard Time"}>Fiji Standard Time</MenuItem>
                    <MenuItem key={"Kamchatka Standard Time"} value={"Kamchatka Standard Time"}>Kamchatka Standard Time</MenuItem>
                    <MenuItem key={"Chatham Islands Standard Time"} value={"Chatham Islands Standard Time"}>Chatham Islands Standard Time</MenuItem>
                    <MenuItem key={"UTC+13"} value={"UTC+13"}>UTC+13</MenuItem>
                    <MenuItem key={"Tonga Standard Time"} value={"Tonga Standard Time"}>Tonga Standard Time</MenuItem>
                    <MenuItem key={"Samoa Standard Time"} value={"Samoa Standard Time"}>Samoa Standard Time</MenuItem>
                    <MenuItem key={"Line Islands Standard Time"} value={"Line Islands Standard Time"}>Line Islands Standard Time</MenuItem>
                </Select>

                <br></br><br></br>

                <Button variant='outlined' disabled={!isFormValid()} onClick={() => { save() }}>Save</Button> &nbsp;&nbsp;
                <Button variant="outlined" onClick={() => { onClose() }}>Close</Button>
            </div>
        </Grid>
    )
}
