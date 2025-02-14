// import { useState } from "react";
// import { db } from "../../../../lib/firebase";
// import "./addUser.css";
// import { collection,  getDocs, query, where } from "firebase/firestore";
// const AddUser = () => {
// const [user,setUser] = useState(null);

//   const handleSearch = async (e) => {
//     e.preventDefault();
//     const fromData = new FormData(e.target);
//     const username = fromData.get("username");

//     try {
//       const userRef = collection(db, "users");

//       const q = query(userRef, where("username", "==", username));
//       const querySnapshot = await getDocs(q);

//       if(!querySnapshot.empty){
//      setUser(querySnapshot.docs[0].data());
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   return (
//     <div className="addUser">
//       <form onSubmit={handleSearch}>
//         <input type="text" placeholder="Username" name="Username" />
//         <button>Search</button>
//       </form>

//      { user && <div className="user">
//         <div className="details">
//           <img src={user.avatar || "./avatar.png"} alt="" />
//           <span>{user.name}</span>
//         </div>
//         <button>Add User</button>
//       </div>}
//     </div>
//   );
// };
// export default AddUser;
import { useState } from "react";
import { db } from "../../../../lib/firebase";
import "./addUser.css";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useUserStore } from "../../../../lib/userStore";

const AddUser = () => {
  const [user, setUser] = useState(null);
  const { currentUser } = useUserStore();

  const handleSearch = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target); // Fixed typo in target
    const username = formData.get("username");

    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const foundUser = querySnapshot.docs[0].data();
        setUser(foundUser);
      } else {
        console.log("User not found");
        setUser(null); // Reset user state if no match
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const handleAdd = async () => {
    const chatRef = collection(db, "chats");
    const userChatRef = collection(db, "userchats");

    try {
      const newChatRef = doc(chatRef);

      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(userChatRef, user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(), // wew are using Data.now() here because we can't use serverTimestamp() insid ethe arrayUnion
        }),
      });
      await updateDoc(doc(userChatRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: Date.now(),
        }),
      });

      // console.log(newChatRef.id);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="addUser">
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="Username" name="username" />
        <button type="submit">Search</button>
      </form>

      {user && (
        <div className="user">
          <div className="details">
            <img src={user.avatar || "./avatar.png"} alt="User Avatar" />
            <span>{user.username}</span>
          </div>
          <button onClick={handleAdd}>Add User</button>
        </div>
      )}
    </div>
  );
};

export default AddUser;
