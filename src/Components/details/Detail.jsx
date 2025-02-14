// import { arrayUnion, doc } from "firebase/firestore";
// import { useChatStore } from "../../lib/chatStore";
// import { auth } from "../../lib/firebase";
// import { useUserStore } from "../../lib/userStore";
// import "./detail.css";
// const Detail = () => {

//  const {chatId,user,isCurrentUserBlocked,isReceiverBlocked,changeBlock} =useChatStore();
//  const { currentUser } = useUserStore();
  
// const handleBlock = async() =>{
//   if(!user) return;
   
//   const userDocRef = doc(db,"users",currentUser.id)
//  try{
//    await updateDoc(userDocRef,{
//     blocked:isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
//    });
//    changeBlock()
//  }catch(e){
//   console.error(e);
//  }
// }

//   return (
//     <div className="detail">
//       <div className="user">
//         <img src={user?.avatar || "/avatar.png"} alt="" />
//         <h2>{user?.username}</h2>
//         <p>Lorem ipsum dolor sit, amet consectetur adipisicing </p>
//       </div>
//       <div className="info">
//         <div className="option">
//           <div className="title">
//             <span>Chat Settings</span>
//             <img src="./arrowUp.png" alt="" />
//           </div>
//         </div>
//         <div className="option">
//           <div className="title">
//             <span>Chat Settings</span>
//             <img src="./arrowUp.png" alt="" />
//           </div>
//         </div>
//         <div className="option">
//           <div className="title">
//             <span>Privacy % help</span>
//             <img src="./arrowUp.png" alt="" />
//           </div>
//         </div>
//         <div className="option">
//           <div className="title">
//             <span>Shared photos</span>
//             <img src="./arrowDown.png" alt="" />
//           </div>
//           <div className="photos">
//             <div className="photoitem">
//                 <div className="photoDetail">
//               <img
//                 src="https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg?auto=compress&cs=tinysrgb&w=600"
//                 alt=""
//                 />
//               <span>photo_2024_2.png</span>
//               <img src="/download.png" className="download" alt="" />
//                 </div>
//             </div>
//             <div className="photoitem">
//                 <div className="photoDetail">
//               <img
//                 src="https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg?auto=compress&cs=tinysrgb&w=600"
//                 alt=""
//                 />
//               <span>photo_2024_2.png</span>
//               <img src="/download.png" className="download" alt="" />
//                 </div>
//             </div>
//             <div className="photoitem">
//                 <div className="photoDetail">
//               <img
//                 src="https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg?auto=compress&cs=tinysrgb&w=600"
//                 alt=""
//                 />
//               <span>photo_2024_2.png</span>
//               <img src="/download.png" className="download" alt="" />
//                 </div>
//             </div>
//           </div>
//         </div>
        
//         <div className="option">
//           <div className="title">
//             <span>Shared Files</span>
//             <img src="./arrowUp.png" alt="" />
//           </div>
//         </div>
//         <button onClick={handleBlock}>{
//              isCurrentUserBlocked? "You are Blocked" : isReceiverBlocked ? "User Blocked" : "Block User"}</button>
//         <button onClick={()=>auth.signOut()}>Log out</button>
//       </div>
//     </div>
//   );
// };
// export default Detail;
import { arrayUnion, arrayRemove, doc, updateDoc } from "firebase/firestore";
import { useChatStore } from "../../lib/chatStore";
import { auth, db } from "../../lib/firebase";
import { useUserStore } from "../../lib/userStore";
import "./detail.css";

const Detail = (props) => {
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } = useChatStore();
  const { currentUser } = useUserStore();

  // Block/Unblock Handler
  const handleBlock = async () => {
    if (!user) return;

    const userDocRef = doc(db, "users", currentUser.id);
    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock(); // Update local state
    } catch (error) {
      console.error("Error updating block status:", error);
    }
  };

  return (
    <div className={ props.openMedia ? " detail d1":" detail d2"}>
      {/* User Info */}
      <div className="user">
        <img src={user?.avatar || "/avatar.png"} alt="User Avatar" />
        <h2>{user?.username || "Unknown User"}</h2>
        <p>Chat details and settings</p>
      </div>

      {/* Chat Options */}
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <img src="/arrowUp.png" alt="Toggle Icon" />
          </div>
        </div>

        <div className="option">
          <div className="title">
            <span>Privacy & Help</span>
            <img src="/arrowUp.png" alt="Toggle Icon" />
          </div>
        </div>

        {/* Shared Photos */}
        <div className="option">
          <div className="title">
            <span>Shared Photos</span>
            <img src="/arrowDown.png" alt="Toggle Icon" />
          </div>
          <div className="photos">
            {[1, 2, 3].map((_, idx) => (
              <div className="photoitem" key={idx}>
                <div className="photoDetail">
                  <img
                    src="https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Shared Photo"
                  />
                  <span>photo_{idx + 1}.png</span>
                  <img src="/download.png" className="download" alt="Download Icon" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shared Files */}
        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img src="/arrowUp.png" alt="Toggle Icon" />
          </div>
        </div>

        {/* Buttons */}
        <button onClick={handleBlock}>
          {isCurrentUserBlocked
            ? "You are Blocked"
            : isReceiverBlocked
            ? "User Blocked"
            : "Block User"}
        </button>
        <button onClick={() => auth.signOut()}>Log out</button>
      </div>
    </div>
  );
};

export default Detail;
