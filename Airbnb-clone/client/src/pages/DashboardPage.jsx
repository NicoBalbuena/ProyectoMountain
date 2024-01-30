//components
import Tables from "../components/Table";
import { SideBar } from "../components/SideBar";
import { DashboardState } from "../components/DashboardStateGrid";
import { TransactionChart } from "../components/transactionChart";
const Dashboard = () => {
  return (
    <main className="flex flex-row bg-neutral-100  w-screen  overflow-hidden">
      <SideBar />
      <div className="flex-1 px-4 py-4">
        <section className="flex flex-col gap-4 ">
          <DashboardState />
          <TransactionChart/>
          </section>
      </div>
    </main>
  );
};
export default Dashboard;
