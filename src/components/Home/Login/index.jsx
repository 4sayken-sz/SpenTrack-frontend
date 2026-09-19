import {Card, Form, Input, Button} from "antd";
import {UserOutlined, LockOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";
import {useState} from "react";
import axios from "axios";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import expImg from "../../../assets/exp-img.jpg";

const {Item} = Form;
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
axios.defaults.withCredentials = true;

const Login = () => {
    const [loginForm] = Form.useForm(); // hook by antd to manage form state
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            setLoading(true);
            const {data} = await axios.post("/api/user/login", values);
            const role = data.role;
            if(role === "admin") {
                toast.success("Admin login successful");
                return navigate("/app/admin");
            }
            if(role === "user") {
                toast.success("User login successful");
                return navigate("/app/user");
            }
            toast.success(data.message || "Login successful");
        } catch(err) {
            toast.error(err.response.data.message || err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    const handleDemoUserLogin = async () => {
        const values = {
            email: "dummyuser@test.com",
            password: "thisisnotsecure"
        };
        try {
            setLoading(true);
            const {data} = await axios.post("/api/user/login", values);
            const role = data.role;
            if(role === "admin") {
                toast.success("Admin login successful");
                return navigate("/app/admin");
            }
            if(role === "user") {
                toast.success("User login successful");
                return navigate("/app/user");
            }
            toast.success(data.message || "Login successful");
        } catch(err) {
            toast.error(err.response.data.message || err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    const handleDemoAdminLogin = async () => {
        const values = {
            email: "dummyadmin@test.com",
            password: "thisisnotsecure"
        };
        try {
            setLoading(true);
            const {data} = await axios.post("/api/user/login", values);
            const role = data.role;
            if(role === "admin") {
                toast.success("Admin login successful");
                return navigate("/app/admin");
            }
            if(role === "user") {
                toast.success("User login successful");
                return navigate("/app/user");
            }
            toast.success(data.message || "Login successful");
        } catch(err) {
            toast.error(err.response.data.message || err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex">
            <div className="w-1/2 hidden md:flex items-center justify-center">
                <img src={expImg} alt="Expense Tracking" className="w-4/5 object-contain" />
            </div>
            <div className="w-full md:w-1/2 flex items-center justify-center p-2 md:p-6 bg-white">
                <Card className="w-full max-w-sm shadow-xl">
                    <h2 className="font-bold text-[#FF735C] text-2xl text-center mb-6">Track Your Expense</h2>
                    <Form name="loginForm" layout="vertical" className="w-full max-w-sm mt-6" onFinish={onFinish} form={loginForm}>
                        <Item name="email" label="Email" rules={[{required: true, message: 'Please enter your email!'}]}>
                            <Input prefix={<UserOutlined />} placeholder="Enter Username/Email" />
                        </Item>
                        <Item name="password" label="Password" rules={[{required: true, message: 'Please enter your password!'}]}>
                            <Input.Password prefix={<LockOutlined />} placeholder="Enter Password" />
                        </Item>
                        <Item>
                            <Button loading={loading} type="text" htmlType="submit" className="!bg-[#FF735C] !text-white !font-bold" block>
                                Login
                            </Button>
                        </Item>
                    </Form>
                    <div className="flex items-center justify-between">
                        <Link style={{textDecoration: 'underline'}} to="/forgot-password" className="!text-[#FF735C] !font-bold">Forgot Password?</Link>
                        <Link style={{textDecoration: 'underline'}} to="/signup" className="!text-[#FF735C] !font-bold">Dont have an account?</Link>
                    </div>
                    <div className="flex items-center my-4">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink mx-3 text-xs font-semibold text-gray-400 tracking-wider">OR</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                {/* Recruiter Quick-Access Demo Section */}
                <div className="space-y-2">
                    <p className="text-[15px] text-center text-gray-500 font-medium">Instant Demo Login Access</p>
                    <div className="flex gap-2">
                        <Button
                            type="default"
                            onClick={handleDemoUserLogin}
                            className="flex-1 !border-gray-300 !text-gray-700 !font-semibold text-xs hover:!border-[#FF735C] hover:!text-[#FF735C]"
                            block
                        >
                            User Demo
                        </Button>
                        <Button
                            type="primary"
                            onClick={handleDemoAdminLogin}
                            className="flex-1 !bg-slate-800 !text-white !font-semibold text-xs hover:!bg-[#FF735C]"
                            block
                        >
                            Admin Demo
                        </Button>
                    </div>
                </div>
                </Card>
            </div>
        </div>
    )
}

export default Login;