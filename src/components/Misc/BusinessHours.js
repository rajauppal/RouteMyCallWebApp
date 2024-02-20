import { Button } from '@mui/material'
import { MobileTimePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { PhoneNumberClient } from '../../api/server';
import { useNavigate, useParams } from 'react-router-dom';

export default function BusinessHours() {
    const globalInfo = useSelector((state) => state.globalInfo)

    let { currentPhoneNumberId } = useParams();
    const navigate = useNavigate();


    const [monday_open, setMondayOpen] = useState(dayjs('2023-01-01T9:00'))
    const [monday_close, setMondayClose] = useState(dayjs('2023-01-01T19:00'))

    const [tuesday_open, setTuesdayOpen] = useState(dayjs('2023-01-01T9:00'))
    const [tuesday_close, setTuesdayClose] = useState(dayjs('2023-01-01T19:00'))

    const [wednesday_open, setWednesdayOpen] = useState(dayjs('2023-01-01T9:00'))
    const [wednesday_close, setWednesdayClose] = useState(dayjs('2023-01-01T19:00'))

    const [thursday_open, setThursdayOpen] = useState(dayjs('2023-01-01T9:00'))
    const [thursday_close, setThursdayClose] = useState(dayjs('2023-01-01T19:00'))

    const [friday_open, setFridayOpen] = useState(dayjs('2023-01-01T9:00'))
    const [friday_close, setFridayClose] = useState(dayjs('2023-01-01T19:00'))

    const [saturday_open, setSaturdayOpen] = useState(dayjs('2023-01-01T9:00'))
    const [saturday_close, setSaturdayClose] = useState(dayjs('2023-01-01T19:00'))

    const [sunday_open, setSundayOpen] = useState(dayjs('2023-01-01T9:00'))
    const [sunday_close, setSundayClose] = useState(dayjs('2023-01-01T19:00'))

    const onClose = () =>{
        navigate('/phonenumbers')
    }

    useEffect(() => {
        const client1 = new PhoneNumberClient(globalInfo.apiRoot, undefined, globalInfo.accessToken);


        if (currentPhoneNumberId) {

            client1.getPhoneNumberById(currentPhoneNumberId).then((data) => {
                var businessHours = JSON.parse( data.businessHours)

                setMondayOpen(dayjs(`2023-01-01T${businessHours.Monday_Open}`))
                setMondayClose(dayjs(`2023-01-01T${businessHours.Monday_Close}`))

                setTuesdayOpen(dayjs(`2023-01-01T${businessHours.Tuesday_Open}`))
                setTuesdayClose(dayjs(`2023-01-01T${businessHours.Tuesday_Close}`))

                setWednesdayOpen(dayjs(`2023-01-01T${businessHours.Wednesday_Open}`))
                setWednesdayClose(dayjs(`2023-01-01T${businessHours.Wednesday_Close}`))


                setThursdayOpen(dayjs(`2023-01-01T${businessHours.Thursday_Open}`))
                setThursdayClose(dayjs(`2023-01-01T${businessHours.Thursday_Close}`))

                setFridayOpen(dayjs(`2023-01-01T${businessHours.Friday_Open}`))
                setFridayClose(dayjs(`2023-01-01T${businessHours.Friday_Close}`))

                setSaturdayOpen(dayjs(`2023-01-01T${businessHours.Saturday_Open}`))
                setSaturdayClose(dayjs(`2023-01-01T${businessHours.Saturday_Close}`))

                setSundayOpen(dayjs(`2023-01-01T${businessHours.Sunday_Open}`))
                setSundayClose(dayjs(`2023-01-01T${businessHours.Sunday_Close}`))


            })
        } else {
        }
    }, [currentPhoneNumberId, globalInfo])


    function addZero(input){
        input = `${input}`
        
        if(input.length === 1) 
        {
            input = `0${input}`;
        }

        
        return input;
    }

    
    function SaveBusinessHours(){
            var mon_open = `${addZero(monday_open.$H)}:${addZero(monday_open.$m)}`;
        var mon_close = `${addZero(monday_close.$H)}:${addZero(monday_close.$m)}`;

        var tue_open = `${addZero(tuesday_open.$H)}:${addZero(tuesday_open.$m)}`;
        var tue_close = `${addZero(tuesday_close.$H)}:${addZero(tuesday_close.$m)}`;

        var wed_open = `${addZero(wednesday_open.$H)}:${addZero(wednesday_open.$m)}`;
        var wed_close = `${addZero(wednesday_close.$H)}:${addZero(wednesday_close.$m)}`;

        var thu_open = `${addZero(thursday_open.$H)}:${addZero(thursday_open.$m)}`;
        var thu_close = `${addZero(thursday_close.$H)}:${addZero(thursday_close.$m)}`;

        var fri_open = `${addZero(friday_open.$H)}:${addZero(friday_open.$m)}`;
        var fri_close = `${addZero(friday_close.$H)}:${addZero(friday_close.$m)}`;

        var sat_open = `${addZero(saturday_open.$H)}:${addZero(saturday_open.$m)}`;
        var sat_close = `${addZero(saturday_close.$H)}:${addZero(saturday_close.$m)}`;

        var sun_open = `${addZero(sunday_open.$H)}:${addZero(sunday_open.$m)}`;
        var sun_close = `${addZero(sunday_close.$H)}:${addZero(sunday_close.$m)}`;

        var hours = {
            "Monday_Open": mon_open,
            "Monday_Close": mon_close,
            "Tuesday_Open": tue_open,
            "Tuesday_Close": tue_close,
            "Wednesday_Open": wed_open,
            "Wednesday_Close": wed_close,
            "Thursday_Open": thu_open,
            "Thursday_Close": thu_close,
            "Friday_Open": fri_open,
            "Friday_Close": fri_close,
            "Saturday_Open": sat_open,
            "Saturday_Close": sat_close,
            "Sunday_Open": sun_open,
            "Sunday_Close": sun_close
        }
        
        const client = new PhoneNumberClient(globalInfo.apiRoot, undefined, globalInfo.accessToken);

        client.updateBusinessHours(currentPhoneNumberId, JSON.stringify(hours)).then((data)=>{
            onClose();
        })

       
    }
  return (
    <div style={{padding:20}}>
        
        <table>
                <thead>
                    <tr>
                        <td> </td>
                        <td>Open </td>
                        <td>Close</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Monday</td>
                        <td><MobileTimePicker value={monday_open} onChange={(val)=>{ setMondayOpen(val)}} /> </td>
                        <td><MobileTimePicker value={monday_close} onChange={(val)=>{setMondayClose(val)}} /> </td>
                    </tr>
                    <tr>
                        <td>Tuesday</td>
                        <td><MobileTimePicker value={tuesday_open} onChange={(val)=>{setTuesdayOpen(val)}} /> </td>
                        <td><MobileTimePicker value={tuesday_close} onChange={(val)=>{setTuesdayClose(val)}} /> </td>
                    </tr>
                    <tr>
                        <td>Wednesday</td>
                        <td><MobileTimePicker value={wednesday_open} onChange={(val)=>{setWednesdayOpen(val)}} /> </td>
                        <td><MobileTimePicker value={wednesday_close} onChange={(val)=>{setWednesdayClose(val)}} /> </td>
                    </tr>
                    <tr>
                        <td>Thursday</td>
                        <td><MobileTimePicker value={thursday_open} onChange={(val)=>{setThursdayOpen(val)}} /> </td>
                        <td><MobileTimePicker value={thursday_close} onChange={(val)=>{setThursdayClose(val)}} /> </td>
                    </tr>
                    <tr>
                        <td>Friday</td>
                        <td><MobileTimePicker value={friday_open} onChange={(val)=>{setFridayOpen(val)}} /> </td>
                        <td><MobileTimePicker value={friday_close} onChange={(val)=>{setFridayClose(val)}} /> </td>
                    </tr>
                    <tr>
                        <td>Saturday</td>
                        <td><MobileTimePicker value={saturday_open} onChange={(val)=>{setSaturdayOpen(val)}} /> </td>
                        <td><MobileTimePicker value={saturday_close} onChange={(val)=>{setSaturdayClose(val)}} /> </td>
                    </tr>
                    <tr>
                        <td>Sunday</td>
                        <td><MobileTimePicker value={sunday_open} onChange={(val)=>{setSundayOpen(val)}} /> </td>
                        <td><MobileTimePicker value={sunday_close} onChange={(val)=>{setSundayClose(val)}} /> </td>
                    </tr>
                    <tr>
                        <td colSpan={3}>
                            <Button variant='outlined' onClick={()=>SaveBusinessHours()}>Save</Button>&nbsp;&nbsp;<Button variant="outlined" onClick={() => { onClose() }}>Close</Button>
                        </td>
                    </tr>
                </tbody>
            </table>


    </div>
  )
}
