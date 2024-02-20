import { Button, CircularProgress, FormControlLabel, LinearProgress, Paper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { HolidayClient } from '../../api/server';
import { useParams } from 'react-router-dom';

function GlobalHolidays(props) {
    const globalInfo = useSelector((state) => state.globalInfo)
    const [holidays, setHolidays] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let { currentPhoneNumberId } = useParams();

    function optInHoliday(globalHolidayId){
        const client = new HolidayClient(globalInfo.apiRoot, undefined, globalInfo.accessToken);
        client.optInHoliday(globalHolidayId, currentPhoneNumberId).then(()=>{
            props.onReload();
        })
    }
    
    function subscribeToHoliday(holidayId, flag){
        setIsLoading(true)
        const client = new HolidayClient(globalInfo.apiRoot, undefined, globalInfo.accessToken);
        if(flag){
            client.subscribeToHoliday(currentPhoneNumberId, holidayId).then((data)=>{setHolidays(data);setIsLoading(false);})
        }
        else{
            client.unsubscribeFromHoliday(currentPhoneNumberId, holidayId).then((data)=>{setHolidays(data);setIsLoading(false);})
        }
    }

    function getUrl(path) {
        if (path.startsWith("https")) {
          return path
        }
        return globalInfo.apiRoot + "/" + path;
      }

      
    useEffect(() => {
        function reload() {
            const client = new HolidayClient(globalInfo.apiRoot, undefined, globalInfo.accessToken);
    
            client.getGlobalHolidaysByPhoneNumber(currentPhoneNumberId).then((data) => {
                setHolidays(data)
            })
        }

        reload();
    }, [globalInfo])


    return (
        <div>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow><TableCell colSpan={5}>
                            <h1>Global Holidays/Greetings</h1>
                        </TableCell>
                        </TableRow>

                    </TableHead>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                Store Closed?
                            </TableCell>
                            <TableCell>
                                Date
                            </TableCell>
                            <TableCell>
                                Name
                            </TableCell>
                            <TableCell>
                                Audio
                            </TableCell>
                            <TableCell>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {holidays.map((row, index) => (
                            <React.Fragment key={row.holidayId}>
                                <TableRow >
                                    <TableCell>
                                        {row.isBusinessClosed ? "Yes" : "No"}
                                    </TableCell>
                                    <TableCell>
                                        {
                                            (new Date(row.fromDate.toString())).toLocaleDateString("en-us", options)
                                        }
                                        {
                                            row.fromDate.toString() !== row.toDate.toString() && <>&nbsp; To &nbsp;
                                                {
                                                    (new Date(row.toDate.toString())).toLocaleDateString("en-us", options)
                                                }
                                            </>
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {row.holidayName}
                                    </TableCell>
                                    <TableCell> 
                                    {
                                        row.audioFileUI &&
                                        <figure style={{ marginLeft: -10 }}>
                                            <audio
                                            controls
                                            src={getUrl(row.audioFileUI.path)}>
                                            <a href={getUrl(row.audioFileUI.path)}>
                                                Download audio
                                            </a>
                                            </audio>
                                        </figure>
                                    }
                                    </TableCell>
                                    <TableCell>
                                    {
                                            isLoading &&<>Saving Subscription...</>
                                        }{!isLoading && <FormControlLabel
                                        value="bottom"
                                        control={<Switch checked={row.isSubscribed} color="primary" />}
                                        label={`Subscription ${row.isSubscribed?"On":"Off"}`}
                                        labelPlacement="bottom"
                                        onChange={(e)=>{subscribeToHoliday(row.holidayId, e.target.checked);}}
                                        />}
                                    </TableCell> 
                                </TableRow>

                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table> 
            </TableContainer>
        </div>
    )
}

export default GlobalHolidays