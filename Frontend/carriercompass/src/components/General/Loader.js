import React from "react";
import "../../styles/General/Loader.css";


const loader = () => {
    return (
        <div>
            <div className="dots-loader-container">
                <div className="dots-loader">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </div>
    );
};

export default loader;
