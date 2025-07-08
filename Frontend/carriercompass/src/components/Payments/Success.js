import React from "react";

export default function Success() {
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "50vh",
  };

  const boxStyle = {
    textAlign: "center",
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    color: "black",
    fontFamily: "Arial, sans-serif",
  };

  const headingStyle = {
    fontSize: "28px",
    marginBottom: "16px",
  };

  const paragraphStyle = {
    fontSize: "18px",
  };

  return (
    <div style={containerStyle}>
      <div style={boxStyle}>
        <h1 style={headingStyle}>Thank you for your purchase!</h1>
        <p style={paragraphStyle}>Your payment was successful.</p>
      </div>
    </div>
  );
}

