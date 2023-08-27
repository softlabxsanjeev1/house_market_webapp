import React from 'react'
import { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Link, useNavigate } from 'react-router-dom'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
// import  {toast}  from 'react-toastify';

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const navigate = useNavigate()

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const auth = getAuth();
            await sendPasswordResetEmail(auth, email);
            // toast.success("Email was send");
            alert("Email send successfully")
            navigate("/signIn");
        } catch (error) {
            // toast.error("something went wrong");
        }
    };
    return (
        <Layout>
            <div className='container mt-4' style={{ marginLeft: "40%", marginTop: "100px" }}>
                <h1>Reset Your Password</h1>
                <form onSubmit={onSubmitHandler}>
                    <div class="form-group ">
                        <label for="exampleInputEmail1">Email address</label>
                        <input type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            class="form-control" id="email"
                            aria-describedby="emailHelp"
                            placeholder="Enter email"
                        />
                    </div>
                    <button type="submit" class="btn btn-primary">Reset Password</button>
                    &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                    <Link to='/signIn'>Sign In</Link>
                </form>
            </div>
        </Layout>
    )
}

export default ForgotPassword