import axios from "axios"
import { useContext, useEffect, useRef, useState } from "react"
import { UserContext } from "../Context-Api/api-data"
import {Link, useNavigate} from "react-router-dom"
import { FiHome } from "react-icons/fi";
import { IoHeart } from "react-icons/io5";
import { TbUserCancel } from "react-icons/tb";
import { MdOutlineArchive } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { IoSendOutline } from "react-icons/io5";
import { IoIosAttach } from "react-icons/io";
import io from "socket.io-client"
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../subComponents/navbar";
import { setToken } from "../redux/actions";


function Settings(){
    const[userData,setUserData] = useState([])
    const[activeChat,setActiveChat] = useState([])
    const[chatData,setChatData]=useState([])
    const[attachment,setAttachment]=useState([])
    const chatContainerRef=useRef(null)
    const Context =useContext(UserContext)
    const UserId= userData._id
    const Token = useSelector((state) => state.auth.token);
    const navigate=useNavigate()
    const Socket = io("http://localhost:3001")    
    const dispatch = useDispatch()
    async function GetProfile(){
        await axios.get(`${baseUrl}/api/v1/chats/all`,{
            headers:{
                Authorization:`Bearer ${Token} `
            }
        })
        .then((data)=>{setUserData(data.data.UserFound)
        })
    }



    async function FetchChat(data){
        setActiveChat(data)
        try{

            // const response = await axios.get(`http://localhost:3001/api/v1/chats/get-messages/${data._id}`,{
            //     headers:{
            //         Authorization:`Bearer ${Token}`
            //     }
            // })
            // setChatData(response.data.Messages)
            Socket.emit("fetchMessages", { userId: UserId, opponentId: data._id });

        }
        catch(error){
            setChatData([])
            console.log(error)
        }

        Socket.emit("joinRoom", data._id);
    }
    
    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }

    function RemoveAttachment(){
        setAttachment([])
    }

    function UserLogout(){
        dispatch(setToken(''))
        navigate('/login')
    }

    useEffect(()=>{
        GetProfile()
    },[Token])

    useEffect(() => {
        // Connect to WebSocket server
        Socket.connect();
    
    
        return () => {
          Socket.disconnect();
        };
      }, []);


    useEffect(()=>{
        Socket.on("messages",(data)=>{
            setChatData(data);
        })
        return()=>{
            Socket.off("messages");
        }
    },[Socket])


    useEffect(()=>{  
        if(Token === null){
            console.log("YEY")
            navigate('login')
        }
    },[])

    useEffect(()=>{
        document.title="Settings"
    },[])
    
    return(
        <div className="chat-ui">
            <Navbar userData={userData}/>
            <div className="main-container">
                <div className="main-container-elements">
                    <div className="title">
                        <h1>Settings</h1>
                    </div>
                    <div className="user-chats">
                        <div className="settings-container" >
                            <div className="settings-icons">
                                <p>{userData.username && userData.username.slice(0,2)}</p>
                            </div>
                            <div className="settings-username">
                                <p>{userData.username && userData.username}</p>
                            </div>
                        </div>
                        <div className="chat-container" >
                            <Link to='/reset-password' className="user-profile-details">
                                <h3 style={{fontSize:13,fontWeight:300}}>Reset Password</h3>
                            </Link>
                        </div>
                        <div className="chat-container" >
                            <Link to='/change-username' className="user-profile-details">
                                <h3 style={{fontSize:13,fontWeight:300}}>Change Username</h3>
                            </Link>
                        </div>
                        <div className="chat-container" >
                            <Link to='/profile-picture' className="user-profile-details">
                                <h3 style={{fontSize:13,fontWeight:300}}>Update Profile Picture</h3>
                            </Link>
                        </div>
                        <div className="chat-container" >
                            <div className="user-profile-details" onClick={UserLogout}>
                                <h3 style={{fontSize:13,fontWeight:300}}>Log Out</h3>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            {activeChat ? 
            <div className="right-container">
                    <div className="chat-header">
                        <div style={{padding:10}}>
                            <div className="box" style={{flexDirection:"row"}}>
                                    <div className="profile-icon">
                                        {activeChat.username && <p>{activeChat.username.slice(0,1)}</p>}
                                    </div>
                                    <div style={{marginLeft:5}}>
                                        <p>{activeChat.username}</p>
                                    </div>
                            </div>
                        </div>
                    </div>
                    <div ref={chatContainerRef} className="chat-area">

                        {chatData && chatData.map((chat)=>{
                            const Receiver= UserId === chat.sender
                            return Receiver ?
                                (
                                    <div className="sent-message" key={chat._id}>
                                        <div className="message-date">
                                            <div className="speech-bubble sent-bubble">
                                                {chat.image ? (<img style={{padding:10, maxWidth:300}} src={chat.image}/>) : ( <p>{chat.text}</p>)}
                                            </div>
                                            <div>
                                                <p>{chat.time}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                                :(
                                    <div className="received-message">
                                        <div className="speech-bubble">
                                           {chat.image ? (<img style={{padding:10, maxWidth:300}} src={chat.image}/>) : ( <p>{chat.text}</p>)}
                                        </div>
                                     </div>
                                )
                                
                        })}
                    </div>
                    <div className="chat-input">
                        <div className="chat-input-container">
                            <div className="chat-user-input">
                              <input type="text" placeholder="Enter Your Message"/>
                            </div>

                            <div className="chat-user-input arrow">
                                <label htmlFor="Attach">
                                    <IoIosAttach size={23} />
                                </label>    
                                <input type="file" name="Attachment" id="Attach" style={{ display: 'none' }} onInput={(event)=>setAttachment(event)}/>

                            </div>
                            <div className="chat-user-input arrow">
                                <IoSendOutline/>
                            </div>
                        </div>
                        {attachment && attachment.target && 

                                <div className="Attachment">
                                    <h3>{attachment?.target?.value.split("\\")[2]}</h3>
                                    <div className="remove" onClick={RemoveAttachment}>
                                        <p>X</p>
                                    </div>
                                </div>
                        }
                    </div>
                </div>
         : <p>Select A User To Chat</p>}
        </div>
    )
}

export default Settings