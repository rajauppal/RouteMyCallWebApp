import { Button, FormControlLabel, FormGroup, MenuItem, Select, Switch, TextField, TableContainer, Table, TableHead, TableRow, TableCell, Paper, TableBody, Tabs, Tab } from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers';
import { Grid } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { AudioFileClient, HolidayClient, } from '../../api/server';
import { useParams } from 'react-router-dom';
import GlobalHolidays from './GlobalHolidays';


function CustomTabPanel(props) {
  const { children, value, index } = props;

  return (
    <div
      hidden={value !== index}
    >
      {value === index && (
          <>{children}</>
      )}
    </div>
  );
}

export default function Holidays() {
  const globalInfo = useSelector((state) => state.globalInfo)
  const [audioFileId, setAudioFileId] = useState("");
  const [holidayName, setHolidayName] = useState("");
  const [audioFiles, setAudioFiles] = useState([]);
  const [isBusinessClosed, setIsBusinessClosed] = useState(false);
  const [isCustomAudio, setIsCustomAudio] = useState(false);

  const [isAddMode, setAddMode] = useState(false)
  const [isDateRangeMode, setRangeMode] = useState(false)
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  let { currentPhoneNumberId } = useParams();

  const [holidayDateFrom, setHolidayDateFrom] = React.useState(null);
  const [holidayDateTo, setHolidayDateTo] = React.useState(null);
  const [holidays, setHolidays] = React.useState([]);

  function deleteHoliday(holidayId) {
    const client = new HolidayClient(globalInfo.apiRoot, undefined, globalInfo.accessToken);

    client.deleteHoliday(holidayId).then(() => {
      reload();
    });

  }
  function addHoliday() {
    const client = new HolidayClient(globalInfo.apiRoot, undefined, globalInfo.accessToken);

    client.addHoliday(currentPhoneNumberId, holidayName, holidayDateFrom, isDateRangeMode ? holidayDateTo : holidayDateFrom, isBusinessClosed, isCustomAudio, isCustomAudio ? audioFileId : null).then(() => {
      reload();

      clearForm();
      setAddMode(false)
    });

  }

  function clearForm() {
    setHolidayName("")
    setHolidayDateTo(null)
    setHolidayDateFrom(null)
    setIsBusinessClosed(false)
    setIsCustomAudio(false)
    setAudioFileId("")
    setRangeMode(false)
  }

  function reload() {
    const client = new HolidayClient(globalInfo.apiRoot, undefined, globalInfo.accessToken);

    if (currentPhoneNumberId) {

      client.getHolidays(currentPhoneNumberId).then((data) => {
        setHolidays(data)
      })
    }
  }
  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPhoneNumberId])

  useEffect(() => {
    setAudioFileId("")
  }, [isCustomAudio])


  useEffect(() => {
    const client1 = new AudioFileClient(globalInfo.apiRoot, undefined, globalInfo.accessToken);

    client1.getAudioFiles(globalInfo.currentCompanyId).then(
      (data) => {
        setAudioFiles(data);
      }
    )


  }, [currentPhoneNumberId, globalInfo])



  function isFormInvalid() {
    if (!holidayName) return true;

    if (!holidayDateFrom) return true;

    if (isDateRangeMode && !holidayDateTo) return true;

    if ((!isBusinessClosed && !isCustomAudio)) return true;

    if (isCustomAudio && !audioFileId) return true;
  }

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function getUrl(path) {
    if (path.startsWith("https")) {
      return path
    }
    return globalInfo.apiRoot + "/" + path;
  }

  return (
    <>
      {!isAddMode && <>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
           <Tab label="Global Holidays/Greetings" /> 
            <Tab label="My Holidays/Greetings"></Tab>
        </Tabs>

        <CustomTabPanel value={value} index={1}>


          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                <TableCell colSpan={3}>
                      <h1>My Holidays/Greetings</h1>
                  </TableCell>

                  <TableCell>
                  </TableCell>
                  <TableCell>
                    <Button variant='outlined' onClick={() => { setAddMode(true) }} >Add Holiday/Greeting</Button>&nbsp;&nbsp;
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
                          row.audioFile &&
                          <figure style={{ marginLeft: -10 }}>
                            <audio
                              controls
                              src={getUrl(row.audioFile.path)}>
                              <a href={getUrl(row.audioFile.path)}>
                                Download audio
                              </a>
                            </audio>
                          </figure>
                        }
                      </TableCell>
                      <TableCell>
                        <Button variant='contained' onClick={() => { deleteHoliday(row.holidayId) }}>Delete</Button>
                      </TableCell>

                    </TableRow>

                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CustomTabPanel >
        <CustomTabPanel value={value} index={0}>
          <GlobalHolidays onReload={reload}></GlobalHolidays>
        </CustomTabPanel >
      </>}
      {isAddMode && <>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={9} lg={8}>

            <div>
              <h1>Add Holiday/Greeting</h1>
              <FormGroup>
                <TextField label="Holiday/Greeting Name" value={holidayName} onChange={(event) => { setHolidayName(event.target.value) }} />

                <br></br>
                {
                  !isDateRangeMode &&
                  <Grid container spacing={2}>
                    <Grid item md={5}  >
                      <MobileDatePicker
                        label="Holiday/Greeting Date"
                        value={holidayDateFrom}
                        slotProps={{ textField: { fullWidth: true } }}
                        onChange={(newValue, context) => { if (context.validationError) { setHolidayDateFrom(null) } else { setHolidayDateFrom(newValue) }; }}
                      />

                    </Grid>
                    <Grid item md={2}>
                      <Button size='small' variant='outlined' onClick={() => { setRangeMode(!isDateRangeMode) }}>{!isDateRangeMode && <>Show</>}{isDateRangeMode && <>Hide</>} Date Range</Button>
                    </Grid>

                  </Grid>
                }
                {
                  isDateRangeMode && <Grid container spacing={2}>
                    <Grid item xs={5}  >
                      <MobileDatePicker
                        label="Holiday/Greeting Date From"
                        value={holidayDateFrom}
                        slotProps={{ textField: { fullWidth: true } }}
                        onChange={(newValue, context) => { if (context.validationError) { setHolidayDateFrom(null) } else { setHolidayDateFrom(newValue) }; }}
                      />
                    </Grid>
                    <Grid item xs={5}  >
                      <MobileDatePicker
                        label="Holiday/Greeting Date To"
                        value={holidayDateTo}
                        slotProps={{ textField: { fullWidth: true } }}
                        onChange={(newValue, context) => { if (context.validationError) { setHolidayDateTo(null) } else { setHolidayDateTo(newValue) }; }}
                      />
                      <br></br>
                    </Grid>
                    <Grid item xs={2}>
                      <Button size='small' variant='outlined' onClick={() => { setRangeMode(!isDateRangeMode) }}>{!isDateRangeMode && <>Show</>}{isDateRangeMode && <>Hide</>} Date Range</Button>
                    </Grid>

                  </Grid>
                }



                <br></br>
                <FormControlLabel control={<Switch checked={isBusinessClosed} onChange={(event) => { setIsBusinessClosed(event.target.checked); }} />} label="Business Is Closed" />
                <br></br>

                <FormControlLabel required control={<Switch checked={isCustomAudio} onChange={(event) => { setIsCustomAudio(event.target.checked); }} />} label="Custom Message Audio" />
                <div >
                  <Select fullWidth={true}
                    disabled={!isCustomAudio}
                    value={audioFileId}
                    onChange={e => setAudioFileId(e.target.value)}>
                    <MenuItem key={-1} value={""}>&nbsp;</MenuItem>
                    {
                      audioFiles.map((item, index) => {
                        return <MenuItem key={index} value={item.audioFileId}>{item.name}</MenuItem>
                      })
                    }

                  </Select>
                </div>
              </FormGroup>
              <br></br>
              <Button variant='contained' onClick={() => { addHoliday() }} disabled={isFormInvalid()} >Save Holiday/Greeting</Button>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <Button variant='contained' onClick={() => { setAddMode(false); clearForm(); }}>Close</Button>
            </div>
          </Grid>
        </Grid>
      </>}
    </>
  )
}
