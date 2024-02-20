import React from 'react'
import { useSelector } from 'react-redux'

export default function Users() {
    const globalInfo = useSelector((state) => state.globalInfo)

    return (<>
    {globalInfo.currentCompanyId && globalInfo.accessToken && globalInfo.isAdministrator && 
        <div>
            UsersAA
        </div>
    }
    </>)
}
