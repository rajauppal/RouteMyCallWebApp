import { Button } from '@mui/material';
import { TelnyxRTC } from '@telnyx/webrtc';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { CallUsingMyPhoneClient } from '../../api/server';

const TelnyxWebRTCComponent = () => {
  const globalInfo = useSelector((state) => state.globalInfo)

  const [phoneNumber, setPhoneNumber] = useState("")
  const [client, setClient] = useState(null);
  const [currentCall, setCurrentCall] = useState(null);
  const [connectStatus, setConnectStatus] = useState('Not Connected');
  const [callStatus, setCallStatus] = useState('');
  const [audioOutDevices, setAudioOutDevices] = useState([{ deviceId: "1" }, { deviceId: "2" }]);

  let { currentPhoneNumberId } = useParams();

  const fetchTokenAndConnect = () => {
    const client = new CallUsingMyPhoneClient(globalInfo.apiRoot, undefined, globalInfo.accessToken);

    client.getTokenByPhoneNumberId(currentPhoneNumberId).then((token) => {
      connect(token)
    });

  }
  useEffect(() => {
    fetchTokenAndConnect()
  }, [currentPhoneNumberId]);

  const onDigitPress = (digit) => {
    if (callStatus == 'active') {
      currentCall.dtmf(digit);

    }
    else {
      setPhoneNumber(phoneNumber + digit)

    }
  }

  const onBackspace = () => {
    if (phoneNumber.length > 0) {
      var newNumber = phoneNumber.substring(0, phoneNumber.length - 1);
      setPhoneNumber(newNumber)
    }
  }

  const detachListeners = (telnyxClient) => {
    if (telnyxClient) {
      telnyxClient.off('telnyx.error');
      telnyxClient.off('telnyx.ready');
      telnyxClient.off('telnyx.notification');
      telnyxClient.off('telnyx.socket.close');
    }
  };

  const connect = (token) => {
    setConnectStatus('Connecting...');

    //debugger;
    console.log(token.split("|")[0])
    console.log(token.split("|")[1])
    try {
      const telnyxClient = new TelnyxRTC({
        env: 'production',
        login: token.split("|")[0], // 'arroyo11',
        password: token.split("|")[1], //'Rajaraja1!!!',
        //login_token: token,
        //ringtoneFile: './sounds/incoming_call.mp3',
      });

      telnyxClient.remoteElement = 'remoteMedia';
      telnyxClient.localElement = 'localMedia';

      telnyxClient.enableMicrophone();

      telnyxClient.on('telnyx.ready', () => {
        setConnectStatus('Connected');
      });

      telnyxClient.on('telnyx.socket.close', () => {
        setConnectStatus('Disconnected');
        telnyxClient.disconnect();
        detachListeners(telnyxClient);
      });

      telnyxClient.on('telnyx.error', (error) => {
        console.error('telnyx error:', error);
        //alert(error.message);
        setConnectStatus('Disconnected');
        telnyxClient.disconnect();
        detachListeners(telnyxClient);
      });

      telnyxClient.on('telnyx.notification', (notification) => {
        console.log(notification.type)
        switch (notification.type) {
          case 'callUpdate':
            handleCallUpdate(notification.call);
            break;
          case 'userMediaError':
            console.log(
              'Permission denied or invalid audio/video params on `getUserMedia`'
            );
            break;
        }
      });

      setConnectStatus('Connecting...');

      console.log("'Connecting...using token = " + token)
      setClient(telnyxClient);

      telnyxClient.connect();
    } catch (error) {
      console.error('Error creating TelnyxRTC client:', error);
    }
  };

  const handleCallUpdate = (call) => {
    setCurrentCall(call);
    setCallStatus(call.state);

    switch (call.state) {
      case 'new':
        // Setup the UI
        break;
      case 'trying':
        // You are trying to call someone and he's ringing now
        break;
      case 'recovering':
        // Call is recovering from a previous session
        if (window.confirm('Recover the previous call?')) {
          currentCall.answer();
        } else {
          currentCall.hangup();
        }
        break;
      case 'ringing':
        // Someone is calling you
        // used to avoid alert block audio play, I delayed to audio play first.
        setTimeout(() => {
          if (window.confirm('Pick up the call?')) {
            currentCall.answer();
          } else {
            currentCall.hangup();
          }
        }, 1000);
        break;
      case 'active':
        // Call has become active
        // Update UI as needed
        break;
      case 'hangup':
        // Call is over
        // Update UI as needed
        break;
      case 'destroy':
        // Call has been destroyed
        setCurrentCall(null);
        break;
    }
  };

  const makeCall = () => {
    client.getAudioOutDevices().then((result) => {
      setAudioOutDevices(result);
    });

    const params = {
      callerName: 'Caller Name',
      callerNumber: 'Caller Number',
      destinationNumber: phoneNumber,
      audio: true,
      video: false,
    };

    setCurrentCall(client.newCall(params));
  };

  const hangup = () => {

    if (currentCall) {
      currentCall.hangup();
    }
  };



  return (
    <div>
      {/* {audioOutDevices.map((item, index) => {
        return <div>{item.deviceId}</div>
      })} */}
      {
        connectStatus === "Connected" &&
        <table>
          <tbody>
            <tr>
              <td colSpan={2} >

                {phoneNumber}

              </td>
              <td>
                <Button size='large' variant='outlined' onClick={() => { onBackspace() }}> {"<"} </Button>
              </td>
            </tr>
            <tr>
              <td>
                <Button size='large' variant='outlined' onClick={() => { onDigitPress("1") }}>1</Button>
              </td>
              <td>
                <Button size='large' variant='outlined' onClick={() => { onDigitPress("2") }}>2</Button>
              </td>
              <td>
                <Button size='large' variant='outlined' onClick={() => { onDigitPress("3") }}>3</Button>
              </td>
            </tr>
            <tr>
              <td>
                <Button size='large' variant='outlined' onClick={() => { onDigitPress("4") }}>4</Button>
              </td>
              <td>
                <Button size='large' variant='outlined' onClick={() => { onDigitPress("5") }}>5</Button>
              </td>
              <td>
                <Button size='large' variant='outlined' onClick={() => { onDigitPress("6") }}>6</Button>
              </td>
            </tr>
            <tr>
              <td>
                <Button size='large' variant='outlined' onClick={() => { onDigitPress("7") }}>7</Button>
              </td>
              <td>
                <Button size='large' variant='outlined' onClick={() => { onDigitPress("8") }}>8</Button>
              </td>
              <td>
                <Button size='large' variant='outlined' onClick={() => { onDigitPress("9") }}>9</Button>
              </td>
            </tr>
            <tr>
              <td>
                <Button size='large' variant='outlined' onClick={() => { onDigitPress("*") }}>*</Button>
              </td>
              <td>
                <Button size='large' variant='outlined' onClick={() => { onDigitPress("0") }}>0</Button>
              </td>
              <td>
                <Button size='large' variant='outlined' onClick={() => { onDigitPress("#") }}>#</Button>
              </td>
            </tr>
            <tr>
              <td colSpan={3} style={{ textAlign: 'center' }} >
                {
                  callStatus == "requesting" || callStatus == "trying" || callStatus == "early" || callStatus == "active" ?
                    <Button size='large' color='warning' variant='contained' disabled={phoneNumber.length != 10} onClick={() => { hangup(); }}>End Call</Button> :
                    <Button size='large' color='primary' variant='contained' disabled={phoneNumber.length != 10} onClick={() => { makeCall(); }}>Dial</Button>
                }
              </td>
            </tr>
          </tbody>
        </table>
      }


      {connectStatus != "Connected" &&

        <button
          id="btnConnect"
          className="btn btn-block btn-success"
          style={{ marginTop: '20px' }}
          onClick={() => { fetchTokenAndConnect() }}
        >
          Connect
        </button>
      }
      <small>Connection Status: <span id="connectStatus">{connectStatus}</span></small>
      <br />
      <small>Call Status: <span id="connectStatus">{callStatus}</span></small>

    </div>
  );
};

export default TelnyxWebRTCComponent;
