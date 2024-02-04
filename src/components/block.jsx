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
import { useSelector } from "react-redux";
import { CgOptions } from "react-icons/cg";
import Navbar from "../subComponents/navbar";
import baseUrl from "../subComponents/baseUrl";




function Blocked(){
    const[userData,setUserData] = useState([])
    const[chats,setChats]=useState([])
    const[activeChat,setActiveChat] = useState([])
    const[chatData,setChatData]=useState([])
    const[message,setMessage]=useState('')
    const[attachment,setAttachment]=useState([])
    const chatContainerRef=useRef(null)
    const Context =useContext(UserContext)
    const UserId= userData._id
    const Token = useSelector((state) => state.auth.token);
    const[blockedUser,setBlockedUSer]=useState(false)
    const[optionsClicked,setOptionsClicked]=useState(false)
    const navigate=useNavigate()
    const Socket = io("https://fleexy-chat-api.onrender.com")
    async function GetProfile(){
        await axios.get(`${baseUrl}/api/v1/chats/all`,{
            headers:{
                Authorization:`Bearer ${Token} `
            }
        })
        .then((data)=>{setUserData(data.data.UserFound)
        })
    }

    async function FetchProfileExecution(item){
        const response =await axios.get(`${baseUrl}/api/v1/chats/get-chats/${item}`,{
            headers:{
                Authorization:`Bearer ${Token} `
            }
        })
        return response.data.UserFound
        
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

    async function SendMessage(){
        console.log("SendMessage function called");

        if(message || attachment.target){
            const data = new FormData();
            if(attachment.target){
                data.append('file', attachment.target.files[0]);
            }
            data.append('text', message ? message : 'Image');

            await axios.post(`${baseUrl}/api/v1/chats/message-sent/${activeChat._id}`,data,{
                headers:{
                    Authorization:`Bearer ${Token}`,
                    'Content-Type': 'multipart/form-data',
                }
            })
            .then((response)=>{
                FetchChat(activeChat)
                console.log(response.data)
            })
            .catch((error)=>{
                console.log(error)

            })

            
            // Socket.emit("sendMessage",data)
            // setChatData((prevChatData) => [...prevChatData, { sender: UserId, text: message }]);
            setMessage('');
            setAttachment([]);


        }
    }

    async function BlockUser(operation) {
        const ControlIdentifier = operation == "remove"
        try {
          const response = await axios.post(`${baseUrl}/api/v1/chats/${ControlIdentifier ? "Unblock":"block"}-user/${activeChat._id}`, null, {
            headers: {
              Authorization: `Bearer ${Token}`
            }
          });

          navigate('/home')
          
        } catch (error) {
          console.kog(error);
        }
  }
    
    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }

    function keyboardPress(event){
        if(event.key ==="Enter"){
            SendMessage()
        }
    }

    function RemoveAttachment(){
        setAttachment([])
    }
    
    useEffect(()=>{
        scrollToBottom()
    },[chatData])

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
        async function FetchProfile(){
            if(userData.chats){
                    const UserProfile = await Promise.all(userData?.blockedChats?.map(item => FetchProfileExecution(item)))
                    setChats(UserProfile)
            }
        }   
        FetchProfile()
    },[userData])

    useEffect(()=>{
        Socket.on("messages",(data)=>{
            setChatData(data);
        })
        return()=>{
            Socket.off("messages");
        }
    },[Socket])

    useEffect(() => {
        Socket.on("fetchMessages", (data) => {
            setChatData((prevChatData) => [...prevChatData, data]);
        });
    
        return () => {
            Socket.off("fetchMessages");
        };
    }, [Socket]);


    useEffect(()=>{  
        if(Token === null){
            console.log("YEY")
            navigate('login')
        }
    },[])

    useEffect(()=>{
        const Blockuser = userData?.blockedChats?.filter((item)=>item==activeChat?._id);
        setBlockedUSer(Blockuser && Blockuser.length>0)
     },[activeChat,userData])

    
    return(
        <div className="chat-ui">
            <Navbar userData={userData}/>
            <div className="main-container">
                <div className="main-container-elements">
                    <div className="title">
                        <h1>Blocked</h1>
                    </div>
                    <div className="search">
                        <input type="text" placeholder="Search For Users" />
                    </div>
                    <div className="user-chats">
           
                    {chats && chats.map((data)=>{
                        return(
                            <div className="chat-container" key={data._id} onClick={()=>FetchChat(data)} style={activeChat._id===data?._id ?{backgroundColor:"#ecebeb",borderRadius:10}:null} >
                            <div className="user-profile-icon">
                                {data.username && <p>{data.username.slice(0,1)}</p>}
                            </div>
                            <div className="user-profile-details">
                                <h1>{data.username}</h1>
                                <p>Lorem Ipsum Dolor Sit.</p>
                            </div>
                        </div>
                        )
                    })} 
                    </div>
                </div>

            </div>
            {activeChat ? 
            
        
            <div className="right-container">
                    <div className="chat-header">
                    <div className="chat-top-bar">
                            <div className="box" style={{flexDirection:"row"}}>
                                    <div className="profile-icon">
                                        {activeChat.username && <p>{activeChat.username.slice(0,1)}</p>}
                                    </div>
                                    <div style={{marginLeft:5}}>
                                        <p>{activeChat.username}</p>
                                    </div>
                            </div>
                            <div className="Options" style={{flexDirection:"row"}} onClick={()=>setOptionsClicked((prevstate)=>!prevstate)}>
                                <div className="options-Container">
                                    <CgOptions style={{fontSize:18,marginTop:5}}/>
                                </div>  
                                <div className="options-dropdown" style={optionsClicked?{display:"block"}:null}>
                                    {blockedUser ? 
                                        <li  onClick={()=>BlockUser("remove")}><Link className="options-link">UnBlock Chat</Link></li>
                                        :
                                        <li  onClick={()=>BlockUser("add")}><Link className="options-link">Block Chat</Link></li>

                                    }
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
                                        <div className="speech-bubble sent-bubble">
                                           {chat.image ? (<img style={{padding:10, maxWidth:300}} src={chat.image}/>) : ( <p>{chat.text}</p>)}
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
                              <input type="text" placeholder="Enter Your Message" onInput={(e)=>setMessage(e.target.value)}  onKeyPress={keyboardPress}/>
                            </div>

                            <div className="chat-user-input arrow">
                                <label htmlFor="Attach">
                                    <IoIosAttach size={23} />
                                </label>    
                                <input type="file" name="Attachment" id="Attach" style={{ display: 'none' }} onInput={(event)=>setAttachment(event)}/>

                            </div>
                            <div className="chat-user-input arrow" onClick={SendMessage}>
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

export default Blocked