import { Button } from '@mui/material';
import { TelnyxRTC } from '@telnyx/webrtc';
import React, { useRef, useEffect, useState } from 'react'; // Import useRef and useEffect


function PhoneUI() {
  const client = useRef(null); // Use useRef for client to avoid re-renders causing recreation
  const remoteVideoRef = useRef(null); // Use useRef for video elements
  const localVideoRef = useRef(null);  // Use useRef for video elements

  const [call,setCall] = useState(null); 

  useEffect(() => {
    // Initialize TelnyxRTC when component mounts
    client.current = new TelnyxRTC ({
      env: 'production',
      //login_token: 'YOUR_LOGIN_TOKEN', // Replace with your actual login token
      login: "arroyo11",
      password: "Rajaraja1!!!",

    });

    // Set up event listeners
    client.current
      .on('telnyx.ready', () => console.log('ready to call'))
      .on('telnyx.error', (error) => console.error('Telnyx error:', error));

    // Set video elements on the client
    client.current.remoteElement = remoteVideoRef.current;
    client.current.localElement = localVideoRef.current;

    return () => {
      // Cleanup when component unmounts
      if (client.current) {
        client.current.disconnect(); // Disconnect the client to release resources
      }
    };
  }, []); // Empty dependency array ensures useEffect runs only once on mount

  const connectToServer = () => {
    client.current.enableMicrophone();
    //client.current.enableWebcam();

    // Connect to the server
    client.current.connect();
  };

  const makeOutgoingCall = () => {
    // Make an outgoing call
    const call1 = client.current.newCall({
      callerNumber: '+17074266047',
      destinationNumber: '+15302312582',
      audio: true,
      video: true,
    });

    setCall(call1)
  };

  return (
    <div>
      <Button variant='outlined' onClick={connectToServer}>
        Connect
      </Button>
      <Button variant='outlined' onClick={makeOutgoingCall}>
        Call
      </Button>


      { <>
        <video
        ref={remoteVideoRef}
        id='remoteVideo'
        autoPlay
        controls={false}
      ></video>
      <video
        ref={localVideoRef}
        id='localVideo'
        autoPlay
        controls={false}
      ></video>
      </>}
      
    </div>
  );
}

export default PhoneUI;