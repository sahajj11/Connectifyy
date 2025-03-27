import { BASE_URL, clientServer } from '@/config'
import DashBoardLayout from '@/layout/DashBoardLayout'
import UserLayout from '@/layout/UserLayout'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { getAllPosts } from '@/config/redux/action/postAction'
import { acceptConnection, getConnectionsRequest, sendConnectionRequest } from '@/config/redux/action/authAction'

export default function ViewProfilePage({userProfile}) {

  const searchParams=useSearchParams()
  const router=useRouter()
  const dispatch=useDispatch()
  const postReducer=useSelector((state)=>state.postReducer)

  const authState=useSelector((state)=>state.auth)

const [userPosts,setUserPosts]=useState([])

const [isCurrentUserInConnection,setIsCurrentUserInConnection]=useState(false)

const [isConnectionNull,setIsConnectionNull]=useState(true)

const getUserPost=async()=>{
  console.log("Retrieved Token:", localStorage.getItem("token"));
  await dispatch(getAllPosts())
  await dispatch(getConnectionsRequest({token:localStorage.getItem("token")}))
  await dispatch(acceptConnection({token:localStorage.getItem("token")}))
}

useEffect(()=>{
  let post=postReducer.posts.filter((post)=>{
    return post.userId.username==router.query.username
  })

  setUserPosts(post)

},[postReducer.posts])

useEffect(() => {
  console.log(authState.connections, userProfile?.userId?._id);

  // ✅ Ensure connections is an array and userProfile.userId exists
  if (!Array.isArray(authState.connections) || !userProfile?.userId?._id) return;

  const isConnected = authState.connections.some(
    (user) => user?.conectionId?._id === userProfile?.userId?._id
  );

  if(isConnected){setIsCurrentUserInConnection(true)};
  const foundConnection = authState.connections.find(
    user => user?.connectionId?._id === userProfile?.userId?._id
  );
  
  // Check if a connection is found before accessing `status_accepted`
  if (foundConnection?.status_accepted === true) {
    setIsConnectionNull(false);
  }
}, [authState.connections, userProfile]);







useEffect(()=>{
  getUserPost()
},[])


  return (
   <UserLayout>
    <DashBoardLayout>
    
    <div className={styles.container}>

      <div className={styles.backDropContainer}>
          <img className={styles.backDrop} src={`${BASE_URL}/${userProfile.userId.profilePicture}`}/>
      </div>


      <div className={styles.profileContainer_details}>

        <div className={styles.profileContainer_flex}>

          <div  style={{flex:"0.8"}}>

            <div style={{display:"flex",width:"fit-content",alignItems:"center",gap:"1.2rem"}}>
              <h2>{userProfile.userId.name}</h2>
              <p style={{color:"grey"}}>@{userProfile.userId.username}</p>
            </div>
             

             <div style={{display:"flex",gap:"1.2rem",alignItems:"center",marginTop:"1.2rem"}}>

             {isCurrentUserInConnection?<button className={styles.connectedButton}>{isConnectionNull ?"Pending" : "Connected"}</button>:<button onClick={()=>{
              dispatch(sendConnectionRequest({token:localStorage.getItem("token"),user_id:userProfile.userId._id}))
            }} className={styles.connectBtn}>Connect</button>}

            <div onClick={async()=>{
              const response=await clientServer.get(`/user/download_resume?id=${userProfile.userId._id}`)
              window.open(`${BASE_URL}/${response.data.message}`,"_blank")

            }} style={{cursor:"pointer"}}>

            <svg style={{width:"1.2em"}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
</svg>

            </div>

             </div>
            


            <div style={{marginTop:"1.2rem"}}>
              <p>{userProfile.bio}</p>
            </div>

          </div>

          <div  style={{flex:"0.2",marginTop:"1.2rem"}}>

            <h3>Recent Activity</h3>
            {userPosts.map((post)=>{
              return(
                <div key={post._id} className={styles.postCard}>
                  <div className={styles.card}>
                    <div className={styles.card_profileContainer}>
                      {post.media!=="" ? <img src={`${BASE_URL}/${post.media}`} /> : <div style={{width:"3.4rem",height:"3.4rem"}}></div>}
                    </div>
                    <p>{post.body}</p>
                  </div>
                </div>
              )
            })}

          </div>


        </div>

      </div>

      <div className="workHistory">
        <h4>Work History</h4>

        <div className="workHistoryContainer">
          {userProfile.pastWork.map((work,index)=>{
            return(
              <div key={index} className={styles.workHistoryCard}>
               <p style={{fontWeight:"bold",display:"flex",alignItems:"center",marginTop:"1.2rem",gap:"0.8rem"}}>{work.company}-{work.position}</p>
                <p>{work.years}Years</p>
              </div>
            )
          })}
        </div>
      </div>

    </div>

    </DashBoardLayout>
   </UserLayout>
  )
}


export async function getServerSideProps(context){
  

  const request=await clientServer.get("/user/get_profile_based_on_username",{
    params:{
      username:context.query.username
    }
  })

  const response=await request.data
  console.log(response)

  return {props:{userProfile:request.data.profile}}
}