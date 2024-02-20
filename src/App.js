import { useAuth0 } from '@auth0/auth0-react';
import './App.css';
import Dashboard from './components/Dashboard';
import Profile from './Profile';
import LoginButton from './Login'
import { useSelector, } from 'react-redux'
import Home from './components/Home/Home';


function App() {
  const { isAuthenticated } = useAuth0();

  const globalInfo = useSelector((state) => state.globalInfo)

  // eslint-disable-next-line
  Object.defineProperty(String.prototype, "getFormattedPhoneNum", {
    value: function getFormattedPhoneNum() {
      let output = "(";
      this.replace(/^\D*(\d{0,3})\D*(\d{0,3})\D*(\d{0,4})/, function (match, g1, g2, g3) {
        if (g1.length) {
          output += g1;
          if (g1.length === 3) {
            output += ")";
            if (g2.length) {
              output += " " + g2;
              if (g2.length === 3) {
                output += "-";
                if (g3.length) {
                  output += g3;
                }
              }
            }
          }
        }
      }
      );
      return output;
    },
    writable: true,
    configurable: true,
  });

  return (
    <div style={{padding:20}}>
       {
        isAuthenticated && <Profile></Profile>
      }
      {
        !isAuthenticated && <LoginButton></LoginButton>
      }
      {
        isAuthenticated && globalInfo.currentCompanyId && globalInfo.accessToken && globalInfo.isOwner && <Dashboard style={{padding:20}}></Dashboard>

      } 

    </div> 
  );
}

export default App;
