import UserLayout from "@/layout/UserLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./style.module.css";
import { loginUser, registerUser } from "@/config/redux/action/authAction";
import { emptyMessage } from "@/config/redux/reducer/authReducer";



const Login = () => {
  const authState = useSelector((state) => state.auth);

  const router = useRouter();

  const dispatch=useDispatch()

  const [userLoginMethod, setUserLoginMethod] = useState(false);

  const [username,setUsername]=useState("")
  const [name,setName]=useState("")
  const [password,setPassword]=useState("")
  const [email,setEmail]=useState("")

  const [error,setError]=useState("")

  useEffect(() => {
    if (authState.loggedIn) {
      
    }
  }),[authState.loggedIn];

  useEffect(()=>{
    if(localStorage.getItem("token")){
      router.push("/dashboard")
    }
  })

 

  useEffect(()=>{
    dispatch(emptyMessage())
    setError("")

  },[userLoginMethod])

  const handleRegister = () => {
    console.log("registering");
    if (!username || !name || !email || !password) {
      setError("All fields are required for Sign Up.");
      return
    }
    setError("")
    
    dispatch(registerUser({password,email,username,name}))
   
    alert("User Registered")
    

  };

  const handleLogin=()=>{
    console.log("login in")
    if (!email || !password) {
      setError("Email and Password are required for Sign In.");
      return;
    }
    setError(""); // Clear error if validation passes
    dispatch(loginUser({email,password}))
   
  }

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer_left}>
            <p className={styles.cardLeft_heading}>
              {userLoginMethod ? "Sign In" : "Sign Up"}
            </p>

             <p className={styles.errorMessage}>{error}</p>

            {authState.message.message}

            <div className={styles.inputContainers}>
              {!userLoginMethod && <div className={styles.inputRow}>
                <input
                onChange={(e)=>setUsername(e.target.value)}
                  className={styles.inputField}
                  type="text"
                  placeholder="Username"
                />
                <input
                onChange={(e)=>setName(e.target.value)}
                  className={styles.inputField}
                  type="text"
                  placeholder="Name"
                />
              </div>}

              
              <input
                onChange={(e)=>setEmail(e.target.value)}
                className={styles.inputField}
                type="email"
                placeholder="Email"
              />
              <input
                onChange={(e)=>setPassword(e.target.value)}
                className={styles.inputField}
                type="password"
                placeholder="Password"
              />

              <div
                onClick={() => {
                  if (userLoginMethod) {
                    handleLogin()
                  } else {
                    handleRegister()
                  }
                }}
                className={styles.buttonWithOutline}
              >
                <p>{userLoginMethod ? "Sign In" : "Sign Up"}</p>
              </div>
            </div>
          </div>

          <div className={styles.cardContainer_right}>
            

            {userLoginMethod ?<p>Don't have an account? </p>:<p>Already have an account?</p>}
           
            <div
                onClick={() => setUserLoginMethod(!userLoginMethod)}
                className={styles.buttonWithOutline}
                style={{color:"black",textAlign:"center"}}
              >
                <p>{userLoginMethod ? "Sign Up" : "Sign In"}</p>
              </div>
              </div>
          
        </div>
      </div>
    </UserLayout>
  );
};

export default Login;
