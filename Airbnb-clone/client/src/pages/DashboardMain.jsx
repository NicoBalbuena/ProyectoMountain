import { DashboardState } from "../components/DashboardStateGrid";
import { SideBar } from "../components/SideBar";
import { TransactionChart } from "../components/transactionChart";
export const DashboardMain = () => {
  return (
      <div className="flex-1 px-4 py-4">
        <section className="flex flex-col gap-4 ">
          <DashboardState />
          <TransactionChart />
        </section>
      </div>
  );
};
