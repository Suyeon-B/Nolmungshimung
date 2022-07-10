import React, { useState } from 'react'
import { useMutation } from 'react-query'
import MapContainer from './MapContainer'

function LandingPage() {
  const [InputText, setInputText] = useState('')
  const [Place, setPlace] = useState('')

  const onChange = (e) => {
    setInputText(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setPlace(InputText)
    setInputText('')
  }

  return (
    
        
          <div style={{position: 'relative'}}>
            <form className="inputForm" onSubmit={handleSubmit} style={{position:'absolute', zIndex: 3}}>
                  <fieldset class="fld_inside">
                    <div class="box_searchbar">
                      <input type="text" id="search.keyword.query" name="q" class="query tf_keyword bg_on" maxlength="100" autocomplete="off" accesskey="s" onChange={onChange} value={InputText}/>
                      <button type="submit" id="search.keyword.submit">검색</button>
                    </div>
                    {/* <div class="choice_currentmap">
                        <input type="checkbox" id="boundscheck" class="screen_out"/>
                        <label id="search.keyword.bounds" for="boundscheck" class="lab_currentmap INACTIVE"><span id="search.keyword.currentmap" class="ico_currentmap"></span>현 지도 내 장소검색</label>
                    </div> */}
                  </fieldset>
            </form>


            <div id="info">
              <MapContainer searchPlace={Place} />
            </div>

          </div>
  )
}

export default LandingPage