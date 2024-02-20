import { Button, Input, MenuItem, Select } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { MoneyTransactionClient } from '../../api/server';
import { useSelector } from 'react-redux';

function AddInvoice(props) {
    const [phoneNumberId, setPhoneNumberId] = useState("");
    const [invoiceNumber, setInvoiceNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [serviceStartDate, setServiceStartDate] = useState("");
    const [serviceEndDate, setServiceEndDate] = useState("");
    const [invoiceDate, setInvoiceDate] = useState("");
    const globalInfo = useSelector((state) => state.globalInfo)

    const AddInvoice = ()=>{
        const client = new MoneyTransactionClient(globalInfo.apiRoot, undefined, globalInfo.accessToken);

        client.addInvoice(phoneNumberId,invoiceNumber, amount, new Date(serviceStartDate),new Date(serviceEndDate), new Date(invoiceDate)).then((data)=>{
            if(data){
                alert("Invoice Added")
            }
            else{
                alert("error")
            }
        })
        
    }

    return (
        <>
            {
                props.phoneNumbers && props.phoneNumbers.length > 0 &&
                <div>

                    <div>
                        <br></br><br></br>Phone Number:<br></br>
                        <Select value={phoneNumberId} style={{width:250}} onChange={(e)=>{setPhoneNumberId(e.target.value)}}>
                                <MenuItem value=""></MenuItem>
                                {
                                    props.phoneNumbers.map((item, index) => {
                                        return <MenuItem value={item.phoneNumberId} key={index}>{item.phoneNumberDigits.getFormattedPhoneNum()}</MenuItem>
                                    })
                                }
                        </Select>
                    </div>
                    <div>
                        <br></br><br></br>Invoice Number: <br></br>
                        <Input value={invoiceNumber} onChange={(e) => { setInvoiceNumber(e.target.value) }}></Input>
                    </div>
                    <div>
                        <br></br><br></br>Amount: <br></br>
                        <Input value={amount} onChange={(e) => { setAmount(e.target.value) }}></Input>
                    </div>
                    <div>
                        <br></br><br></br>Service Start Date: <br></br>
                        <Input value={serviceStartDate} onChange={(e) => { setServiceStartDate(e.target.value) }}></Input>
                    </div>
                    <div>
                        <br></br><br></br>Service End Date: <br></br>
                        <Input value={serviceEndDate} onChange={(e) => { setServiceEndDate(e.target.value) }}></Input>
                    </div>
                    <div>
                        <br></br><br></br>Invoice Date: <br></br>
                        <Input value={invoiceDate} onChange={(e) => { setInvoiceDate(e.target.value) }}></Input>
                    </div>
                    <div>
                        <br></br><br></br>
                        <Button onClick={()=>{AddInvoice()}} disabled={!phoneNumberId || !invoiceNumber || !amount || !serviceStartDate || !serviceEndDate || !invoiceDate} variant='outlined'>Add Invoice</Button>
                    </div>
                </div>
            }
        </>
    )
}

export default AddInvoice