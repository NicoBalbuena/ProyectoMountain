import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const dataUsers = [
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
const dataOwners = [
  { "month": "Enero", "owners": 50 },
  { "month": "Febrero", "owners": 60 },
  { "month": "Marzo", "owners": 70 },
  { "month": "Abril", "owners": 80 },
  { "month": "Mayo", "owners": 90 },
  { "month": "Junio", "owners": 100 },
  { "month": "Julio", "owners": 110 },
  { "month": "Agosto", "owners": 120 },
  { "month": "Septiembre", "owners": 130 },
  { "month": "Octubre", "owners": 140 },
  { "month": "Noviembre", "owners": 150 },
  { "month": "Diciembre", "owners": 160 }
]
const dataLodgings = [
  { "month": "Enero", "logins": 1000 },
  { "month": "Febrero", "logins": 1100 },
  { "month": "Marzo", "logins": 1200 },
  { "month": "Abril", "logins": 1300 },
  { "month": "Mayo", "logins": 1400 },
  { "month": "Junio", "logins": 1500 },
  { "month": "Julio", "logins": 1600 },
  { "month": "Agosto", "logins": 1700 },
  { "month": "Septiembre", "logins": 1800 },
  { "month": "Octubre", "logins": 1900 },
  { "month": "Noviembre", "logins": 2000 },
  { "month": "Diciembre", "logins": 2100 }
]


export const TransactionChart = () => {
  return (
    <>
    <div className="h-[22rem] bg-white p-4 rounded-sm border border-x-gray-200 flex flex-col ">
      <h2 className="text-yellow-500 font-medium text-lg">Users</h2>
      <div className="w-full  mt-3 flex flex-1 text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={dataUsers}
            margin={{ top: 20, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3 0 0" vertical={false} />
            <XAxis dataKey="month" />
            <YAxis/>
            <Tooltip />
            <Legend />
            <Bar dataKey="users" fill="#0E2F44" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
    <div className="h-[22rem] bg-white p-4 rounded-sm border border-x-gray-200 flex flex-col ">
      <h2 className="text-yellow-500 font-medium text-lg">Owners</h2>
      <div className="w-full  mt-3 flex flex-1 text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={dataOwners}
            margin={{ top: 20, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3 0 0" vertical={false} />
            <XAxis dataKey="month" />
            <YAxis/>
            <Tooltip />
            <Legend />
            <Bar dataKey="owners" fill="#0E2F44" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
    <div className="h-[22rem] bg-white p-4 rounded-sm border border-x-gray-200 flex flex-col ">
      <h2 className="text-yellow-500 font-medium text-lg">Lodgins</h2>
      <div className="w-full  mt-3 flex flex-1 text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={dataLodgings}
            margin={{ top: 20, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3 0 0" vertical={false} />
            <XAxis dataKey="month" />
            <YAxis/>
            <Tooltip />
            <Legend />
            <Bar dataKey="logins" fill="#0E2F44" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
    </>
  );
};
