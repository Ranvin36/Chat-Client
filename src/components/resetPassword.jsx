import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import GlowBtn from "../subComponents/GlowBtn"

function ResetPassword({type}){
    const navigate = useNavigate()
    const Token = useSelector((state)=> state.auth.token)
    const [username,setUsername]=useState('')
    const[emailSent,setEmailSent]=useState(false)
    const [password,setPassword]=useState('')
    const TokenPass= type=="pass"
    const {resetToken} = useParams()
    // useEffect(()=>{
    //     if(!Token){
    //         navigate('/home')
    //     }
    // },[])
   async function ResetPassword(){
    try{
            const data ={
                username:username
            }
            const response = await axios.post('http://localhost:3001/api/v1/user/reset-password',data)
            console.log(response)
            setEmailSent(true)
    }
    catch(error){
        console.log(error)
    }
   }

   async function Forgotpassword(){
    try{
        const data ={
            password:password
        }
        const response = axios.post(`http://localhost:3001/api/v1/user/forgot-password/${resetToken}`,data)
        console.log(response)
        navigate('/home')
    }
    
    catch(error){
        console.log(error)
    }

   }

   console.log(emailSent)

    return(
        <div className="reset-container">
            <div className="reset-layout">
                <div className="reset-header">
                    <h2>MERN CHAT</h2>
                </div>
                <form action="">
                    {TokenPass ? 
                    
                    <div>
                        <GlowBtn text="New Password" onChange={setPassword}/>
                    </div>
                    :
                    emailSent?
                    <div style={{textAlign:"center"}}>
                        <img src="Images/emailSent.png" className="email-sent" />
                        <p>Check your inbox to reset your password with instructions.</p>
                    </div>
                    :
                    <>
                        <div>
                            <GlowBtn text="Username" onChange={setUsername}/>
                        </div>

                        <div className="social-media-layer facebook" style={{backgroundColor:"#316FF6",minWidth:150,marginTop:20,borderRadius:10}} onClick={TokenPass?Forgotpassword:ResetPassword}>
                            <h3 style={{fontSize:13}}>{TokenPass?"Change Password":"Send Email"}</h3>
                        </div>
                    </>
                    }
                </form>
            </div>
        </div>
    )
}
export default ResetPassword

