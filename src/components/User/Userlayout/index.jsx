import {Layout, Image, Menu, Button, theme} from "antd";
import {AppstoreAddOutlined, BarChartOutlined, MenuOutlined, LogoutOutlined, MoneyCollectOutlined} from "@ant-design/icons";
import {useState} from "react";
import {useNavigate, Outlet, Navigate, useLocation} from "react-router-dom";
import {toast} from "react-toastify";
import httpDomain from "../../../utils/httpDomain.util.js";
import logoImg from "../../../assets/logo.png";
// import useSWR from "swr";
// import fetcher from "../../../utils/fetcher";
// import Loader from "../../Shared/Loader";

const {Sider, Header, Content, Footer} = Layout;

const Items = [
    {
        key : "/app/user/dashboard",
        label : "Dashboard",
        icon : <AppstoreAddOutlined />
    },
    {
        key : "/app/user/report",
        label : "Reports",
        icon : <BarChartOutlined />
    },
    {
        key : "/app/user/transactions",
        label : "Transactions",
        icon : <MoneyCollectOutlined />
    }
]

const siderStyle = {
    overflow: 'auto',
    height: '100vh',
    position: 'sticky',
    insertInlineStart: 0,
    top: 0,
    bottom: 0,
    scrollbarGutter: 'stable',
    scrollbarWidth: 'thin',
};

const headerStyle = {
    position: 'sticky',
    top: 0,
    zIndex: 1,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: 0
};


const Userlayout = () => {
    const [openMenu, setOpenMenu] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const {pathname} = useLocation();
    
    const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
    
    const handleNavigate = (menu) => {
        navigate(menu.key);
    }

    const logout = async () => {
        try {
            setLoading(true);
            await httpDomain.get("/api/user/logout");
            setLoading(false);
            navigate("/");
        } catch(err) {
            setLoading(false);
            toast.error(err.response.data.message || err.message || "Something went wrong");
        }
    }

    // const {data:session, error, isLoading} = useSWR("/api/user/session", fetcher);

    // if(isLoading) {
    //     return <Loader />
    // }

    // if((!session && session?.role !== "user") || error) {
    //     return <Navigate to="/" /> // used mid rendering in react while usenavigate is used in event after rendering is done 
    // }

    return (
        <Layout className="!min-h-screen">
            <Sider style={siderStyle} collapsible collapsed={openMenu}>
                <div className="flex justify-center items-center my-4">
                    <Image width={60} height={60} src={logoImg} alt="logo" className="rounded-full !text-center !mx-auto mb-3" />
                </div>
                <Menu onClick={handleNavigate} defaultSelectedKeys={pathname} theme="dark" items={Items} />
            </Sider>
            <Layout>
                <Header className="flex items-center justify-between !px-5 !bg-white !shadow">
                    <Button onClick={()=>setOpenMenu(!openMenu)} icon={<MenuOutlined />}/>
                    <Button onClick={logout} icon={<LogoutOutlined />}/>
                </Header>
                <Content className="!p-5" style={{margin: '4px 8px', padding: 4, minHeight: 280, background: colorBgContainer, borderRadius: borderRadiusLG}}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    )
}

export default Userlayout;