import React from 'react'
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import {toast} from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
function Home() {
  const[roomId,setroomId]=useState('');
  const navigate=useNavigate();
  const[username,setusername]=useState('');
  const handleenter=(e)=>{
    if(e.code=='Enter'){
 joinroom();
    }
  }
  const joinroom=()=>{
    if(!roomId || !username){
      toast.error("Please enter  both roomId and username");
      return;
    }
    navigate(`/editor/${roomId}`,{
      state
:{
  username,
}    })
  }
const createnewroom=(e)=>{
  
  e.preventDefault();
  const id=uuidv4();
  console.log(id);
  setroomId(id);
  toast.success('New Room Created');
}
  return (
    <div className='Homepagewrapper'>
      <div className='formwrapper'>
        <img className="homepagelogo" src="/code-sync.png" alt="Code-sync-logo" />
        <h4 className='mainlabel'>Paste Invitation RoomId</h4>
      <div className='inputGroup'>
        <input type='text' className='inputbox' placeholder='Enter RoomId' onChange={(e)=>setroomId(e.target.value)} value={roomId} onKeyUp={handleenter}/>
        <input type='text' className='inputbox' placeholder='Enter Name' onChange={(e)=>setusername(e.target.value)} onKeyUp={handleenter}/>
        <button className='btn joinbtn' onClick={joinroom}>Join</button>
        <span className='createinfo'>if you dont have an invite then create &nbsp;
          <a onClick={createnewroom}href='' className='createnewbtn'>New room</a>

        </span>
      </div>
      </div>
</div>
  )
}

export default Home
