import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Grid } from '@mui/material';

import { useSelector } from 'react-redux';
import { ExtensionClient } from '../../api/server';
import { Link } from 'react-router-dom';

const Extensions = () => {
    const [extensions, setExtensions] = React.useState([]);

    const globalInfo = useSelector((state) => state.globalInfo)

    function reload() {

        const client = new ExtensionClient(globalInfo.apiRoot, undefined, globalInfo.accessToken);

        client.getExtensions(globalInfo.currentCompanyId).then((data) => {
            setExtensions(data);
        })
    }
    React.useEffect(() => {
        if (globalInfo.accessToken) {
            reload();
        }

    // eslint-disable-next-line
    }, [globalInfo])


    return (
        <div>
            <h2>Extensions</h2>

            {
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align='right'>
                                    <Button variant='outlined' component={Link} to={`/addextension`}>Add New Extension</Button>

                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {extensions.map((row) => (
                                <TableRow
                                    key={row.extensionId}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell>
                                        <Grid container>
                                            <Grid item xs={12} sm={6} lg={4} style={{ marginTop: 15 }}>
                                                {row.name}
                                            </Grid>
                                            <Grid item xs={12} sm={6} lg={4} style={{ marginTop: 15 }}>
                                                {row.address.split("@")[0]}
                                            </Grid>
                                            <Grid item xs={12} sm={12} lg={4} style={{ marginTop: 15 }}>
                                                {
                                                    !row.address.includes("@") && <Button variant='contained' component={Link} to={`/editextension/${row.extensionId}`}>Edit</Button>
                                                }
                                            </Grid>

                                        </Grid>


                                    </TableCell>
                                </TableRow>

                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            }
        </div>

    )
}

export default Extensions