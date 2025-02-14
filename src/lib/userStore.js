// import { doc } from 'firebase/firestore'
// import { toast } from 'react-toastify'
// import { create } from 'zustand'
// import { db } from './firebase'

// export const useUserStore = create((set)=>({
//     currentUser: null,
//     isLodaing:true,
//      fetchUserInfo : async(uid) =>{
//          if(uid){
//             return set({currentUser:null,isLodaing:false})
//          }
//          try {
//              const docRef = doc(db,"users", uid);
//              const docSnap = await getDoc(docRef);

//              if(docSnap.exists()){
//                 set({currentUser:docSnap.data(),isLodaing:false})
//              }
//              else{
//                  toast.error("User not found")
//                  set({currentUser:null,isLodaing:false})
//              }
             
//          } catch (error) {
//             toast.error(error)
//          }
//      }
// }))
import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "./firebase";

export const useUserStore = create((set) => ({
    currentUser: null,
    isLoading: true,
    fetchUserInfo: async (uid) => {
        if (!uid) return set({ currentUser: null, isLoading: false });

        try {
            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                set({ currentUser: docSnap.data(), isLoading: false });
            } else {
                set({ currentUser: null, isLoading: false });
            }
        } catch (err) {
            console.log(err);
            set({ currentUser: null, isLoading: false });
        }
    },
}));
