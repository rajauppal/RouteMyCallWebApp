import {Table } from '@mui/material'
import { TableRow } from '@mui/material'
import { TableBody } from '@mui/material'
import { Paper } from '@mui/material'
import { TableCell } from '@mui/material'
import { TableHead } from '@mui/material'
import { TableContainer } from '@mui/material'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { CDRClient } from '../../api/server'
import { DatePicker } from '@mui/x-date-pickers'

const CallHistory = () => {
  const [callHistoryRecords, setCallHistoryRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  const globalInfo = useSelector((state) => state.globalInfo)


  function reload() {
    if (!selectedDate) return;
    setIsLoading(true);
    const client = new CDRClient(globalInfo.apiRoot, undefined, globalInfo.accessToken);

    client.getCDRRecords(globalInfo.currentCompanyId, new Date(selectedDate)).then((data) => {
      setCallHistoryRecords(data)
      setIsLoading(false);
    })
  }

  useEffect(() => {
    reload();
    // eslint-disable-next-line
  }, [globalInfo.currentCompanyId, selectedDate])



  return (
    <div>
      <label>Date: </label> <br/><DatePicker onChange={(newValue) => setSelectedDate(newValue)} />
      {
        isLoading && <div>
          <br/>Fetching data...
        </div>
      }
      {
        !isLoading &&
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
              <TableCell><strong>Direction</strong></TableCell>
              <TableCell><strong>Caller Number</strong></TableCell>
                <TableCell><strong>Destination Number</strong></TableCell>
                <TableCell><strong>Start Time</strong></TableCell>
                <TableCell><strong>End Time</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {callHistoryRecords.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>
                    {row.direction}
                  </TableCell>
                  <TableCell>
                    {row.originatingNumber.getFormattedPhoneNum()}
                  </TableCell>
                  <TableCell>
                    {row.terminatingnumber.getFormattedPhoneNum()}
                  </TableCell>
                  <TableCell>
                    {
                      (new Date(row.startTimestamp.toString() + ' UTC')).toLocaleTimeString()
                    }
                  </TableCell>
                  <TableCell>
                    {
                      (new Date(row.endTimestamp.toString() + ' UTC')).toLocaleTimeString()
                    }
                  </TableCell>
                  <TableCell>
                  </TableCell>
                </TableRow>
              ))}
              {
                callHistoryRecords.length === 0 && <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    No Data


                  </TableCell>
                </TableRow>

              }
            </TableBody>
          </Table>
        </TableContainer>
      }
    </div>
  )
}

export default CallHistory