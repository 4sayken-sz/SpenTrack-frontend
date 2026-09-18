import {Card, Input, Button, Table, Popconfirm, Modal, Form, Select} from "antd";
import {SearchOutlined, EditOutlined, DeleteOutlined} from "@ant-design/icons";
import {toast} from "react-toastify";
import {useState} from "react";
import httpDomain from "../../../utils/httpDomain.util.js";
// import useSWR, {mutate} from "swr";
import fetcher from "../../../utils/fetcher.js";
import {formatDate} from "../../../utils/date.js";
import { useEffect } from "react";

const {Item} = Form;

const Transactions = () => {
    const [transactionForm] = Form.useForm(); // hook by antd to manage form state

    const [edit, setEdit] = useState(null);
    const [modal, setModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [num, setNum] = useState(0);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0
    });

    const columns = [
        {
            title: "Transaction Type",
            dataIndex: "transactionType",
            key: "transactionType",
            className: "capitalize"
        },
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            className: "capitalize"
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            className: "capitalize"
        },
        {
            title: "Payment Method",
            dataIndex: "paymentMethod",
            key: "paymentMethod",
            render: (text) => text?.toUpperCase()
        },
        {
            title: "Payment Notes",
            dataIndex: "notes",
            key: "notes",
            className: "capitalize"
        },
        {
            title: "Date",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => formatDate(date),
        },
        {
            title: "Transaction Type",
            dataIndex: "transactionType",
            key: "transactionType",
            className: "capitalize"
        },
        {
            title: "Action",
            dataIndex: "action",
            key: "fixed",
            className: "capitalize",
            render: (_, obj) => (
                <div className="flex gap-1">
                    <Popconfirm
                        title="Are you sure ?"
                        description="Once you edit, current data will be updated !"
                        onCancel={() => toast.info("No Changes made")}
                        onConfirm={() => onEdit(obj)}
                    >
                        <Button type="text" className="!bg-green-100 !text-green-500" icon={<EditOutlined />}></Button>
                    </Popconfirm>
                    <Popconfirm
                        title="Are you sure ?"
                        description="Once you delete, this transaction will be permanently removed !"
                        onCancel={() => toast.info("No Changes made")}
                        // we get this from obj in render above, table will pass the current row data received/stored from api to render function
                        onConfirm={() => onDelete(obj._id)} 
                    >
                        <Button type="primary" className="!bg-rose-100 !text-rose-500" icon={<DeleteOutlined />}></Button>
                    </Popconfirm>
                </div>
            )
        },
    ]

    // const {data:transactions, error, isLoading} = useSWR("/api/transaction/getTransactions", fetcher);

    const fetchTransactions = async (page, pageSize) => {
        try {
            setLoading(true);
            const response = await httpDomain.get(`/api/transaction/getTransactions?page=${page}&limit=${pageSize}`);
            const {transactionInfo, totalTransactions} = response.data;
            setTransactions(transactionInfo);
            setPagination({
                current: page,
                pageSize: pageSize,
                total: totalTransactions
            });
        } catch(err) {
            toast.error(err.response.data.message || err.message || "Failed to fetch transactions");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchTransactions(pagination.current, pagination.pageSize);
    }, [num]);

    const onFinish = async (values) => {
        try {
            setLoading(true);
            const response = await httpDomain.post("/api/transaction/addTransaction", values);
            toast.success(response.data.message || "Transaction created!");
            // mutate("/api/transaction/getTransactions");
            fetchTransactions(pagination.current, pagination.pageSize);
            setModal(false);
            transactionForm.resetFields();
        } catch(err) {
            toast.error(err.response.data.message || err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    const onDelete = async (id) => {
        try {
            setLoading(true);
            const response = await httpDomain.delete(`/api/transaction/removeTransaction/${id}`);
            toast.success(response.data.message || "Transaction deleted!");
            // mutate("/api/transaction/getTransactions");
            fetchTransactions(pagination.current, pagination.pageSize);
        } catch(err) {
            toast.error(err.response.data.message || err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    const onUpdate = async (values) => {
        try {
            setLoading(true);
            const response = await httpDomain.put(`/api/transaction/updateTransaction/${edit._id}`, values);
            toast.success(response.data.message || "Transaction updated!");
            // mutate("/api/transaction/getTransactions");
            fetchTransactions(pagination.current, pagination.pageSize);
            setModal(false);
            transactionForm.resetFields();
            setEdit(null);
        } catch(err) {
            toast.error(err.response.data.message || err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    const onEdit = async (obj) => {
       setEdit(obj);
       transactionForm.setFieldsValue(obj);
       setModal(true);
    }

    const handleTableChange = (pagination) => {
        fetchTransactions(pagination.current, pagination.pageSize);
    }

    return (
        <div>
            <div className="grid">
                <Card title="Transaction List" 
                    style={{overflowX: 'auto'}} 
                    extra={
                        <div className="mt-2 md:mt-0 flex flex-col md:flex-row gap-3">
                            <Input placeholder="Search by all" prefix={<SearchOutlined />}/>
                            <Button type="text" className="!bg-blue-500 !font-bold !text-white" onClick={() => setModal(true)}>Add New Transaction</Button>
                        </div>
                    }
                >
                    <Table 
                        columns={columns}
                        dataSource={transactions}
                        scroll={{x: "max-content"}}
                        loading={loading}
                        pagination={pagination}
                        rowKey="_id"
                        onChange={handleTableChange}
                    />
                    <Modal
                        open={modal}
                        onCancel={() => setModal(false)}
                        title="Add New Transaction"
                        footer={null}
                    >
                        <Form
                            layout="vertical"
                            form={transactionForm}
                            onFinish={edit ? onUpdate : onFinish}
                            onCancel={() => {setModal(false); transactionForm.resetFields(); setEdit(null);}}
                        >
                            <div className="grid gap-x-3 md:grid-cols-2">
                                <Item
                                    label="Transaction"
                                    name="transactionType"
                                    rules={[{required: true, message: "Please select transaction type"}]}
                                >
                                    <Select 
                                        placeholder="Select Transaction Type"
                                        options={[
                                            {label: "Credit", value: "cr"},
                                            {label: "Debit", value: "dr"}
                                        ]}
                                    />
                                </Item>
                                <Item
                                    label="Amount"
                                    name="amount"
                                    rules={[{required: true, message: "Please enter amount"}]}
                                >
                                    <Input placeholder="Enter Amount" type="number"/>
                                </Item>
                                <Item
                                    label="Title"
                                    name="title"
                                    rules={[{required: true, message: "Please enter title"}]}
                                >
                                    <Input placeholder="Enter Title" />
                                </Item>
                                <Item
                                    label="Payment Method"
                                    name="paymentMethod"
                                    rules={[{required: true, message: "Please select payment method"}]}
                                >
                                    <Select 
                                        placeholder="Select Payment Method"
                                        options={[
                                            {label: "Credit Card", value: "cc"},
                                            {label: "Debit Card", value: "dc"},
                                            {label: "Cash", value: "cash"},
                                            {label: "UPI", value: "upi"},
                                        ]}
                                    />
                                </Item>
                            </div>
                            <Item
                                    label="Notes"
                                    name="notes"
                                    rules={[{required: true, message: "Please enter notes"}]}
                                >
                                    <Input.TextArea placeholder="Enter Notes"
                                    />
                                </Item>
                                <Item>
                                    <Button
                                        loading={loading}
                                        type="text"
                                        htmlType="submit"
                                        className={`!font-semibold ${edit ? "!bg-amber-500" : "!bg-blue-500"} !text-white !w-full`}
                                    >
                                        {edit ? "Update Transaction" : "Add Transaction"}
                                    </Button>
                                </Item>
                        </Form>
                    </Modal>
                </Card>
            </div>
        </div>
    )
}

export default Transactions;