import { acceptConnection, getMyConectionsRequests } from '@/config/redux/action/authAction'
import DashBoardLayout from '@/layout/DashBoardLayout'
import UserLayout from '@/layout/UserLayout'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from "./styles.module.css";
import { BASE_URL } from '@/config'
import { useRouter } from 'next/router'

export default function MyConnectionsPage ()  {

  const dispatch=useDispatch()
  const authState=useSelector((state)=>state.auth)

  useEffect(()=>{
    dispatch(getMyConectionsRequests({token:localStorage.getItem("token")}))
  })

  const router=useRouter()

  useEffect(()=>{

    if(authState.connectionRequest!=0){
      console.log(authState.connectionRequest)
    }

  },[authState.connectionRequest])

  return (
   <UserLayout>
    <DashBoardLayout>
        <div style={{display:"flex",justifyContent:"center",flexDirection:"column",gap:"1.2rem"}}>
            <h1>Connections</h1>

            {authState.connectionRequest ===0 && <h1>No Conections Requests</h1>}

            {authState.connectionRequest !=0 && authState.connectionRequest.filter((connection)=>connection.status_accepted === null).map((user,index)=>{
              return(
                <div onClick={()=>{
                  router.push(`/view_profile/${user.userId.username}`)
                }} className={styles.userCard} key={index}>
                  <div style={{display:"flex",alignItems:"center",gap:"1.2rem"}}>
                    <div className={styles.profilePicture}>
                      <img
                                                      
                         src={`${BASE_URL}/${user.userId.profilePicture}`}
                                                      alt="Profile"
                                                  />
                    </div>
                    <div className={styles.userInfo}>

                      <h3>{user.userId.name}</h3>
                      <p>{user.userId.username}</p>

                    </div>

                    <button onClick={(e)=>{
                      e.stopPropagation()
                      dispatch(acceptConnection({
                        connectionId:user._id,
                        token:localStorage.getItem("token"),
                        action:"accept"
                      }))
                    }} className={styles.connectBtn}>Accept</button>
                  </div>
                </div>
              )
            })

            }
          

          <h4>My Network</h4>
            {authState.connectionRequest.filter((connection)=>connection.status_accepted !== null).map((user,index)=>{
              return(

                <div onClick={()=>{
                  router.push(`/view_profile/${user.userId.username}`)
                }} className={styles.userCard} key={index}>
                  <div style={{display:"flex",alignItems:"center",gap:"1.2rem"}}>
                    <div className={styles.profilePicture}>
                      <img
                                                      
                         src={`${BASE_URL}/${user.userId.profilePicture}`}
                                                      alt="Profile"
                                                  />
                    </div>
                    <div className={styles.userInfo}>

                      <h3>{user.userId.name}</h3>
                      <p>{user.userId.username}</p>

                    </div>

                    
                  </div>
                </div>

              )
            })}
        </div>
    </DashBoardLayout>
   </UserLayout>
  )
}


