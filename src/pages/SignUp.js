import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { db } from '../firebase.config'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
// import { toast } from 'react-hot-toast';
import OAuth from '../components/layout/OAuth'



const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        name: "",
        password: ''
    });
    const { name, email, password } = formData
    const navigate = useNavigate()

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }));
    };

    const onSubmitHndler = async (e) => {
        e.preventDefault()
        try {
            const auth = getAuth()
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const user = userCredential.user
            updateProfile(auth.currentUser, { displayName: name })
            const formDataCopy = { ...formData };
            delete formDataCopy.password;
            formDataCopy.timestamp = serverTimestamp();
            await setDoc(doc(db, "users", user.uid), formDataCopy);
            // toast.success("SignUp successfully ")
            navigate('/')
            alert('Signup Success')

        } catch (error) {
            // toast.error("Please fill all input fields")
        }
    };

    return (
        <Layout>
            <div className='d-flex' style={{
                justifyContent: "center", marginLeft: "35%",
                width: "380px", marginTop: "10px", backgroundColor: "#E5F0F0"
            }}>
                <form onSubmit={onSubmitHndler}>
                    <h4 style={{
                        textAlign: "center", justifyContent: "center", width: "320px",
                        backgroundColor: "black", color: "white", padding: "10px", marginBottom: "20px", marginTop: "20px"
                    }}>Sign Up</h4>
                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Enter Name</label>
                        <input type="text"
                            value={name}
                            className="form-control" id="name"
                            aria-describedby="emailHelp" placeholder="Enter name" onChange={onChange} />
                    </div>
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
                            }} /></span>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ marginLeft: "10px" }}>Sign up</button>
                    <div className='mt-4 mb-4' style={{ marginLeft: "8px" }}>
                        <OAuth />
                        &emsp;&emsp;&emsp;&emsp;<span><strong>Already User </strong>&nbsp;</span>&nbsp;
                        <Link to="/signIn">Sign In</Link>
                        <br></br>
                    </div>
                </form>
            </div>
        </Layout>
    )
}

export default SignUp