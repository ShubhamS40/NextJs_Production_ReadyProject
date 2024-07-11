import * as React from 'react';



export const EmailTemplate= (username:string,otp:string) => (
  <div>
    <h1>Welcome, {username} and your otp is this {otp} sir!</h1>
  </div>
);
