import React, { useState, useEffect } from 'react'
import { useMutation } from 'react-query'
import MapContainer from './MapContainer'

function Form(props){
  const [InputText, setInputText] = useState('')

  const onChange = (e) => {
    e.preventDefault()
    setInputText(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    props.changePlace(InputText)
    setInputText('')
  }
  return (<form className="inputForm" onSubmit= {handleSubmit} style={{position:'absolute', zIndex: 3}}>
  <fieldset class="fld_inside">
    <div class="box_searchbar">
      <input type="text" id="search.keyword.query" name="q" class="query tf_keyword bg_on" maxlength="100" autocomplete="off" accesskey="s" onChange={onChange} value={InputText}/>
      <input type="submit" id="search.keyword.submit" value="search"/>
    </div>
  </fieldset>
</form>);

}


function LandingPage() {
  const [InputText, setInputText] = useState('')
  const [Place, setPlace] = useState('')

  const onChange = (e) => {
    e.preventDefault()
    setInputText(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setPlace(InputText)
    setInputText('')
  }
  console.log('----last')
  return (      
          <div style={{position: 'relative'}}>
            <Form changePlace = {setPlace}/>
            {/* <form className="inputForm" onSubmit= {handleSubmit} style={{position:'absolute', zIndex: 3}}>
                  <fieldset class="fld_inside">
                    <div class="box_searchbar">
                      <input type="text" id="search.keyword.query" name="q" class="query tf_keyword bg_on" maxlength="100" autocomplete="off" accesskey="s" onChange={onChange} value={InputText}/>
                      <input type="submit" id="search.keyword.submit" value="search"/>
                    </div>
                  </fieldset>
            </form> */}


            <div id="info">
              <MapContainer searchPlace={Place} />
            </div>

          </div>
  )
}

export default LandingPage