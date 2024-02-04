import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaFacebookF } from "react-icons/fa6";
import { FaTwitter,FaGoogle  } from "react-icons/fa";
import Lottie from "lottie-react"
import loginimg from "../lottie/loginimg.json"
import axios from "axios"
import InputContainer from '../subComponents/inputContainer';

function Signup(){
    const navigate = useNavigate()
    const[username,setName]= useState('')
    const[email,setEmail]= useState('')
    const[password,setPassword]= useState('')
    const[error,setError]=useState('')

    async function SubmissionHandler(){
        if(username,email,password){
            const data ={
                username,
                email,
                password
            }
                await axios.post('http://localhost:3001/api/v1/user/register',data)
                .then(()=>{
                    setError('') 
                    navigate('/login')
                    })
                
                .catch((error)=>{
                    console.log(error)
                    setError(error.response.data.message ?error.response.data.message :"Error Occured")
                })
            }

        }
    
        async function GoogleLogin(){
            axios.get('http://localhost:3001/auth/google/login/success')
            .then((data) =>{
                console.log(data)
            })

        }
        useEffect(()=>{
            document.title="Fleexy Chat - Login"
        },[])

        useEffect(()=>{
            GoogleLogin()
        },[])

    return(
       <div className="container">
            <div className="login-layout">
                <div className="left-layout">
                    <div className="left-layout-content">
                        <Lottie  animationData={loginimg} style={{width:500,height:500}}/>
                    </div>
                </div>
                <div className="right-layout">
                    <div className='right-layout-content'>
                        <div className="titles">
                            <div className="maintitle">
                                <h1>Sign Up</h1>
                            </div>
                            <div className="subTitle">
                                <p>Already Have An Account? <Link to='/login'>Login</Link></p>
                                {error && <p style={{color:"red",fontSize:13}}>{error}</p>}
                            </div>
                        </div>
                        <form className='login-form'>
                            <div className="form-container">
                                <InputContainer onChange={setName} type="text" label="Username"/>
                                <InputContainer onChange={setEmail} type="email" label="Email Address"/>
                                <InputContainer onChange={setPassword} type="password" label="Password"/>
                                <div className="submit-button" onClick={SubmissionHandler}>
                                    <Link to='/' style={{color:"#fff",textDecoration:"none"}}>Sign Up</Link>
                                </div>
                            </div>
                        </form>
                        <div className="social-media">
                            <h3>Login With Social Media</h3>
                            <div className="social-media-layout">
                                <div className="social-media-layer facebook" style={{backgroundColor:"#316FF6"}}>
                                    <FaFacebookF color='#fff'/>
                                    <h3>Facebook</h3>
                                </div>
                                <div className="social-media-layer twitter" style={{backgroundColor:"#1DA1F2"}}>
                                    <FaTwitter color='#fff'/>
                                    <h3>Twitter</h3>
                                </div>
                                <Link to='http://localhost:3001/auth/google' className="social-media-layer google" style={{backgroundColor:"#34A853",textDecoration:"none"}}>
                                    <FaGoogle color='#fff'/>
                                    <h3>Google</h3>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
       </div>
    )
}

export default Signup