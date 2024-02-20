import { Grid, Table } from '@mui/material'
import { TableRow } from '@mui/material'
import { Button } from '@mui/material'
import { TableBody } from '@mui/material'
import { Paper } from '@mui/material'
import { TableCell } from '@mui/material'
import { TableHead } from '@mui/material'
import { TableContainer } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { MenuClient } from '../../api/server'

import { Link } from 'react-router-dom'

const IVRMenus = () => {
    const [menus, setMenus] = useState([])
    const globalInfo = useSelector((state) => state.globalInfo)

    function reload() {
        const client = new MenuClient(globalInfo.apiRoot, undefined, globalInfo.accessToken);

        client.getMenus(globalInfo.currentCompanyId).then((data) => {
            setMenus(data)
        })


    }

    useEffect(() => {
        reload();
        // eslint-disable-next-line
    }, [globalInfo])


    return (
        <div>
            <h2>IVR Menus</h2>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align='right'>
                                <Button variant='outlined' component={Link} to={`/addMenu`}>Add New Menu</Button>
                            </TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {menus.map((row) => (
                            <TableRow
                                key={row.menuId}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell>
                                <Grid container spacing={2} >
                                    <Grid  item xs={12} md={6}>
                                        
                                        {row.menuName}

                                    </Grid>
                                    <Grid item>
                                        <Button variant='contained' component={Link} to={`/editMenu/${row.menuId}`}>Edit</Button>

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

export default IVRMenus