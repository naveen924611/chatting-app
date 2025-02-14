import { useState } from 'react';
import './login.css'
import { toast } from 'react-toastify';
import { auth, db } from '../../lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore"; 
import upload from '../../lib/upload';
const Login = () =>{
    const [ avatar , setAvatar] = useState({
        file:null,
        url:""
    })
  const [ loading ,setLoading] = useState(false);
      const handleAvatar = (e) =>{
        if(e.target.files[0]){
        setAvatar({
            file:e.target.files[0],
            url:URL.createObjectURL(e.target.files[0])
        })}

    }
    const handleLogin = async(e) =>{
        e.preventDefault();
        const formData = new FormData(e.target);
      const { email, password} = Object.fromEntries(formData);
      try{
        setLoading(true);
        const res = await signInWithEmailAndPassword(auth,email,password);
      }catch(e){
        console.error("Error during login:", e.message);
        toast.error(e.message);
      }
      finally{
        setLoading(false); // Stop loading
      }
          
         toast.success("Login success")

    }
    const handleRegister = async (e) =>{
      e.preventDefault();  
     // Start loading
      const formData = new FormData(e.target);
      const {username , email, password} = Object.fromEntries(formData);

      try{
        setLoading(true);
           const res = await createUserWithEmailAndPassword(auth,email,password);
          
           const imgUrl = avatar.file ? await upload(avatar.file) :  "/avatar.png" ;

          toast.success("User created successfully");
          // Add a new document in collection "cities"
          await setDoc(doc(db, "users", res.user.uid), {
            username,
            email,
            avatar:imgUrl,
            id:res.user.uid,
          
            blocked : []
          });

          await setDoc(doc(db, "userchats", res.user.uid), {
         chats:[],
          });

          
           
      }
      catch(error){
        console.error("Error during registration:", error.message);
        toast.error(error.message);
      }
      finally{
        setLoading(false); // Stop loading
      }
      
      
    }
    

    return (
        <div className="login">
          
          <div className="separator"></div>
          <div className="item">
            <h2>Welcome back,</h2>
            <form onSubmit={handleLogin}>
              <input type="text" placeholder="Email" name="email" />
              <input type="password" placeholder="Password" name="password" />
              <button disabled={loading}>{loading ? "Loading...":"Sign In"}</button>
            </form>
          </div>
          <div className="separator"></div>
          <div className="item">
            <h2>create an Account</h2>
            <form onSubmit={handleRegister}>
                <label htmlFor="file">
                    <img src={avatar.url || "/avatar.png"} alt="" />
                    Upload an image
                </label>
              <input type="file" id="file" style={{display:"none"}} onChange={handleAvatar} />
              <input type="text" placeholder="UserName" name="username" required/>
              <input type="text" placeholder="Email" name="email" required />
              <input type="password" placeholder="Password" name="password" required />
              <button disabled={loading}>{loading ? "Loading...":"Sign up"}</button>
            </form>
          </div>
        </div>
    )
}
export default Login;

//chatgpt
// import { useState } from 'react';
// import './login.css';
// import { toast } from 'react-toastify';
// import { auth, db } from '../../lib/firebase';
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
// import { doc, setDoc } from "firebase/firestore"; 
// import upload from '../../lib/upload';

// const Login = () => {
//   const [avatar, setAvatar] = useState({
//     file: null,
//     url: ""
//   });
//   const [loading, setLoading] = useState(false);

//   const handleAvatar = (e) => {
//     if (e.target.files[0]) {
//       setAvatar({
//         file: e.target.files[0],
//         url: URL.createObjectURL(e.target.files[0])
//       });
//     }
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     const { email, password } = Object.fromEntries(formData);

//     try {
//       setLoading(true);
//       const res = await signInWithEmailAndPassword(auth, email, password);
//       toast.success("Login success");
//       console.log("User logged in:", res.user);
//     } catch (error) {
//       console.error("Error during login:", error.message);
//       toast.error(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     const { username, email, password } = Object.fromEntries(formData);

//     try {
//       setLoading(true);
//       const res = await createUserWithEmailAndPassword(auth, email, password);
//       const imgUrl = avatar.file ? await upload(avatar.file) : "/avatar.png";

//       toast.success("User created successfully");
//       await setDoc(doc(db, "users", res.user.uid), {
//         name: username,
//         email,
//         avatar: imgUrl,
//         id: res.user.uid,
//         blocked: []
//       });

//       await setDoc(doc(db, "userchats", res.user.uid), {
//         chat: []
//       });
//     } catch (error) {
//       console.error("Error during registration:", error.message);
//       toast.error(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login">
//       <div className="separator"></div>
//       <div className="item">
//         <h2>Welcome back,</h2>
//         <form onSubmit={handleLogin}>
//           <input type="text" placeholder="Email" name="email" />
//           <input type="password" placeholder="Password" name="password" />
//           <button disabled={loading}>{loading ? "Loading..." : "Sign In"}</button>
//         </form>
//       </div>
//       <div className="separator"></div>
//       <div className="item">
//         <h2>Create an Account</h2>
//         <form onSubmit={handleRegister}>
//           <label htmlFor="file">
//             <img src={avatar.url || "/avatar.png"} alt="Avatar Preview" />
//             Upload an image
//           </label>
//           <input type="file" id="file" style={{ display: "none" }} onChange={handleAvatar} />
//           <input type="text" placeholder="UserName" name="username" required />
//           <input type="text" placeholder="Email" name="email" required />
//           <input type="password" placeholder="Password" name="password" required />
//           <button disabled={loading}>{loading ? "Loading..." : "Sign up"}</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;
