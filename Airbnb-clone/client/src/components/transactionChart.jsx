import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

const dataUser = [
  { month: "Enero", users: 150 },
  { month: "Febrero", users: 200 },
  { month: "Marzo", users: 180 },
  { month: "Abril", users: 220 },
  { month: "Mayo", users: 250 },
  { month: "Junio", users: 210 },
  { month: "Julio", users: 190 },
  { month: "Agosto", users: 230 },
  { month: "Septiembre", users: 270 },
  { month: "Octubre", users: 240 },
  { month: "Noviembre", users: 260 },
  { month: "Diciembre", users: 280 },
];

export const TransactionChart = () => {
  return (
    <div className="h-[22rem] bg-white p-4 rounded-sm border-x-gray-200 flex-col flex-1">
      <h2 className="text-pink-500 font-medium text-lg">Users</h2>
      <div className="w-full mt-3 flex-1 text-xs">
        <ResponsiveContainer width={"100%"} height={"100%"}>
        <BarChart
            width={500}
            height={300}
            data={dataUser}
            margin={{ top: 20, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3 0 0" vertical={false} />
            <XAxis dataKey="month" />
            <Tooltip />
            <Legend />
            <Bar dataKey="users" fill="#0ea5e9" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
