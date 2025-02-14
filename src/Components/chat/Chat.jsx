// import { useEffect, useRef, useState } from "react";
// import "./chat.css";
// import EmojiPicker from "emoji-picker-react";
// import { doc, onSnapshot } from "firebase/firestore";
// import { db } from "../../lib/firebase";
// import { useChatStore } from "../../lib/chatStore";
// const Chat = () => {
//   const [chat, setChat] = useState();
//   const [open, setOpen] = useState(false);
//   const [text, setText] = useState("");

//   const { chatId } = useChatStore();
//   const endRef = useRef(null);

//   useEffect(() => {
//     endRef.current?.scrollIntoView({ behavior: "smooth" });
//   });

//   useEffect(() => {
//     const unSub = onSnapshot(
//       doc(db, "chats", chatId),
//       (res) => {
//         setChat(res.data());
//       }
//     );

//     return () => {
//       unSub();
//     };
//   }, [chatId]);
//   console.log(chat);
  

//   const handleEmoji = (emojiObject) => {
//     // console.log(emojiObject.emoji);
//     setText((e) => e + emojiObject.emoji);
//     setOpen(false);
//   };
//   return (
//     <div className="Chat">
//       <div className="top">
//         <div className="user">
//           <img src="/avatar.png" alt="" />
//           <div className="texts">
//             <span>Jane Doe</span>
//             <p>Lorem ipsum dolor sit amet </p>
//           </div>
//         </div>
//         <div className="icons">
//           <img src="/phone.png" alt="" />
//           <img src="/video.png" alt="" />
//           <img src="/info.png" alt="" />
//         </div>
//       </div>
//       <div className="center">
//         {chat.message.map((message)=>(  
//          <div className="message own " key={message?.createAt}>
//          <div className="texts">
//          { message.img &&  <img
//              src="https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg?auto=compress&cs=tinysrgb&w=600"
//              alt=""
//            />}
//            <p>
//              {message.text}
//            </p>
//            {/* <span>{message}</span> */}
//          </div>
//        </div>
//         ))}
//         <div ref={endRef}></div>
//       </div>
//       <div className="bottom">
//         <div className="icons">
//           <img src="/img.png" alt="" />
//           <img src="/camera.png" alt="" />
//           <img src="/mic.png" alt="" />
//         </div>
//         <input
//           type="texts"
//           placeholder="Types a message..."
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//         />
//         <div className="emoji">
//           <img src="/emoji.png" alt="" onClick={() => setOpen((e) => !e)} />
//           <div className="picker">
//             {" "}
//             {open && <EmojiPicker onEmojiClick={handleEmoji} />}
//           </div>
//         </div>
//         <button className="sendButton">Send</button>
//       </div>
//     </div>
//   );
// };
// export default Chat;
import { useEffect, useRef, useState } from "react";
import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import CameraAccess from "../CameraAcces/CameraAcces";

const Chat = (props) => {
  const [chat, setChat] = useState(null); // Initialize chat as null
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [iscam, setiscam] = useState(false);
  const [img, setImg] = useState({ file: null, url: "" });
  const { currentUser } = useUserStore();
  const { chatId, user,isCurrentUserBlocked , isReceiverBlocked } = useChatStore();
  const endRef = useRef(null);

  // Scroll to the bottom whenever new messages are added
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // Firestore listener to fetch chat messages
  useEffect(() => {
    if (chatId) {
      const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
        setChat(res.data());
      });

      return () => {
        unSub(); // Clean up listener on unmount
      };
    }
  }, [chatId]);

  // Function to handle emoji selection
  const handleEmoji = (emojiObject) => {
    setText((prev) => prev + emojiObject.emoji);
    setOpen(false); // Close emoji picker after selection
  };

  // Function to handle image selection
  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleCamera = () =>{
    setiscam(s=>!s);
  }

  // Function to upload an image to Firebase Storage
  const upload = async (file) => {
    const storage = getStorage();
    const storageRef = ref(storage, `images/${file.name}-${Date.now()}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  // Function to send a message
  const handleSend = async () => {
    if (text === "" && !img.file) return; // Prevent sending empty messages

    let imgUrl = null;

    try {
      // Upload image if one is selected
      if (img.file) {
        imgUrl = await upload(img.file);
      }

      // Update the chat document with the new message
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderID: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }), // Include image URL if available
        }),
      });

      // Update user chat metadata
      const userIDs = [currentUser.id, user.id];
      userIDs.forEach(async (id) => {
        const userChatRef = doc(db, "userchats", id);
        const userChatsSnapshot = await getDoc(userChatRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();
          const chatIndex = userChatsData.chats.findIndex((c) => c.chatId === chatId);

          userChatsData.chats[chatIndex].lastMessage = text || "Image";
          userChatsData.chats[chatIndex].isSeen = id === currentUser.id;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatRef, {
            chats: userChatsData.chats,
          });
        }
      });

      // Reset input and image state
      setImg({ file: null, url: "" });
      setText("");
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  return (
    <div className="Chat">
      {/* Top Section */}
      <div className="top">
        <div className="user">
          <img src={user.avatar || "/avatar.png"} alt="User Avatar" />
          <div className="texts">
            <span>{user?.username || "User"}</span>
            <p>{user?.status || "Online"}</p>
          </div>
        </div>
        <div className="icons">
          <img src="/phone.png" alt="Phone Icon" />
          <img src="/video.png" alt="Video Icon" />
          <img src="/info.png" alt="Info Icon" className="info" onClick={()=>props.media()} /> {/**need to add */}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="center">
        {chat?.messages?.map((message) => (
          <div
            className={message.senderID === currentUser?.id ? "message own" : "message"}
            key={message?.createdAt}
          >
            <div className="texts">
              {message.img && <img src={message.img} alt="Message Media" />}
              <p>{message.text}</p>
            </div>
          </div>
        ))}

        {/* Preview the selected image */}
        {img.url && (
          <div className="message own">
            <div className="texts">
              <img src={img.url} alt="Selected for Upload" />
            </div>
          </div>
        )}
        <div ref={endRef}></div>
      </div>

      {/* Bottom Section */}
      <div className="bottom">
        <div className="icons">
          <label htmlFor="file">
            <img src="/img.png" alt="Image Icon" />
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleImg}
          />
          <img src="/camera.png" alt="Camera Icon" onClick={handleCamera} />
         { iscam && <div>
            <CameraAccess/>
          </div>}
          <img src="/mic.png" alt="Mic Icon" />
        </div>
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />
        <div className="emoji">
          <img
            src="/emoji.png"
            alt="Emoji Icon"
            onClick={() => setOpen((prev) => !prev)}
          />
          <div className="picker">
            {open && <EmojiPicker onEmojiClick={handleEmoji} />}
          </div>
        </div>
        <button className="sendButton" onClick={handleSend}  disabled={isCurrentUserBlocked || isReceiverBlocked}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
