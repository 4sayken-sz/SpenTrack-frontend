import {Card, Form, Input, Button} from "antd";
import {UserOutlined, LockOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";
import {useState, useEffect} from "react";
import axios from "axios";
import {toast} from "react-toastify";
import {useNavigate, useSearchParams} from "react-router-dom";
import Homelayout from "../../../layout/Homelayout";

const {Item} = Form;
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
axios.defaults.withCredentials = true;

const ForgotPassword = () => {
    const [forgotForm] = Form.useForm(); // hook by antd to manage form state
    const [rePasswordForm] = Form.useForm(); // hook by antd to manage form state

    const [params] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const tok = params.get("token");
        if (tok) {
            checkToken(tok);
        } else {
            setToken(null);
        }
    }, [params]);

    const checkToken = async (tok) => {
        try {
            setLoading(true);
            const {data} = await axios.post("/api/user/verify-token", {}, {
                headers: {
                    Authorization: `Bearer ${tok}`
                }
            });
            setToken(tok);
        } catch(err) {
            toast.error(err.response.data.message || err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const passwordChange = async (values) => {
        try {
            setLoading(true);
            const {data} = await axios.post("/api/user/forgot-password", values);
            toast.success(data.message || "Password reset link sent to your email");
        } catch(err) {
            toast.error(err.response.data.message || err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    const onChangePassword = async (values) => {
        try {
            if(values.password !== values.repeatPassword) {
                toast.warning("Passwords do not match");
                return;
            }

            setLoading(true);
            const {data} = await axios.put("/api/user/change-password", values, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success(data.message || "Password changed successfully, please wait...");
            
            setTimeout(() => {
                navigate("/");
            }, 5000);
        } catch(err) {
            toast.error(err.response.data.message || err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Homelayout>
            <div className="flex w-full items-center justify-center">
                <div className="w-full md:w-1/2 flex items-center justify-center p-2 md:p-6 bg-white">
                    <Card className="w-full max-w-sm shadow-xl">
                        <h2 className="font-bold text-[#FF735C] text-2xl text-center mb-6">
                            {
                                token ? "Change Password" : "Forgot Password"
                            }
                        </h2>
                        {
                            token ? 
                            <Form name="re-forgot-password" layout="vertical" className="w-full max-w-sm mt-6" onFinish={onChangePassword} form={rePasswordForm}>
                                <Item name="password" label="Password" rules={[{required: true, message: 'Please enter your password!'}]}>
                                    <Input.Password prefix={<LockOutlined />} placeholder="Enter Password" />
                                </Item>
                                <Item name="repeatPassword" label="Repeat-Password" rules={[{required: true, message: 'Please enter your password again!'}]}>
                                    <Input.Password prefix={<LockOutlined />} placeholder="Re Enter Password" />
                                </Item>
                                <Item>
                                    <Button loading={loading} type="text" htmlType="submit" className="!bg-[#FF735C] !text-white !font-bold" block>
                                        Change Password
                                    </Button>
                                </Item>
                            </Form>
                            :
                            <Form name="forgot-password" layout="vertical" className="w-full max-w-sm mt-6" onFinish={passwordChange} form={forgotForm}>
                                <Item name="email" label="Email" rules={[{required: true, message: 'Please enter your email!'}]}>
                                    <Input prefix={<UserOutlined />} placeholder="Enter Username/Email" />
                                </Item>
                                <Item>
                                    <Button loading={loading} type="text" htmlType="submit" className="!bg-[#FF735C] !text-white !font-bold" block>
                                        Submit
                                    </Button>
                                </Item>
                            </Form>
                        }
                        <div className="flex items-center justify-between">
                            <Link style={{textDecoration: 'underline'}} to="/" className="!text-[#FF735C] !font-bold">Go to Login</Link>
                            <Link style={{textDecoration: 'underline'}} to="/signup" className="!text-[#FF735C] !font-bold">Dont have an account?</Link>
                        </div>
                    </Card>
                </div>
            </div>
        </Homelayout>
    )
}

export default ForgotPassword;