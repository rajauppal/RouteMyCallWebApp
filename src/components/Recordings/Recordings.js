import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { RecordingClient } from '../../api/server';

export default function Recordings() {
    const [voicemails, setVoicemails] = useState([])
    const globalInfo = useSelector((state) => state.globalInfo)


    function deleteRecording(recordingId) {
        const client = new RecordingClient(globalInfo.apiRoot, undefined, globalInfo.accessToken);

        client.deleteVoicemail(recordingId).then((data) => {
            reload()
        })

    }
    function reload() {
        const client = new RecordingClient(globalInfo.apiRoot, undefined, globalInfo.accessToken);

        client.getVoiceMails(globalInfo.currentCompanyId).then((data) => {
            setVoicemails(data)
        })
    }

    function convertUTCDateToLocalDate(date) {
        var newDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
        return newDate;
    }

    useEffect(() => {
        if (globalInfo.accessToken) {
            reload();
        }
        // eslint-disable-next-line
    }, [globalInfo.accessToken, globalInfo.apiRoot, globalInfo.currentCompanyId])



    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Date/Time</TableCell>
                        <TableCell>From Number</TableCell>
                        <TableCell>To Number</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {voicemails.map((row) => (
                        <TableRow
                            key={row.recordingId.toString()}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {/* (new Date(row.createdDateTime)) */}
                                {convertUTCDateToLocalDate(row.createdDateTime).toDateString()} {(convertUTCDateToLocalDate(row.createdDateTime)).toLocaleTimeString()} <br></br>
                                <figure style={{ marginLeft: -10 }}>
                                    <audio
                                        controls
                                        src={row.recordingUrl}>
                                        <a href={row.recordingUrl}>
                                            Download audio
                                        </a>
                                    </audio>
                                </figure>
                            </TableCell>
                            <TableCell component="th" scope="row">
                                {row.fromPhoneNumberDigits.getFormattedPhoneNum()}
                            </TableCell>
                            <TableCell component="th" scope="row">
                            {(row.toPhoneNumberDigits.getFormattedPhoneNum())}
                            </TableCell>
                            <TableCell component="th" scope="row">
                                <Button variant='outlined' onClick={() => deleteRecording(row.recordingId)}>Delete</Button>
                            </TableCell>

                        </TableRow>
                    ))}
                </TableBody>
            </Table>            
        </TableContainer>)
}
