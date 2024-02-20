import { Button,  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { RuleClient } from '../../api/server';

import { Link } from 'react-router-dom';

export default function CallRoutingRules() {
    const globalInfo = useSelector((state) => state.globalInfo)
   
    const [rules, setRules] = useState([])
    function reload() {
        const client = new RuleClient(globalInfo.apiRoot, undefined, globalInfo.accessToken);

        client.getRules(globalInfo.currentCompanyId).then((data) => {
            setRules(data);
        })

    }

    React.useEffect(() => {
        reload();

        // eslint-disable-next-line
    }, [globalInfo])

    return (
        <div>
         

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Details</TableCell>
                            <TableCell>
                                
                                <Button variant='outlined' component={Link} to={`/addrule`}>Add New Rule</Button>

                            </TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rules.map((row) => (
                            <TableRow
                                key={row.ruleId}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.ruleName}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                {
                                    (JSON.parse(row.ruleItems)).map   ((item, index)=>{
                                        return <div key={index}> Priority {index+1}: {item.Display}
                                        </div>
                                    })
                                }
                                     Last Priority: {(JSON.parse(row.defaultRuleAction)).name}
                                </TableCell>
                                <TableCell>
                                    {/* <Button variant='contained' onClick={() => { setCurrentRuleId(row.ruleId); setOpenRuleEdit(true) }}>Edit</Button> */}
                                    <Button variant='contained' component={Link} to={`/editrule/${row.ruleId}`}>Edit</Button>

                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

        </div>
    )
}
