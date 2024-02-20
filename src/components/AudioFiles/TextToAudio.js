import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { AudioFileClient, AudioFileUI, TextToAudioClient } from '../../api/server';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

export default function TextToAudio() {
  let { currentAudioFileId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [textToConvert, setTextToConvert] = useState("");
  const globalInfo = useSelector((state) => state.globalInfo)
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  
  function onClose(){
    navigate("/audiofiles")
  }


  function save() {
    setUploading(true)
    const client = new TextToAudioClient(globalInfo.apiRoot, undefined, globalInfo.accessToken);

    var audioFile = new AudioFileUI();
    if (currentAudioFileId) {
      audioFile.textToConvert = textToConvert;
      
      client.updateTextToAudio(currentAudioFileId, audioFile, languageModel).then((data) => {
        setUploading(false)
        if(data){
          onClose();
        }
        else{
          setError(true)
        }
      })
    }
    else{
      audioFile.name = name;
      audioFile.textToConvert = textToConvert;
      client.convertTextToAudio(globalInfo.currentCompanyId, audioFile, languageModel).then((data) => {
        setUploading(false)
        if(data){
          onClose();
        }
        else{
          setError(true)
        }
      })
    }
  }
  
  useEffect(() => {
    const client = new AudioFileClient(globalInfo.apiRoot, undefined, globalInfo.accessToken);
    if (currentAudioFileId) {
        client.getAudioFileById(currentAudioFileId).then((data) => {
            setTextToConvert(data.textToConvert);
          
        })
    }
    else {
      setTextToConvert("");
        
    }
}, [currentAudioFileId, globalInfo])

const [languageModel, setLanguageModel] = React.useState('');

const handleChange = (event) => {
  setLanguageModel(event.target.value);
};

  return (
    <div style={{padding:30}}>
      <Grid container spacing={2} width={800}>
        <Grid>
          {!currentAudioFileId && <>
          Name:  <br></br>
          <TextField style={{ width: 400 }} value={name} onChange={(e) => { setName(e.target.value) }}></TextField>
          <br></br>
          </>}
          
          Text To Convert To Audio:  <br></br>
          <TextField rows={10} multiline={true} style={{ width: 600 }}  value={textToConvert} onChange={(e) => { setTextToConvert(e.target.value) }}></TextField>
          <br></br><br></br>

          <InputLabel id="languageModel-label">Voice Artist</InputLabel>
          <Select
            labelId="languageModel-label"
            id="demo-simple-select"
            value={languageModel}
            onChange={handleChange}
            style={{ width: 150 }}
          >
            <MenuItem value="en-US-Neural2-A">John</MenuItem>
            <MenuItem value="en-US-Neural2-C">Sarah</MenuItem>
            <MenuItem value="en-US-Neural2-D">Henry</MenuItem>
            <MenuItem value="en-US-Neural2-E">Ava</MenuItem>
            <MenuItem value="en-US-Neural2-F">Nancy</MenuItem>
            <MenuItem value="en-US-Neural2-G">Anna</MenuItem>
            <MenuItem value="en-US-Neural2-H">Jessica</MenuItem>
            <MenuItem value="en-US-Neural2-I">Michael</MenuItem>
            <MenuItem value="en-US-Neural2-J">Robert</MenuItem>
            <MenuItem value="en-US-Studio-Q">David</MenuItem>
          </Select>
          <br></br><br></br>
          {
            !uploading && !currentAudioFileId && <Button variant='outlined' disabled={name===""||textToConvert===""||languageModel===""} onClick={()=>{save()}}>Convert & Add</Button>
          
          } 
          {
            !uploading && currentAudioFileId && <Button variant='outlined' disabled={textToConvert==="" || languageModel===""} onClick={()=>{save()}}>Convert & Update</Button>
          }
          &nbsp;&nbsp;
          <Button variant='outlined' onClick={() => { onClose() }}>Close</Button>
          <br></br>
          {uploading && <>Conversion in progress...</>}
          {error && <>An unknown error has occurred. The application administrator has been informed.</>}
        </Grid>
      </Grid>
    </div>
  )
}
