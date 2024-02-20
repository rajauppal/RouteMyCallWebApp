import { Button, Input, MenuItem, Select } from '@mui/material'
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { MoneyTransactionClient } from '../../api/server';

function AddPayment(props) {
    const [phoneNumberId, setPhoneNumberId] = useState("");
    const [amount, setAmount] = useState("");
    const [paymentDate, setPaymentDate] = useState("");
    const globalInfo = useSelector((state) => state.globalInfo)

    const AddPayment = ()=>{
        const client = new MoneyTransactionClient(globalInfo.apiRoot, undefined, globalInfo.accessToken);

        client.addPayment(phoneNumberId, amount, new Date(paymentDate)).then((data)=>{
            if(data){
                alert("Payment Added")
            }
            else{
                alert("error")
            }
        })
        
    }

    return (
        <div>

            <div>
                <br></br><br></br>Phone Numbers
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
                <br></br><br></br>Amount: <br></br>
                <Input value={amount} onChange={(e) => { setAmount(e.target.value) }}></Input>
            </div>
            <div>
                <br></br><br></br>Payment Date: <br></br>
                <Input value={paymentDate} onChange={(e) => { setPaymentDate(e.target.value) }}></Input>
            </div>
            <div>
                <br></br><br></br>
                <Button onClick={()=>{AddPayment()}} disabled={!phoneNumberId || !amount ||  !paymentDate} variant='outlined'>Add Payment</Button>
            </div>

        </div>
    )
}

export default AddPayment