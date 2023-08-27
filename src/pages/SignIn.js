import React from 'react'
import Layout from '../components/layout/Layout'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
// import {toast} from 'react-hot-toast';
import OAuth from '../components/layout/OAuth'


const SignIn = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const { email, password } = formData
    const navigate = useNavigate()

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }));
    };

    //loginHandler fun
    const loginHandler = async (e) => {
        e.preventDefault()
        try {
            const auth = getAuth()
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            if (userCredential.user) {
                // toast.success("Login successfully") 
                alert("Login successfull")
                navigate('/')
            }
        } catch (error) {
            // toast.error("Invalid Email or Password")
            alert("Invalid password")
        }
    }
    return (
        <Layout>
            <div className='d-flex' style={{
                justifyContent: "center", marginLeft: "35%",
                width: "380px", marginTop: "10px", backgroundColor: "#E5F0F0 "
            }}>
                <form onSubmit={loginHandler}>
                    <h4 style={{
                        textAlign: "center", justifyContent: "center", width: "320px",
                        backgroundColor: "black", color: "white", padding: "10px", marginBottom: "20px", marginTop: "20px"
                    }}>Sign In</h4>

                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Email address</label>
                        <input type="email" value={email} className="form-control" id="email"
                            aria-describedby="emailHelp" placeholder="Enter email" onChange={onChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleInputPassword1">Password</label>
                        <input type={showPassword ? "text" : "password"}
                            value={password} className="form-control" id="password"
                            placeholder="Password" onChange={onChange} />
                        <span>Show password <input type='checkbox'
                            className='text-danger'
                            onClick={() => {
                                setShowPassword((prevState) => !prevState);
                            }} />
                        </span>&emsp;&emsp;&emsp;
                        <Link to='/forgotPassword'>Forgot Password</Link>

                    </div>

                    <button type="submit" className="btn btn-primary" style={{ marginLeft: "10px" }}>Sign In</button>
                    <OAuth />
                    <div className='mt-4 mb-4' style={{ marginLeft: "8px" }}>
                        <span> <strong>New User </strong>&nbsp;</span> <Link to="/signUp"> Sign Up</Link>
                        <br></br>
                    </div>
                </form>
            </div>
        </Layout>
    )
}

export default SignIn