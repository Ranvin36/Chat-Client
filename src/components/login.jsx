import React, { useContext, useState,useEffect } from 'react'
import { Link, useNavigate, useNavigation } from 'react-router-dom'
import { FaFacebookF } from "react-icons/fa6";
import { FaTwitter,FaGoogle  } from "react-icons/fa";
import Lottie from "lottie-react"
import loginimg from "../lottie/loginimg.json"
import axios from "axios"
import InputContainer from '../subComponents/inputContainer';
import { UserContext } from '../Context-Api/api-data';
import { useDispatch, useSelector } from 'react-redux';
import { setToken } from '../redux/actions';
import { useLocation } from 'react-router-dom';

function Login(){
    const[username,setUsername]= useState('')
    const[password,setPassword]= useState('')
    const[error,setError]=useState('')
    const dispatch = useDispatch()
    const token = useSelector((state)=>state.auth.token)
    const UserData = useContext(UserContext)
    const navigate = useNavigate()
    const location = useLocation();
    const queryParams = new URLSearchParams(window.location.search);
    const selector = useSelector((state)=> state.auth.token)
    function SubmissionHandler(event){
        event.preventDefault();
        if(username,password){
            const data ={
                username,
                password
            }

                axios.post('http://localhost:3001/api/v1/user/login',data)

                .then((response)=>{
                    if (response &&response.data) { 
                        setError('');
                        console.log("Login Successful");
                        // UserData.setData(response.data.token);
                        dispatch(setToken(response.data.token));

                        navigate('/home')
                       
                    } else {
                        setError('Invalid response format from the server.');
                    }
                })
                .catch((error)=>{
                    setError(error.response.data.message)
                })
            }

        }

        async function GoogleLogin(){
            await axios.get('http://localhost:3001/auth/google/login/success')
            .then((data) =>{
                console.log(data)
            })

        }
        useEffect(()=>{
            document.title="Fleexy Chat - Login"
        },[])

        useEffect(()=>{
            if(queryParams.size !=0){
                dispatch(setToken(''))
                const userParam = queryParams.get('userId')
                // try {
                //     // Parse the user data JSON string
                //     const userData = JSON.parse(userParam);
                //     console.log('User data:', userData);
                // } catch (error) {
                //     console.error('Error parsing user data:', error);
                // }
                console.log(userParam)
                dispatch(setToken(userParam))
                navigate('/home')
            }
        }, [location]);

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
                                <h1>Login</h1>
                            </div>
                            <div className="subTitle">
                                <p>Don't Have An Account? <Link to='/'>Create An Account</Link></p>
                                {error ? <p style={{color:"red",fontSize:13}}>{error}</p> : null}
                            </div>
                        </div>
                        <form className='login-form'>
                            <div className="form-container">
                                <InputContainer onChange={setUsername} type="text" label="Username"/>
                                <InputContainer onChange={setPassword} type="password" label="Password"/>
                                <div className="forgot-password">
                                    <Link to="/reset-password" style={{fontSize:13,textDecoration:"none"}}>Forgot Password?</Link>
                                </div>
                                <div className="submit-button" onClick={SubmissionHandler}>
                                    <Link style={{color:"#fff",textDecoration:"none"}}>Login</Link>
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

export default Login