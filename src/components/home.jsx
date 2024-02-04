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
import { CgOptions } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client"
import Navbar from "../subComponents/navbar";
import { setToken } from "../redux/actions";
import baseUrl from "../subComponents/baseUrl";


function Home(){
    const [number, setNumber] = useState(0)
    const[userData,setUserData] = useState([])
    const[chats,setChats]=useState([])
    const[allUsers,setAllUsers] = useState([])
    const[isActive,setIsActive]=useState(false)
    const[activeChat,setActiveChat] = useState([])
    const[chatData,setChatData]=useState([])
    const[attachment,setAttachment]=useState([])
    const[filteredUsers,setFilteredUsers]=useState([])
    const[message,setMessage]=useState('')
    const[searchUser,setSeachUser]=useState('')
    const[optionsClicked,setOptionsClicked]=useState(false)
    const[favouritesChat,setFavouriteChat]=useState(false)
    const[blockedUser,setBlockedUSer]=useState(false)
    const chatContainerRef=useRef(null)
    // const Context =useContext(UserContext)
    const UserId= userData._id
    const Token = useSelector((state) => state.auth.token);

    const navigate=useNavigate()
    const dispatch = useDispatch()
    const Socket = io("https://fleexy-chat-api.onrender.com/")

    console.log(baseUrl)

    async function GetProfile(){
        try{
            if(!Token){
                navigate('/login')
            }
            await axios.get(`${baseUrl}/api/v1/chats/all`,{
                headers:{
                    Authorization:`Bearer ${Token} `
                }
            })
            .then((data)=>{
                setUserData(data.data.UserFound)
            })

        }
        catch(error){
            dispatch(setToken(''))
        }
    }

    async function FetchProfileExecution(item){
        const response =await axios.get(`${baseUrl}/api/v1/chats/get-chats/${item}`,{
            headers:{
                Authorization:`Bearer ${Token} `
            }
        })
        return response.data.UserFound
    }

    async function GetAllUsers(){
        try{
            const response = await axios.get(`${baseUrl}/api/v1/user/get-users`)
            setAllUsers(response.data.Users)
        }
        catch(error){
            console.log(error)
        }

    }

    async function FetchChat(data){
        setIsActive(true)
        setActiveChat(data)
        try{

            // const response = await axios.get(`${baseUrl}/api/v1/chats/get-messages/${data._id}`,{
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
            const users=[{
                UserId:UserId,
                SenderId:activeChat._id
            }]
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

            
            // Socket.emit("sendMessage",{message:message,userId:UserId,Receiver:activeChat._id})
            // console.log("Socketed")
            setMessage('');
            setAttachment([]);


        }
    }

    console.log(chatData)
    
    async function AddToFavourites(operation) {
            const ControlIdentifier = operation == "remove"
            try {
              const response = await axios.post(`${baseUrl}/api/v1/chats/favourites-${ControlIdentifier ? "remove":"add"}/${activeChat._id}`, null, {
                headers: {
                  Authorization: `Bearer ${Token}`
                }
              });
    
              navigate('/favourites')
              
            } catch (error) {
              console.kog(error);
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
    
              navigate('/blocked')
              
            } catch (error) {
              console.kog(error);
            }
      }
      

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    if(!Token){
        navigate('/login')
    }

    function keyboardPress(event){
        if(event.key ==="Enter"){
            SendMessage()
        }
    }

    function RemoveAttachment(){
        setAttachment([])
    }

    async function StartChat(opponentId){
        console.log(opponentId)
        try{
            const response = await axios.post(`${baseUrl}/api/v1/chats/${opponentId}`,null,{
                headers:{
                    Authorization:`Bearer ${Token}`
                }
            })
            console.log(response)
            setSeachUser('')
            GetProfile()

        }
        catch(error){
            console.log(error)
        }
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
                    const UserProfile = await Promise.all(userData?.chats?.map(item => FetchProfileExecution(item)))
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

    useEffect(() => {
        // Listen for new messages from the server
        Socket.on("newMessage", (data) => {
            console.log(data)
            setChatData((prevChatData) => [...prevChatData, data]);
        })
        // Cleanup on component unmount
        return () => {
          Socket.disconnect();
        };
      }, []);


      useEffect(() => {
        const ChatFavourites = userData?.favouriteChats?.filter((item) => item === activeChat?._id);
        setFavouriteChat(ChatFavourites && ChatFavourites.length > 0);
    }, [userData, activeChat]);

     useEffect(()=>{
        const Blockuser = userData?.blockedChats?.filter((item)=>item==activeChat?._id);
        setBlockedUSer(Blockuser && Blockuser.length>0)
     },[activeChat,userData])

     useEffect(()=>{
        GetAllUsers()
     },[])



     useEffect(()=>{
        const SearchFilter = allUsers.filter((item)=>item.username.toLowerCase().includes(searchUser.toLowerCase()))
        setFilteredUsers(SearchFilter)
     },[searchUser])

    //  function SocketReal(){
    //     Socket.emit("test1",number)
    //  }
    //  useEffect(() => {
    //     Socket.on("TestUpdate", (number) => {
    //         console.log("Fetched")
    //         setNumber(number)
    //     });
    // }, []);

    useEffect(()=>{
        document.title="Fleexy Chat"
    },[])
    
    return(
        <div className="chat-ui">
            
            <Navbar userData={userData}/>
            <div className="main-container">
                <div className="main-container-elements">
                    <div className="title">
                        <h1>CHATS</h1>
                    </div>
                    <div className="search">
                        <input type="text" placeholder="Search For Users" onInput={(e)=>setSeachUser(e.target.value)} />
                        <div className="searching-container">
                            {searchUser.length>0 && filteredUsers.map((data)=>{
                                return(
                                    <div className="search-data" onClick={()=>StartChat(data._id)}>
                                        <p>{data.username}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="user-chats">
           
                    {chats && chats.map((data)=>{
                        return(
                            <div className="chat-container" key={data._id} onClick={()=>FetchChat(data)} style={activeChat._id===data?._id ?{backgroundColor:"#ecebeb",borderRadius:10}:null} >
                            <div className="user-profile-icon">
                                {data.profilePicture ? <img style={{width:50,height:50,borderRadius:"50%",objectFit:"cover"}} src={data.profilePicture}/>  : <p>{data.username.slice(0,1)}</p>}
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
            
        
            <div className="right-container">
            {isActive? 
                <div>
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
                                    <li><Link className="options-link">Archive</Link></li>
                                    {favouritesChat ?
                                    <li onClick={()=>AddToFavourites("remove")}><Link className="options-link">Remove From Favourites</Link></li>
                                        :
                                    <li onClick={()=>AddToFavourites("add")}><Link className="options-link">Add To Favourites</Link></li>
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
                                        <div className="message-date">
                                            <div className="speech-bubble sent-bubble">
                                                {chat.image ? (<img style={{padding:10, maxWidth:300}} src={chat.image}/>) : ( <p>{chat.text}</p>)}
                                            </div>
                                            <div className="chat-date">
                                                <p>{chat.date}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                                :(
                                    <div className="received-message" key={chat._id}>
                                        <div className="message-date">
                                            <div className="speech-bubble">
                                                {chat.image ? (<img src={chat.image} className="Sent-Img"/>) : ( <p>{chat.text}</p>)}
                                            </div>
                                            <div className="chat-date">
                                                <p>{chat.date}</p>
                                            </div>
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
         :  <div className="chat-not-active">
                <div className="not-active-container">
                    <p>Select A User To Chat</p>
                </div>
            </div>
             }
         
                </div>
        </div>
    )
}

export default Home