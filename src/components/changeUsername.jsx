import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import GlowBtn from "../subComponents/GlowBtn"

function ChangeUsername(){
    const navigate = useNavigate()
    const Token = useSelector((state)=> state.auth.token)
    const [currentPassword,setCurrentPassword]=useState('')
    const [newPassword,setNewPassword]=useState('')
    // useEffect(()=>{
    //     if(!Token){
    //         navigate('/home')
    //     }
    // },[])
    async function ChangeUsername(){
        const data = {
            currentUsername:currentPassword,
            newUsername:newPassword
        }
        const response = await axios.post('http://localhost:3001/api/v1/user/change-username',data,{
            headers:{
                Authorization:`Bearer ${Token}`
            }
        })
        console.log(response)
        navigate('/home')
    }

    return(
        <div className="reset-container">
            <div className="reset-layout">
                <div className="reset-header">
                    <h2>MERN CHAT</h2>
                </div>
                <form action="">
                    <div>
                        <GlowBtn text="Current-Username" onChange={setCurrentPassword}/>
                    </div>
                    <div>
                        <GlowBtn text="New-Username" onChange={setNewPassword}/>
                    </div>
                    <div className="social-media-layer facebook" style={{backgroundColor:"#316FF6",minWidth:150,marginTop:20,borderRadius:10}} onClick={ChangeUsername}>
                        <h3 style={{fontSize:13}}>Change Username</h3>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default ChangeUsername

