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
import { AudioFileClient } from '../../api/server'
import { Link } from 'react-router-dom'

const AudioFiles = () => {
  const [audioFiles, setAudioFiles] = useState([]);

  const globalInfo = useSelector((state) => state.globalInfo)

  function markAudioGlobal(audioFileId, action){
    const client = new AudioFileClient(globalInfo.apiRoot, undefined, globalInfo.accessToken);

    client.makeAudioFileGlobal(audioFileId, action).then(
      (data) => {
        reload();
      }
    )
  }

  function reload() {
    const client = new AudioFileClient(globalInfo.apiRoot, undefined, globalInfo.accessToken);

    client.getAudioFiles(globalInfo.currentCompanyId).then(
      (data) => {
        setAudioFiles(data);
      }
    )
  }
  function formatBytes(bytes, decimals = 1) {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  }

  useEffect(() => {
    reload();
    // eslint-disable-next-line
  }, [globalInfo.currentCompanyId])

  function getUrl(path){
    if(path.startsWith("https"))
    { 
      return path
    }
    return globalInfo.apiRoot + "/" +  path;
  }

  return (
    <div>
      <h2>Audio Library</h2>
                
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align='right'>
                {/* <Button variant='outlined' component={Link} to={`/globalaudiofiles`}>Global Audio Library</Button>&nbsp;&nbsp; */}
                <Button variant='outlined' component={Link} to={`/addTextToAudio`}>Create Text To Audio</Button>&nbsp;&nbsp;
                {/* <Button variant='contained' component={Link} to={`/addAudioFile`}>Upload New Audio File</Button> */}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableHead>
            <TableRow>
              { globalInfo.isAdministrator && <TableCell></TableCell>}
             
            </TableRow>
          </TableHead>
          <TableBody>
            {audioFiles.map((row, index) => (
              <React.Fragment key={row.audioFileId}>
              <TableRow >
              {
                  globalInfo.isAdministrator &&
                  <>
                    {
                      !row.isGlobal &&
                      <TableCell component="th" scope="row">
                        <Button variant='contained' component={Link} onClick={() => { markAudioGlobal(row.audioFileId, true) }}>Add To Global</Button>
                      </TableCell>
                    }
                    {
                      row.isGlobal &&
                      <TableCell component="th" scope="row">
                        <Button variant='contained' component={Link} onClick={() => { markAudioGlobal(row.audioFileId, false) }}>Remove From Global</Button>
                      </TableCell>
                    }
                  </>
                }
                <TableCell>
                  <Grid container>
                      <Grid item xs={12} sm={12} lg={2} style={{marginTop:15}}>
                        {row.name}
                      </Grid>
                      
                      <Grid item xs={12} lg={4} style={{ border: "solid 0px black" }}>
                        <figure style={{ margin: 0 }}>
                          <audio
                            controls
                            src={getUrl(row.path)}>
                            <a href={getUrl(row.path)}>
                              Download audio
                            </a>
                          </audio>
                        </figure>
                      </Grid>
                      <Grid item xs={12} lg={4} style={{ border: "solid black 0px", marginTop:10 }}>
                        <Button variant='contained' component={Link} to={`/editAudioName/${row.audioFileId}`}>Rename</Button>&nbsp;&nbsp;
                        <Button variant='contained' component={Link} to={`/editTextToAudio/${row.audioFileId}`}>Modify Text To Audio</Button>&nbsp;&nbsp;
                        {/* <Button variant='contained' component={Link} to={`/editAudioFile/${row.audioFileId}`}>Replace Audio File</Button> */}
                      </Grid>
                  </Grid>
                  
                </TableCell>
              </TableRow>
              <TableRow 
              style={{display:"none"}}
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                {
                  globalInfo.isAdministrator &&
                  <>
                    {
                      !row.isGlobal &&
                      <TableCell component="th" scope="row">
                        <Button variant='contained' component={Link} onClick={() => { markAudioGlobal(row.audioFileId, true) }}>Add To Global</Button>
                      </TableCell>
                    }
                    {
                      row.isGlobal &&
                      <TableCell component="th" scope="row">
                        <Button variant='contained' component={Link} onClick={() => { markAudioGlobal(row.audioFileId, false) }}>Remove From Global</Button>
                      </TableCell>
                    }
                  </>
                }
                <TableCell component="th" scope="row">
                  {row.name} 
                </TableCell>
                <TableCell component="th" scope="row">
                  {formatBytes(row.fileSize)}
                </TableCell>
                <TableCell style={{ padding: 0 }}>
                  <figure style={{ margin: 0 }}>
                    <audio
                      controls
                      src={getUrl(row.path)}>
                      <a href={getUrl(row.path)}>
                        Download audio
                      </a>
                    </audio>
                  </figure>

                </TableCell>
                <TableCell>
                  <Button variant='contained' component={Link} to={`/editAudioName/${row.audioFileId}`}>Rename</Button>&nbsp;&nbsp;
                  <Button variant='contained' component={Link} to={`/editTextToAudio/${row.audioFileId}`}>Modify Text To Audio</Button>&nbsp;&nbsp;
                  {/* <Button variant='contained' component={Link} to={`/editAudioFile/${row.audioFileId}`}>Replace Audio File</Button> */}
                </TableCell>
               
              </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default AudioFiles