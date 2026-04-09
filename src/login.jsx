import React, { useState } from "react";
import SpaceBackground from "./SpaceBackground";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const submit = async(e)=>{
e.preventDefault()

const res = await fetch("http://localhost:5000/login",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body: JSON.stringify({email,password})
})

const data = await res.json()

if(data.status === "success"){

localStorage.setItem("user", JSON.stringify(data.user))

window.location.reload()

}else{
alert("Invalid credentials")
}
}

  return (
    <div className="login-page">
      {/* SPACE BACKGROUND */}
      <SpaceBackground />

      <div className="login-card">
        <h1 className="login-title">Apollo Blood Bank</h1>

        <form onSubmit={submit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button>Login</button>
        </form>
      </div>

      <style>{`
.login-page{
height:100vh;
display:flex;
align-items:center;
justify-content:center;
position:relative;
overflow:hidden;
z-index:1;
}

.login-card{
width:380px;
padding:40px;
background:rgba(10,10,20,0.55);
border:1px solid rgba(255,255,255,0.1);
backdrop-filter:blur(20px);
border-radius:20px;
color:white;
z-index:2;
}

.login-title{
font-size:32px;
margin-bottom:20px;
text-align:center;
color:#ff6b6b;
}

input{
width:100%;
padding:12px;
margin-bottom:15px;
background:rgba(255,255,255,0.05);
border:1px solid rgba(255,255,255,0.1);
border-radius:10px;
color:white;
}

button{
width:100%;
padding:12px;
background:linear-gradient(135deg,#c0392b,#e74c3c);
border:none;
border-radius:10px;
color:white;
font-weight:bold;
cursor:pointer;
}

button:hover{
opacity:0.9;
}
`}</style>
    </div>
  );
}
