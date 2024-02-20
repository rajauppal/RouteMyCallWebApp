import { createSlice } from '@reduxjs/toolkit'

export const configSlice = createSlice({
  name: 'globalInfo',
  initialState: {
    //apiRoot:  process.env.NODE_ENV==="production"? "https://ivrapiprod.azurewebsites.net" : "https://localhost:44369",
    //apiRoot:   "https://ivrapitest.azurewebsites.net",
    apiRoot:   "https://ivrapiprod.azurewebsites.net",
    //apiRoot:"https://localhost:44369",
    //apiRoot:  "https://28ca-2601-200-c100-24-2876-6dcb-d7a3-2389.ngrok-free.app",
    accessToken:"",
    roles:[""],
    isAdministrator:false,
    isOwner:false,
    nameSpace:"https://example.com/",
    companies:"[]",
    currentCompanyId: ""
  },
  reducers: {
    setAPIRoot: (state, action) => {
      state.apiRoot = action.payload
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload
    },
    setCompanies: (state, action) => {
      state.companies = action.payload
    },
    setCurrentCompanyId: (state, action) => {
      state.currentCompanyId = action.payload
    },
    setRoles: (state, action) => {
      state.roles = action.payload;
      state.isAdministrator = state.roles.filter((x)=>x.toLowerCase() === "administrator").length > 0
      state.isOwner = state.roles.filter((x)=>x.toLowerCase() === "business owner").length > 0
    },
    
  },
})

// Action creators are generated for each case reducer function
export const { setAPIRoot,  setAccessToken, setRoles, setCompanies, setCurrentCompanyId } = configSlice.actions

export default configSlice.reducer