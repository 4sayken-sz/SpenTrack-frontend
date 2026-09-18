import {Card, Button, Divider} from "antd";
import {BarChartOutlined, PlusCircleOutlined, MinusCircleOutlined, DollarCircleOutlined} from "@ant-design/icons";
import DailyTransactionChart from "../DailyTransactions.jsx";
import {generateFakeTransactions} from "../../../utils/fakeTransactions.js"; 
import {useState, useEffect} from "react";
import httpDomain from "../../../utils/httpDomain.util.js";
import Loader from "../Loader.jsx";

const fakeTransactions = generateFakeTransactions(30);

const Dashboard = () => {
    const [report, setReport] = useState(null);

    useEffect(() => {
        httpDomain.get("/api/dashboard/report")
        .then((response) => setReport(response.data))
        .catch((error) => console.error("Error fetching report:", error));
    }, []);

    if(!report) {
        return <Loader />;
    }

    const {summary, chart} = report;

    return (
        <div>
            <div className="grid md:grid-cols-4 gap-6">
                <Card className="shadow">
                    <div className="flex justify-around items-center">
                        <div className="flex items-center flex-col gap-y-2">
                            <Button type="primary" icon={<BarChartOutlined />} size="large" shape="circle" className="!bg-rose-600"></Button>
                        </div>
                        <h1 className="text-xl font-semibold text-rose-600">Total Transaction</h1>
                        <Divider type="vertical" className="!h-24" />
                        <div className="flex flex-col items-center">
                            <h1 className="text-3xl font-bold text-rose-400">{summary.totalTransactions}</h1>
                            <p className="text-lg mt-1 text-gray-500">{summary.estimatedTransactions} Estimate</p>
                        </div>
                    </div>
                </Card>
                <Card className="shadow">
                    <div className="flex justify-around items-center">
                        <div className="flex items-center flex-col gap-y-2">
                            <Button type="primary" icon={<PlusCircleOutlined />} size="large" shape="circle" className="!bg-green-600"></Button>
                        </div>
                        <h1 className="text-xl font-semibold text-green-600">Total Credit</h1>
                        <Divider type="vertical" className="!h-24" />
                        <div className="flex flex-col items-center">
                            <h1 className="text-3xl font-bold text-green-400">{summary.totalCredit} ₹</h1>
                            <p className="text-lg mt-1 text-gray-500">{summary.estimatedCredit} Estimate</p>
                        </div>
                    </div>
                </Card>
                <Card className="shadow">
                    <div className="flex justify-around items-center">
                        <div className="flex items-center flex-col gap-y-2">
                            <Button type="primary" icon={<MinusCircleOutlined />} size="large" shape="circle" className="!bg-orange-600"></Button>
                        </div>
                        <h1 className="text-xl font-semibold text-orange-600">Total Debit</h1>
                        <Divider type="vertical" className="!h-24" />
                        <div className="flex flex-col items-center">
                            <h1 className="text-3xl font-bold text-orange-400">{summary.totalDebit} ₹</h1>
                            <p className="text-lg mt-1 text-gray-500">{summary.estimatedDebit} Estimate</p>
                        </div>
                    </div>
                </Card>
                <Card className="shadow">
                    <div className="flex justify-around items-center">
                        <div className="flex items-center flex-col gap-y-2">
                            <Button type="primary" icon={<DollarCircleOutlined />} size="large" shape="circle" className="!bg-blue-600"></Button>
                        </div>
                        <h1 className="text-xl font-semibold text-blue-600">Balance</h1>
                        <Divider type="vertical" className="!h-24" />
                        <div className="flex flex-col items-center">
                            <h1 className="text-3xl font-bold text-blue-400">{summary.totalBalance} ₹</h1>
                            <p className="text-lg mt-1 text-gray-500">{summary.estimatedBalance} Estimate</p>
                        </div>
                    </div>
                </Card>
            </div>
            <div className="hidden md:block mt-5 grid md:grid-cols-1">
                <DailyTransactionChart transactions={chart} />
            </div>
        </div>
    )
}

export default Dashboard;