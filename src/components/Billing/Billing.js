import { Box, Button, Card, Input, MenuItem, Select, Tab, Tabs } from '@mui/material'
import React, { useState } from 'react'
import AddInvoice from './AddInvoice'
import AddPayment from './AddPayment'
import { useSelector } from 'react-redux'
import { PhoneNumberClient } from '../../api/server'

function Billing() {

    const [phoneNumbers, setPhoneNumbers] = React.useState([])
    const globalInfo = useSelector((state) => state.globalInfo)

    function reload() {
        const client = new PhoneNumberClient(globalInfo.apiRoot, undefined, globalInfo.accessToken);

        client.getPhoneNumbers(globalInfo.currentCompanyId).then((data) => {
            setPhoneNumbers(data);
        })
    }

    React.useEffect(() => {
        reload();

        // eslint-disable-next-line
    }, [])

    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <div>

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Invoice" value={0} />
                    <Tab label="Payment" value={1} />
                </Tabs>
            </Box>
            <div hidden={value !== 0}>
                <AddInvoice phoneNumbers={phoneNumbers}></AddInvoice>
            </div>
            <div hidden={value !== 1}>
                <AddPayment phoneNumbers={phoneNumbers} ></AddPayment>
            </div>
        </div>
    )
}

export default Billing