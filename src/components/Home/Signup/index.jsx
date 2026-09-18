import {Card, Form, Input, Button} from "antd";
import {UserOutlined, LockOutlined, MailOutlined, MobileOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";
import Homelayout from "../../../layout/Homelayout";
import axios from "axios";
import {useState} from "react";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import otpImg from "../../../assets/otp-img.jpg";

const {Item} = Form;
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
axios.defaults.withCredentials = true;

const Signup = () => {
    const [signupForm] = Form.useForm(); // hook by antd to manage form state

    const [formData, setFormData] = useState(null);
    const [otp, setOtp] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            setLoading(true);
            const {data} = await axios.post("/api/user/sendOTP", values);
            console.log(data);
            setOtp(data.otp);
            setFormData(values);
        } catch(err) {
            toast.error(err.response.data.message || err.message || "Something went wrong");
            setOtp(null);
            setFormData(null);
        } finally {
            setLoading(false);
        }
    }

    const onSignup = async (values) => {
        try {
            if(Number(values.otp) !== Number(otp)) {
                toast.error("Invalid OTP");
                return;
            }
            setLoading(true);
            const {data} = await axios.post("/api/user/signup", formData);
            toast.success("Signup successful");
            setOtp(null);
            setFormData(null);
            signupForm.resetFields();
            return navigate("/");
        } catch(err) {
            toast.error(err.response.data.message || err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Homelayout>
            <div className="flex items-center justify-center max-h-screen">
                <div className="w-1/2 hidden md:flex items-center justify-center">
                    <img src={otpImg} alt="Expense Tracking" className="w-4/5 object-contain" />
                </div>
                <div className="w-full md:w-1/2 flex items-center justify-center p-2 md:p-6 bg-white">
                    <Card className="w-full max-w-sm shadow-xl">
                        <h2 className="font-bold text-[#FF735C] text-2xl text-center mb-6">Track Your Expense</h2>
                        {
                            otp ? 
                                <Form name="otp-form" layout="vertical" className="w-full max-w-sm mt-6" onFinish={onSignup}>
                                    <Item name="otp" label="FullName" rules={[{required: true, message: 'Please enter your full name!'}]}>
                                        <Input.OTP prefix={<UserOutlined />} placeholder="Enter Full Name" length={6} size="large" style={{width: '100%', justifyContent: 'space-between'}} />
                                    </Item>
                                    <Item>
                                        <Button loading={loading} type="text" htmlType="submit" className="!bg-[#FF735C] !text-white !font-bold" block>
                                            Verify Now
                                        </Button>
                                    </Item>
                                </Form>
                                :
                                <Form name="signup-form" layout="vertical" className="w-full max-w-sm mt-6" onFinish={onFinish} form={signupForm}>
                                    <Item name="fullName" label="FullName" rules={[{required: true, message: 'Please enter your full name!'}]}>
                                        <Input prefix={<UserOutlined />} placeholder="Enter Full Name" />
                                    </Item>
                                    <Item name="mobile" label="Mobile" rules={[{required: true, message: 'Please enter your mobile number!'}]}>
                                        <Input prefix={<MobileOutlined />} placeholder="Enter Mobile Number" />
                                    </Item>
                                    <Item name="email" label="Email" rules={[{required: true, message: 'Please enter your email!'}]}>
                                        <Input prefix={<MailOutlined />} placeholder="Enter Email" />
                                    </Item>
                                    <Item name="password" label="Password" rules={[{required: true, message: 'Please enter your password!'}]}>
                                        <Input.Password prefix={<LockOutlined />} placeholder="Enter Password" />
                                    </Item>
                                    <Item>
                                        <Button loading={loading} type="text" htmlType="submit" className="!bg-[#FF735C] !text-white !font-bold" block>
                                            Register
                                        </Button>
                                    </Item>
                                </Form>
                        
                        }
                        <div className="flex items-center justify-center">
                            <Link style={{textDecoration: 'underline'}} to="/" className="!text-[#FF735C] !font-bold">Already have an account?</Link>
                        </div>
                    </Card>
                </div>
            </div>
        </Homelayout>
    )
}

export default Signup;