import { Button, Grid, Input, ListSubheader,  MenuItem, Select } from '@mui/material';
import  { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { ExtensionClient, MenuClient, PhoneNumberClient, RuleClient, RuleUI } from '../../api/server';
import RuleItems from './RuleItems';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditRule() {
  const globalInfo = useSelector((state) => state.globalInfo)
  
  let { currentRuleId } = useParams();
  const navigate = useNavigate();
  
  const [ruleItems, setRuleItems] = useState("[]");

  const [ruleName, setRuleName] = useState("");
  const [ruleTrigger, setRuleTrigger] = useState("0")
  const [ruleAction, setRuleAction] = useState("0")
  
  const [ruleActionDefault, setRuleActionDefault] = useState("0")
  const [ruleActionDefaultValue, setRuleActionDefaultValue] = useState("{}")

  const [addRuleMode, setAddRuleMode] = useState(true);

  const [actions, setActions] = useState([]);
  const [phoneNumbers, setPhoneNumbers] = useState([]);

  function reload() {
    const client = new RuleClient(globalInfo.apiRoot, undefined, globalInfo.accessToken);

    if (currentRuleId) {

      client.getRuleById(currentRuleId).then((ruleData) => {
        setRuleItems(ruleData.ruleItems)
        setRuleName(ruleData.ruleName)
        setRuleActionDefault(ruleData.defaultRuleAction);
        setRuleActionDefaultValue(getRuleActionDefaultValue(ruleData.defaultRuleAction));
      })
    }else{
      setAddRuleMode(true)
    }
  }

  
  function onClose(){
    navigate("/rules")
  } 

  function isFormInValid() {
    if (ruleName && ruleActionDefaultValue !== "{}" && ruleTrigger === "0" && ruleAction === "0") {
      return false;
    }

    
    
    return true;
  }

  function addRuleItem() {

    var ruleActionObject = JSON.parse(ruleAction);
    var ruleTriggerObject = JSON.parse(ruleTrigger);

    var ruleItemsObject = { "Trigger": { "Name": ruleTriggerObject.name, "Value": ruleTriggerObject.objectId }, "Action": { "Action": ruleActionObject.action, "ObjectId": ruleActionObject.objectId }, "Display": ruleTriggerObject.display + " " + ruleActionObject.display }

    var tempRuleItems = JSON.parse(ruleItems);

    tempRuleItems.push(ruleItemsObject);

    setRuleItems( JSON.stringify(tempRuleItems));

    setRuleTrigger("0")
    setRuleAction("0")
    //setAddRuleMode(false)
  }
  function saveRule() {
    const client = new RuleClient(globalInfo.apiRoot, undefined, globalInfo.accessToken);

    var ruleUI = new RuleUI();
    ruleUI.ruleItems = ruleItems;
    ruleUI.ruleName = ruleName;
    ruleUI.defaultRuleAction = ruleActionDefault;
    
    if (currentRuleId) {
      updateRuleInfo(client, currentRuleId, ruleUI)
    }
    else {
      client.addRule(globalInfo.currentCompanyId, ruleName).then((ruleData) => {
        updateRuleInfo(client, ruleData.ruleId, ruleUI)
      })
    }
  }

  function updateRuleInfo(client, ruleId, ruleUI){
    client.updateRule(ruleId, ruleUI).then(() => {
      client.updateRuleItems(ruleId, ruleUI).then(() => {
        onClose();
      })
    })
  }

  function onDeleteRule(index) {
    var tempRuleItems = JSON.parse(ruleItems);
    tempRuleItems.splice(index, 1)

    setRuleItems(JSON.stringify(tempRuleItems))
  }

  useEffect(() => {

    const client1 = new ExtensionClient(globalInfo.apiRoot, undefined, globalInfo.accessToken);
    const client2 = new MenuClient(globalInfo.apiRoot, undefined, globalInfo.accessToken);
    const client3 = new RuleClient(globalInfo.apiRoot, undefined, globalInfo.accessToken);
    const client4 = new PhoneNumberClient(globalInfo.apiRoot, undefined, globalInfo.accessToken);


    Promise.all([
      client1.getExtensions(globalInfo.currentCompanyId),
      client2.getMenus(globalInfo.currentCompanyId),
      client3.getRules(globalInfo.currentCompanyId),
      client4.getPhoneNumbers(globalInfo.currentCompanyId)
    ]).then((data) => {
      var arrActions = [];
      var extensions = data[0];
      var menus = data[1];
      var rules = data[2];
      var phoneNumberData = data[3];

      setPhoneNumbers(phoneNumberData);

      arrActions.push({ "section": "-- Extensions --" })
      extensions.forEach(extension => {
        arrActions.push({ name: `Transfer Call To ${extension.name}`, value: `GOTOEXTENSION-${extension.extensionId}`, action: `GOTOEXTENSION`, objectId: extension.extensionId })
      });

      arrActions.push({ "section": "-- Menu Items --" })
      menus.forEach(menu => {
        arrActions.push({ name: "Go To " + menu.menuName, value: `GOTOMENU-${menu.menuId}`, action: `GOTOMENU`, objectId: menu.menuId })
      });

      arrActions.push({ "section": "-- Rules --" })
      rules.forEach(rule => {
        if(rule.ruleId !== currentRuleId){
          arrActions.push({ name: "Run Rule " + rule.ruleName, value: `EXECUTERULE-${rule.ruleId}`, action: `EXECUTERULE`, objectId: rule.ruleId })
        }
      });

      arrActions.push({ "section": "-- Other Actions --" })
      arrActions.push({ name: "Hangup", value: "Hangup", action: "HANGUP", objectId: "" })
      arrActions.push({ name: "Transfer To Voicemail", value: "Voicemail", action: "VOICEMAIL", objectId: "" })

      setActions(arrActions)

      reload();
    })

    setActions([])
    // eslint-disable-next-line
  }, [globalInfo, currentRuleId])

  function onChange(event, child) {
    var temp = {...(JSON.parse(event.target.value)), name:child.props.name}

    setRuleActionDefault(JSON.stringify(temp));
    setRuleActionDefaultValue(getRuleActionDefaultValue(JSON.stringify(temp)))
  }

  function getRuleActionDefaultValue(val) {
    if(val === "0") return val;

    var temp = JSON.parse(val)

    var temp2 = {action: temp.action, objectId:temp.objectId};

    return JSON.stringify(temp2);
  }

  function getRuleTriggerName(){
    return JSON.parse(ruleTrigger).name == "PhoneNumberDialedIs"?"":"none"
  }

  return (
    <div style={{ padding: 20 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          Rule Name:<br></br>
          <Input value={ruleName} onChange={(e) => { setRuleName(e.target.value) }}></Input>
          <br></br>

          <hr></hr>
          <h2>Rules</h2>
          {ruleItems && <RuleItems ruleItems={ruleItems} onDeleteRule={onDeleteRule}></RuleItems>}
          <br></br>
          {
            !addRuleMode && <div>
              <Button variant='outlined' onClick={(e) => { setAddRuleMode(true) }}>Add New Rule</Button>
            </div>
          }
          {
            addRuleMode && <div>
              <Select value={ruleTrigger} style={{ width: 400 }} onChange={(e) => { setRuleTrigger(e.target.value) }}>
                <MenuItem key={0} value={"0"}>--Select a Condition --</MenuItem>
                <MenuItem key={"IsNowAHoliday"} value={JSON.stringify({ "display": "When It Is A Holiday", "name": "IsNowAHoliday", "objectId": "" })}>When It Is A Holiday</MenuItem>
                <MenuItem key={"IsBusinessClosed"} value={JSON.stringify({ "display": "When The Business Is Closed", "name": "IsBusinessClosed", "objectId": "" })}>When The Business Is Closed</MenuItem>
                <MenuItem key={"IsBusinessOpen"} value={JSON.stringify({ "display": "When The Business Is Open", "name": "IsBusinessOpen", "objectId": "" })}>When The Business Is Open</MenuItem>
                {
                  phoneNumbers.map((item, index) => {
                    return <MenuItem key={item.phoneNumberId} value={JSON.stringify({ display: `When Phone Number Dialed is ${item.phoneNumberDigits}`, name: "MatchDialedNumber", objectId: item.phoneNumberId })}>When Phone Number Dialed is {item.phoneNumberDigits}</MenuItem>
                  })
                }
                <MenuItem key={"PhoneNumberDialed"} value={JSON.stringify({ "display": "Phone Number Dialed Is", "name": "PhoneNumberDialedIs", "objectId": "" })}>When Phone Number Dialed Is</MenuItem>

              </Select>
              <Input style={{display:getRuleTriggerName()}} placeholder='Phone Number' ></Input>
              &nbsp;&nbsp;
              <Select value={ruleAction} style={{ width: 400 }} onChange={(e) => { setRuleAction(e.target.value) }}>
                <MenuItem key={-1} value={"0"}>--Select an Action --</MenuItem>
                {actions.map((item, index) => {
                  if (item.section) {
                    return <ListSubheader key={index} >{item.section}</ListSubheader>
                  }
                  else {
                    return <MenuItem key={index} value={JSON.stringify({ display: item.name, name: item.name, action: item.action, objectId: item.objectId })}>{item.name}</MenuItem>
                  }
                })}

              </Select>
              &nbsp;&nbsp;
              <Button variant='outlined' disabled={ruleTrigger === "0" || ruleAction === "0"} onClick={(e) => { addRuleItem() }}>Add</Button>&nbsp;&nbsp;
              <br></br>
            </div>
          }
          
          <hr></hr>
          Last Priority: When none of the above rules match:&nbsp; 
          {
            <>
              <Select value={ruleActionDefaultValue } style={{ width: 400 }} onChange={onChange}>
                <MenuItem key={-1} value={"{}"}>--Select an Action --</MenuItem>
                {actions.map((item, index) => {
                  if (item.section) {
                    return <ListSubheader key={index} >{item.section}</ListSubheader>
                  }
                  else {
                    return <MenuItem key={index} name={item.name} value={JSON.stringify({ action: item.action, objectId: item.objectId })}>{item.name}</MenuItem>
                  }
                })}

              </Select>
            </>
          }
          <br></br>
          <br></br>
          <Button variant='outlined' disabled={isFormInValid()} onClick={() => { saveRule() }}>Save</Button>
          &nbsp;&nbsp;<Button variant='outlined' onClick={() => { onClose() }}>Close</Button>
          {/* {ruleActionDefault}
          <br></br>
          {ruleActionDefaultValue} */}
        </Grid>
      </Grid>
    </div>
  )
}
