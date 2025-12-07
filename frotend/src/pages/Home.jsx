import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [roomId, setroomId] = useState('');
  const [username, setusername] = useState('');
  const navigate = useNavigate();

  const handleenter = (e) => {
    if (e.key === 'Enter') joinroom();
  };

  const joinroom = () => {
    if (!roomId || !username) {
      toast.error("Please enter both roomId and username");
      return;
    }

    navigate(`/editor/${roomId}`, {
      state: { username }
    });
  };

  const createnewroom = (e) => {
    e.preventDefault();
    const id = uuidv4();
    setroomId(id);
    toast.success('New Room Created');
  };

  return (
    <div className='Homepagewrapper'>
      <div className='formwrapper'>
        <img className="homepagelogo" src="/code-sync.png" alt="Code-sync-logo" />

        <h4 className='mainlabel'>Paste Invitation Room ID</h4>

        <div className='inputGroup'>
          <input
            className='inputbox'
            placeholder='Enter Room ID'
            value={roomId}
            onChange={(e) => setroomId(e.target.value)}
            onKeyUp={handleenter}
          />

          <input
            className='inputbox'
            placeholder='Enter Name'
            onChange={(e) => setusername(e.target.value)}
            onKeyUp={handleenter}
          />

          <button className='btn joinbtn' onClick={joinroom}>Join</button>

          <span className='createinfo'>
            If you don't have an invite then create &nbsp;
            <a href="#" onClick={createnewroom} className='createnewbtn'>New room</a>
          </span>
        </div>
      </div>
    </div>
  )
}

export default Home;
