import { useEffect, useState } from "react";
import "./chatList.css";
import AddUser from "./addUser/AddUser";
import { useUserStore } from "../../../lib/userStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useChatStore } from "../../../lib/chatStore";
const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [addMode, setAddMode] = useState(false);

  const { currentUser } = useUserStore();
  const { chatId, changeChat } = useChatStore();
  console.log(chatId);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "userchats", currentUser.id),
      async (res) => {
        // console.log("Current data: ", doc.data());
        const items = res.data().chats;
        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);
          const user = userDocSnap.data();

          return { ...item, user };
        });

        const chatData = await Promise.all(promises);
        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );

    return () => unsub(); // Unsubscribe on unmount
  }, [currentUser.id]);
  //    console.log(chats)
  const handleSelect = async (chat) => {
    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });

    const chatIndex = userChats.findIndex((item) => 
          item.chatId == chat.chatId
  );

    userChats[chatIndex].isSeen = true;

    const userChatRef = doc(db,"userchats",currentUser.id);

    try {
      await updateDoc(userChatRef, {
        chats: userChats,
      });
      changeChat(chat.chatId, chat.user);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="chatList">
      <div className="search">
        <div className="searchBar">
          <img src="/search.png" alt="" />
          <input type="texts" placeholder="Search" id="" />
        </div>
        <img
          src={addMode ? "./minus.png" : "/plus.png"}
          alt=""
          className="add"
          onClick={() => setAddMode(!addMode)}
        />
      </div>
      {chats.map((chat) => (
        <div
          className={chat?.isSeen ? "item t2" : "item t1"}
          key={chat.chatId}
          onClick={() => handleSelect(chat)}
          style={{ backgroundColor: chat?.isSeen ? "transparent" : "#5183fe" }}
        >
          <img src={chat.user?.avatar || "/avatar.png"} alt="" />
          <div className="texts">
            <span>{chat.user.username}</span>
            <p>{chat.lastMessage}</p>
          </div>
        </div>
      ))}

      {addMode && <AddUser />}
    </div>
  );
};
export default ChatList;

// import { useEffect, useState, useMemo } from "react";
// import "./chatList.css";
// import AddUser from "./addUser/AddUser";
// import { useUserStore } from "../../../lib/userStore";
// import { doc, getDoc, onSnapshot } from "firebase/firestore";
// import { db } from "../../../lib/firebase";

// const ChatList = () => {
//   const [chats, setChats] = useState([]);
//   const [addMode, setAddMode] = useState(false);
//   const { currentUser } = useUserStore();

//   useEffect(() => {
//     const unsub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {
//       const items = res.data().chats || [];
//       const promises = items.map(async (item) => {
//         const userDocRef = doc(db, "users", item.receiverId);
//         const userDocSnap = await getDoc(userDocRef);
//         const user = userDocSnap.data();
//         return { ...item, user };
//       });

//       const chatData = await Promise.all(promises);
//       setChats(chatData);
//     });

//     return () => unsub(); // Unsubscribe on unmount
//   }, [currentUser.id]);

//   const sortedChats = useMemo(() => {
//     return chats.sort((a, b) => b.updatedAt - a.updatedAt);
//   }, [chats]);

//   return (
//     <div className="chatList">
//       <div className="search">
//         <div className="searchBar">
//           <img src="/search.png" alt="Search Icon" />
//           <input type="text" placeholder="Search" id="" />
//         </div>
//         <img
//           src={addMode ? "./minus.png" : "/plus.png"}
//           alt="Toggle Add User"
//           className="add"
//           onClick={() => setAddMode(!addMode)}
//         />
//       </div>
//       {sortedChats.map((chat) => (
//         <div className="item" key={chat.chatId}>
//           <img src="/avatar.png" alt="Avatar" />
//           <div className="texts">
//             <span>{chat.user?.name || "Unknown User"}</span>
//             <p>{chat.lastMessage || "No messages yet"}</p>
//           </div>
//         </div>
//       ))}
//       {addMode && <AddUser />}
//     </div>
//   );
// };

// export default ChatList;
