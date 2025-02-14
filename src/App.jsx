
import { useEffect, useState } from 'react'
import Chat from './Components/chat/Chat'
import Detail from './Components/details/Detail'
import List from './Components/list/List'
import Login from './Components/login/Login'
import Notification from './Components/notifcation/Notification'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './lib/firebase'
import { useUserStore } from './lib/userStore'
import { useChatStore } from './lib/chatStore'


const App = () =>{
  

  const {currentUser,isLoading,fetchUserInfo} = useUserStore()
  const {chatId} = useChatStore();
  const [openMedia,setOpenMedia] = useState(false);

  const handleOpenMedia = ()=>{
    setOpenMedia(s=>!s);
  }

  useEffect(()=>{
    const unSub = onAuthStateChanged(auth,(user)=>{
      fetchUserInfo(user?.uid);
      console.log(user);
    })

    return()=>{
      unSub();
    }
  },[fetchUserInfo]);
  console.log(currentUser);
  

  if(isLoading) return <div className='loading'>Loading...</div>

  return(
    <div className="container">
    {currentUser ? (
      <>
       <List/>
      {chatId && <Chat media={handleOpenMedia}/>}
      {chatId && <Detail openMedia={openMedia} />}
      </>)
     : (<Login/>
)}
     <Notification/>
    </div>
  )
}
export default App;
