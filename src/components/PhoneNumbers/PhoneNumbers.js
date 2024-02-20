import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import { PhoneNumberClient } from '../../api/server';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const Item = styled('div')({
    color: 'darkslategray',
});

const PhoneNumbers = () => {
    const [phoneNumbers, setPhoneNumbers] = React.useState([])
    const globalInfo = useSelector((state) => state.globalInfo)

    function reload() {
        const client = new PhoneNumberClient(globalInfo.apiRoot, undefined, globalInfo.accessToken);

        client.getPhoneNumbers(globalInfo.currentCompanyId).then((data) => {
            setPhoneNumbers(data);
            // console.log(data)
        })
    }

    function followupActionName(action) {

        if (!action) return "";


        var x = JSON.parse(action);

        //console.log(x);

        if (x.followUpAction && x.followUpAction.name) {
            return x.followUpAction.name;
        }
        else {
            return ""
        }

    }


    React.useEffect(() => {
        reload();

        // eslint-disable-next-line
    }, [globalInfo])


    return (
        <div>


            <h2>My Phone Numbers</h2>

            <TableContainer component={Paper}>
                <Table>

                    <TableBody>
                        {phoneNumbers.map((row) => (
                            <TableRow
                                key={row.phoneNumberId}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >

                                <TableCell>
                                    <Grid container spacing={2} >
                                        <Grid container item xs={12} md={6}>
                                            <Grid item xs={12} lg={6}>
                                                <Item>
                                                    When <strong> {row.phoneNumberDigits.getFormattedPhoneNum()} </strong> is called <br />Play <strong>Holiday/Greeting Messages </strong>followed by
                                                </Item>
                                            </Grid>
                                            <Grid item xs={12} lg={6}>
                                                <Item>

                                                <strong> {JSON.parse(row.action).name}</strong> <br></br>
                                                    {
                                                        followupActionName(row.action) && <>
                                                            <>
                                                                Followed by:
                                                            </>
                                                            <>
                                                               <strong> {followupActionName(row.action)}</strong>
                                                            </>
                                                        </>
                                                    }
                                                </Item>

                                            </Grid>

                                        </Grid>
                                        <Grid item>
                                            <Item>
                                                <Button variant='contained' component={Link} to={`/editphonenumber/${row.phoneNumberId}`}>Settings</Button> &nbsp; &nbsp;
                                                <Button variant='contained' component={Link} to={`/businesshours/${row.phoneNumberId}`}>Business Hours</Button> &nbsp; &nbsp;
                                                <Button variant='contained' component={Link} to={`/holidays/${row.phoneNumberId}`}>Holiday/Greeting Messages</Button> &nbsp; &nbsp;
                                                {/* <Button variant='contained' component={Link} to={`/webrtc/${row.phoneNumberId}`}>Call Using</Button> &nbsp; &nbsp; */}

                                            </Item>
                                        </Grid>

                                    </Grid>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

        </div>

    )
}

export default PhoneNumbers