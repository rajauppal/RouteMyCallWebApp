import { Autocomplete,  TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AudioFileClient } from '../../api/server';

export default function MarketingMessages(props) {

    const { audioIds, setAudioIds } = props;

    const globalInfo = useSelector((state) => state.globalInfo)
    const [defaultValue, setDefaultValue] = useState([]);
     const [audioFiles, setAudioFiles] = useState([]);

    useEffect(() => {

        const client1 = new AudioFileClient(globalInfo.apiRoot, undefined, globalInfo.accessToken);

        
        client1.getAudioFiles(globalInfo.currentCompanyId).then(
            (data) => {
                setAudioFiles(data);
            }
        )

    }, [ globalInfo])

    function getSelectedObjects(audioIds) {
        var result = [];

        audioIds.forEach(element => {
            var filtered = audioFiles.filter((x) => x.audioFileId === element);
            if (filtered.length > 0) {
                result.push({ audioFileId: filtered[0].audioFileId, name: filtered[0].name });
            }
        });

        return result;
    }

    
    useEffect(() => {
        if (!audioIds) return;
        if (audioFiles.length === 0) return;
        var selectedObjects = getSelectedObjects(audioIds);

        setDefaultValue(selectedObjects)
        // eslint-disable-next-line
    }, [audioFiles, audioIds])

  return (
      <div>

          <Autocomplete
              onChange={(event, value) => { setAudioIds((value.map((x) => { return x.audioFileId }))); }}
              multiple
              options={audioFiles.map((item) => { return { "audioFileId": item.audioFileId, "name": item.name } })}
              value={defaultValue}
              getOptionLabel={(option) => option.name}
              renderOption={(props, option) => {
                  return (
                      <span {...props} key={option.audioFileId}>
                          {option.name}
                      </span>
                  );
              }}
              isOptionEqualToValue={(option, value) => option.audioFileId === value.audioFileId}
              renderInput={(params) => (
                  <TextField
                      {...params}
                      variant="standard"
                  />
              )}
          />
      </div>
  )
}
