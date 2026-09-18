import {useState, useEffect} from "react";
import {Navigate} from "react-router-dom";
import httpDomain from "../../utils/httpDomain.util.js";
import Loader from "../Shared/Loader";

const Guard = ({endpoint, role, children}) => {
    const [authorized, setAuthorized] = useState(false);
    const [loader, setLoader] = useState(true);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const verifySession = async () => {
            try {
                const {data} = await httpDomain.get(endpoint);
                sessionStorage.setItem("user", JSON.stringify(data.userInfo)); // local storage can only store string values, so we need to convert the object to a string using JSON.stringify()
                setUserRole(data?.userInfo.role);
                setLoader(false);
                setAuthorized(true);
            } catch (error) {
                setUser(data?.userInfo);
                setLoader(false);
                setAuthorized(false);
                console.error("Error fetching session:", error);
            } finally {
                setLoader(false);
            }
        };
        verifySession();
    }, [endpoint]);

    if (loader) {
        return <Loader />;
    }

    if(authorized && role === userRole) { // role passed from the route and user role fetched from the session
        return children; 
    } else {
        return <Navigate to="/" />; 
    }
};

export default Guard;