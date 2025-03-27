import DashBoardLayout from '@/layout/DashBoardLayout'
import UserLayout from '@/layout/UserLayout'
import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { getAboutUser } from '@/config/redux/action/authAction'
import { BASE_URL, clientServer } from '@/config'
import { getAllPosts } from '@/config/redux/action/postAction'

export default function index() {
    const dispatch = useDispatch();

    const authState = useSelector((state) => state.auth);
    const postReducer = useSelector((state) => state.postReducer);

    const [userProfile, setUserProfile] = useState({});  // ✅ FIXED: Changed from `[]` to `{}`
    const [userPosts, setUserPosts] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [inputData,setInputData]=useState({
        company:"",
        position:"",
        years:""
    })

    const handleWorkInputChange=(e)=>{

        const {name,value}=e.target
        setInputData({...inputData,[name]:value})

    }

    useEffect(() => {
        dispatch(getAboutUser({ token: localStorage.getItem("token") }));
        dispatch(getAllPosts());
    }, [dispatch]);

    useEffect(() => {
        if (authState.user) {
            setUserProfile(authState.user);
        }
    }, [authState.user]);

    useEffect(() => {
        if (authState.user && postReducer.posts.length > 0) {
            let post = postReducer.posts.filter(
                (post) => post.userId?.username === authState.user?.userId?.username
            );
            setUserPosts(post);
        }
    }, [authState.user, postReducer.posts]);

    // ✅ DEBUGGING
    console.log("AuthState:", authState);
    console.log("UserProfile:", userProfile);
    console.log("UserPosts:", userPosts);


    const updateProfileData=async()=>{
        const request=await clientServer.post("/user_update",{
            token:localStorage.getItem("token"),
            name:userProfile.userId.name
        })

        const response=await clientServer.post("/update_profile_data",{
            token:localStorage.getItem("token"),
            bio:userProfile.bio,
            currentPost:userProfile.currentPost,
            pastWork:userProfile.pastWork,
            education:userProfile.education
        })

        dispatch(getAboutUser({token:localStorage.getItem("token")}))
    }

     const uploadProfilePicture=async(file)=>{

        const formData=new FormData()
        formData.append("profile_picture",file)
        formData.append("token",localStorage.getItem("token"))

        const response=await clientServer.post("/update_profile_picture",formData,{
            headers:{
                "Content-Type":"multipart/form-data"
            },

        })

        dispatch(getAboutUser({token:localStorage.getItem("token")}))

    }

   

    return (
        <UserLayout>
            <DashBoardLayout>
                {authState.user && userProfile?.userId && (
                    <div className={styles.container}>
                        <div className={styles.backDropContainer}>
                            <div className={styles.backDrop}>

                                <label htmlFor='profilePictureUpload' className={styles.backDrop_overlay}>
                                    <p>Edit</p>
                                </label>
                                <input onChange={(e)=>{
                                      uploadProfilePicture(e.target.files[0])
                                }} hidden type='file' id="profilePictureUpload" />
                            <img
                                
                                src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
                                alt="Profile"
                            />
                            </div>
                            
                        </div>

                        <div className={styles.profileContainer_details}>
                            <div className={styles.res} style={{ display: "flex", gap: "0.7rem" }}>
                                <div style={{ flex: "0.8" }}>
                                    <div style={{ display: "flex", width: "fit-content", alignItems: "center", gap: "1.2rem" }}>
                                        {/* <h2>{userProfile.userId.name}</h2> */}

                                        <input className={styles.nameEdit} type="text" onChange={(e)=>{
                                            setUserProfile({...userProfile,userId:{...userProfile.userId,name:e.target.value}})
                                        }} value={userProfile.userId.name}/>
                                        <p style={{ color: "grey" }}>@{userProfile.userId.username}</p>
                                    </div>

                                    <div>
                                        {/* <p>{userProfile.bio}</p> */}
                                        <textarea value={userProfile.bio}
                                        onChange={(e)=>{
                                            setUserProfile({...userProfile,bio:e.target.value})
                                        }} 
                                        rows={Math.max(3, Math.ceil(userProfile.bio.length / 80))}
                                        style={{width:"100%"}}
                                        />
                                    </div>
                                </div>

                                <div style={{ flex: "0.2" }}>
                                    <h3>Recent Activity</h3>
                                    {userPosts.map((post) => (
                                        <div key={post._id} className={styles.postCard}>
                                            <div className={styles.card}>
                                                <div className={styles.card_profileContainer}>
                                                    {post.media !== "" ? (
                                                        <img src={`${BASE_URL}/${post.media}`} alt="Post Media" />
                                                    ) : (
                                                        <div style={{ width: "3.4rem", height: "3.4rem" }}></div>
                                                    )}
                                                </div>
                                                <p>{post.body}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* <div className="workHistory">
                            <h4>Work History</h4>
                            <div className="workHistoryContainer">
                                {userProfile.pastWork?.map((work, index) => (
                                    <div key={index} className={styles.workHistoryCard}>
                                        <p style={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.8rem" }}>
                                            {work.company} - {work.position}
                                        </p>
                                        <p>{work.years}</p>

                                       
                                    </div>
                                ))}

                                <button onClick={()=>{
                                    setIsModalOpen(true)
                                }} className={styles.addWorkButton}>Add Work</button>
                            </div>
                        </div> */}

<div className="workHistory">
    <h4>Work History</h4>
    <div className="workHistoryContainer">
        {userProfile?.pastWork?.length > 0 ? (
            userProfile.pastWork.map((work, index) => (
                <div key={index} className={styles.workHistoryCard}>
                    <p style={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.8rem" }}>
                        {work.company} - {work.position}
                    </p>
                    <p>{work.years} Years</p>
                </div>
            ))
        ) : (
            <p style={{ color: "grey" }}>No work history added yet.</p>
        )}

        <button 
            onClick={() => setIsModalOpen(true)} 
            className={styles.updateProfileBtn}
        >
            Add Work
        </button>
    </div>
</div>


                        {userProfile !=authState.user && 

                        <div onClick={()=>{
                            updateProfileData()
                        }} className={styles.updateProfileBtn}>
                            Update Profile
                        </div>
                        }
                    </div>
                )}


{isModalOpen && 

<div onClick={()=>{
 setIsModalOpen(false)
}} className={styles.commentsContainer}>

 <div onClick={(e)=>{
   e.stopPropagation()
 }} className={styles.allCommentsContainer}>

  
   <input
                  onChange={handleWorkInputChange}
                  name='company'
                    className={styles.inputField}
                    type="text"
                    placeholder="Enter your Company"
                  />

<input
                  onChange={handleWorkInputChange}
                    name='position'
                    className={styles.inputField}
                    type="text"
                    placeholder="Enter your Position"
                  />

<input
                  onChange={handleWorkInputChange}
                    name='years'
                    className={styles.inputField}
                    type="number"
                    placeholder="Years"
                  />

  {/* <button onClick={()=>{
    setUserProfile({...userProfile,pastWork:[...userProfile.pastWork,inputData]})
    setIsModalOpen(false)
  }} className={styles.connectBtn}>Add Work</button> */}

<button onClick={async () => {
    const updatedPastWork = [...(userProfile.pastWork || []), inputData];

    try {
        await clientServer.post("/update_profile_data", {
            token: localStorage.getItem("token"),
            pastWork: updatedPastWork,  // Send updated work history
        });

        // Update frontend state
        setUserProfile(prevProfile => ({
            ...prevProfile,
            pastWork: updatedPastWork,
        }));

        setIsModalOpen(false);
        dispatch(getAboutUser({ token: localStorage.getItem("token") })); // Fetch updated data
    } catch (error) {
        console.error("Error updating past work:", error);
    }
}} className={styles.connectBtn}>Add Work</button>




 </div>

</div>
 
}


                

                
            </DashBoardLayout>
        </UserLayout>
    );
}
