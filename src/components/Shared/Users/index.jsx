import {Card, Input, Button, Table, Form} from "antd";
import {SearchOutlined, EyeOutlined, EyeInvisibleOutlined} from "@ant-design/icons";
import {toast} from "react-toastify";
import {useState, useEffect} from "react";
import httpDomain from "../../../utils/httpDomain.util.js";
// import useSWR, {mutate} from "swr";
import fetcher from "../../../utils/fetcher.js";
import {formatDate} from "../../../utils/date.js";

const Users = () => {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [num, setNum] = useState(0);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0
    });

    const columns = [
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
            className: "capitalize"
        },
        {
            title: "Fullname",
            dataIndex: "fullName",
            key: "fullName",
            className: "capitalize"
        },
        {
            title: "Mobile",
            dataIndex: "mobile",
            key: "mobile",
            className: "capitalize"
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Date",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => formatDate(date),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status, obj) => {
                return (
                    <div className="flex flex-col items-center justify-center gap-1">
                        {   
                            status ?
                            <Button 
                                size="small"
                                shape="circle" 
                                className={"!bg-emerald-50 !text-emerald-600 !border-emerald-300 hover:!bg-emerald-100"}
                                icon={<EyeOutlined />} 
                                onClick={() => onStatus(obj)}
                                loading={loading}
                                />
                                :
                                <Button 
                                size="small"
                                shape="circle" 
                                className={"!bg-rose-50 !text-rose-600 !border-rose-300 hover:!bg-rose-100"}
                                icon={<EyeInvisibleOutlined />} 
                                onClick={() => onStatus(obj)}
                            />
                        }
                        
                        <span className={`text-[11px] font-semibold tracking-wide ${status ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {status ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                )
            }
        },
    ]

    // const {data:userData, error, isLoading} = useSWR("/api/user/getUsers", fetcher);

    const fetchUsers = async (page, pageSize) => {
        try {
            setLoading(true);
            const response = await httpDomain.get(`/api/user/getUsers?page=${page}&limit=${pageSize}`);
            const {allUsers, totalUsers} = response.data;
            setUsers(allUsers);
            setPagination({
                current: page,
                pageSize: pageSize,
                total: totalUsers
            });
        } catch(err) {
            toast.error(err.response.data.message || err.message || "Failed to fetch users");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUsers(pagination.current, pagination.pageSize);
    }, [num]);

    const onStatus = async (obj) => {
        try {
            setLoading(true);
            const response = await httpDomain.put(`/api/user/status/${obj._id}`, { status: !obj.status });
            toast.success(response.data.message || "Status updated successfully");
            // mutate("/api/user/getUsers"); // revalidate the data after status update
            fetchUsers(pagination.current, pagination.pageSize); // re-fetch users after status update
        } catch(err) {
            toast.error(err.response.data.message || err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    const handleTableChange = (pagination) => {
        fetchUsers(pagination.current, pagination.pageSize);
    }

    return (
        <div>
            <div className="grid">
                <Card title="User List" 
                    style={{overflowX: 'auto'}} 
                    extra={
                        <div className="mt-2 md:mt-0 flex flex-col md:flex-row gap-3">
                            <Input placeholder="Search by all" prefix={<SearchOutlined />}/>
                        </div>
                    }
                >
                    <Table 
                        columns={columns}
                        dataSource={users}
                        scroll={{x: "max-content"}}
                        loading={loading}
                        pagination={pagination}
                        rowKey="_id"
                        onChange={handleTableChange}
                    />
                </Card>
            </div>
        </div>
    )
}

export default Users;