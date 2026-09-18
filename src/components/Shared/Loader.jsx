import {Spin} from "antd";

const Loader = () => {
    return (
        <div className="flex items-center justify-center h-screen !text-white h-screen bg-black"> 
            <Spin tip="loading..." size="large" />
        </div>
    );
}

export default Loader;