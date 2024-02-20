import {  Table } from '@mui/material'
import { TableRow } from '@mui/material'
import { Button } from '@mui/material'
import { TableBody } from '@mui/material'
import { Paper } from '@mui/material'
import { TableCell } from '@mui/material'
import { TableHead } from '@mui/material'
import { TableContainer } from '@mui/material'
import  { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { AudioFileClient } from '../../api/server'
import { Link, useNavigate } from 'react-router-dom'

const GlobalAudioFiles = () => {
  const [audioFiles, setAudioFiles] = useState([]);
  const navigate = useNavigate();

  const globalInfo = useSelector((state) => state.globalInfo)

  function addToMyLibrary(audioFileId){
    const client = new AudioFileClient(globalInfo.apiRoot, undefined, globalInfo.accessToken);

    client.addToMyLibrary(globalInfo.currentCompanyId, audioFileId).then(
      (data) => {
        navigate("/audiofiles");
      }
    )
  }

  function reload() {
    const client = new AudioFileClient(globalInfo.apiRoot, undefined, globalInfo.accessToken);

    client.getGlobalAudioFiles().then(
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
       
       <h1>Global Audio Files</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Preview</TableCell>
              <TableCell>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {audioFiles.map((row, index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                 
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
                <TableCell component="th" scope="row">
                        <Button variant='contained' component={Link} onClick={()=>{addToMyLibrary(row.audioFileId)}}>Add To My Library</Button>
                  </TableCell>
               
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default GlobalAudioFiles