import { MenuItem, Select } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentCompanyId } from '../slices/configSlice';

function CompanySwitcher() {
    const dispatch = useDispatch();
    const globalInfo = useSelector((state) => state.globalInfo)
    const [companyList, setCompanyList] = useState([]);

    useEffect(() => {
        try {
          setCompanyList(JSON.parse(globalInfo.companies));
        } catch (error) {
          console.log(globalInfo.companies)
        }
        //console.log(globalInfo.companies)
      }, [globalInfo])

      function switchCompany(companyId) {
        dispatch(setCurrentCompanyId(companyId));
      }

  return (
    <div>
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
    </div>
  )
}

export default CompanySwitcher