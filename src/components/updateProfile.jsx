import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import GlowBtn from "../subComponents/GlowBtn"

function UpdateProfile(){
    const navigate = useNavigate()
    const Token = useSelector((state)=> state.auth.token)
    const [username,setUsername]=useState('')
    const [password,setPassword]=useState('')
    const [attachment,setAttachment]=useState(null)

    // useEffect(()=>{
    //     if(!Token){
    //         navigate('/home')
    //     }
    // },[])
    console.log(attachment)
    async function UploadFile() {
        try {
            const formData = new FormData();
            if(attachment){
                formData.append('file', attachment);
                formData.append('text',"ABCD")
                await axios.post(`http://localhost:3001/api/v1/chats/profile-upload`, formData, {
                headers: {
                    Authorization: `Bearer ${Token}`,
                    // 'Content-Type': 'multipart/form-data',
                },
            });

            navigate('/home')
                
            }
            
        } catch (error) {
            console.error('Error uploading file:', error);

        }
    }
    
    return(
        <div className="reset-container">
            <div className="reset-layout">
                <div className="reset-header">
                    <h2>MERN CHAT</h2>
                </div>
                <form action="">
                    <div className="reset-input-container">
                        <label htmlFor="profilepic">
                            <p>Select An Image</p>
  
                        </label>
                    </div>
                        <input type="file" name="Attachment" id="profilepic"  style={{display:"none"}} onChange={(event)=>setAttachment(event.target.files[0])}/>
                    <div className="social-media-layer facebook" style={{backgroundColor:"#316FF6",minWidth:150,marginTop:20,borderRadius:10}} onClick={UploadFile}>
                        <h3 style={{fontSize:13}}>Update Image</h3>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default UpdateProfile

