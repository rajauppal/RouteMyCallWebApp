
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "./LogoutButton";
import { setAccessToken, setCompanies, setCurrentCompanyId, setRoles } from "./slices/configSlice";
import { useDispatch, useSelector } from "react-redux";
import { CompanyClient } from "./api/server";
import { Grid, MenuItem, Select } from "@mui/material";

const Profile = (props) => {

  const { user, isAuthenticated, getAccessTokenSilently, getIdTokenClaims } = useAuth0();
  const dispatch = useDispatch();
  const globalInfo = useSelector((state) => state.globalInfo)
  const [companyList, setCompanyList] = useState([]);

  useEffect(() => {

    const getUserMetadata = async () => {

      try {

        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: "Epilinq IVR API",
            scope: "openid profile email read:messages manage:numbers"
          },
        });

        const claims = await getIdTokenClaims();

        const client = new CompanyClient(globalInfo.apiRoot, undefined, accessToken);

        client.getCompanyId().then((companyId) => {
          dispatch(setRoles(claims[globalInfo.nameSpace + "roles"]))
          dispatch(setAccessToken(accessToken));
        })
        client.getCompanies().then((data) => {
          //console.log(data)
          dispatch(setCompanies(JSON.stringify(data)));
          if (data.length > 0 && !globalInfo.currentCompanyId) {
            dispatch(setCurrentCompanyId(data[0].companyId));
          }
        })

      } catch (e) {
        console.log(`Error: ${e.message}`);
      }
    };

    getUserMetadata();
  // eslint-disable-next-line
  }, [globalInfo, getAccessTokenSilently, user?.sub]);

  function switchCompany(companyId) {
    dispatch(setCurrentCompanyId(companyId));
  }

  useEffect(() => {
    try {
      setCompanyList(JSON.parse(globalInfo.companies));
    } catch (error) {
      console.log(globalInfo.companies)
    }
    //console.log(globalInfo.companies)
  }, [globalInfo])


  return (
    isAuthenticated && (
      <div>
        <Grid container spacing={1} width={1000}>
          <Grid width={400}>
            <span style={{ marginLeft: 20, fontWeight: 'bolder' }}>{user.email}</span>  <LogoutButton></LogoutButton>
          </Grid>
          <Grid width={400}>
            <br></br>
            {
              companyList && companyList.length > 1
              && <Select width={50} value={globalInfo.currentCompanyId} onChange={(e) => { switchCompany(e.target.value) }}>
                {
                  companyList.map((item, index) => {
                    return <MenuItem value={item.companyId} key={index}>{(item.name)}</MenuItem>
                  })
                }
              </Select>
            }
          </Grid>

        </Grid>
      </div>
    )
  );
};

export default Profile;