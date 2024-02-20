import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react'

export default function RuleItems(props) {
    const { ruleItems, onDeleteRule} = props;

    const [ruleItemsArray, setRuleItemsArray] = useState([]);

    useEffect(()=>{
        setRuleItemsArray( JSON.parse(ruleItems))
    }, [ruleItems])

  return (
      
          <div>
              <table width={"100%"}>
                <tbody>
                  {
                      ruleItemsArray.map((item, index) => {
                          return <tr key={index}>
                              <td>
                                  Priority {index + 1}:
                              </td>
                              <td>
                                  {item.Display}
                              </td><td>
                                  <Button variant='outlined' onClick={() => { onDeleteRule(index) }}>Delete</Button>
                              </td>

                          </tr>
                      })
                  }
                </tbody>
              </table>
          </div>
      
  )
}
