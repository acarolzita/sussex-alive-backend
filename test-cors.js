const fetch = require("node-fetch");

fetch("https://sussex-alive-backend.onrender.com/api/auth/register", {
  method: "OPTIONS",
  headers: {
    "Origin": "https://sussex-alive.vercel.app",
    "Access-Control-Request-Method": "POST",
    "Access-Control-Request-Headers": "Content-Type, Authorization"
  }
})
  .then((res) => {
    console.log("✅ CORS OPTIONS Response Headers:");
    console.log(res.headers.raw());
    console.log("Status:", res.status);
  })
  .catch((err) => {
    console.error("❌ CORS Test Failed:", err.message);
  });
