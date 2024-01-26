import Tables from "../components/Table";
const Dashboard = () => {
  return (
    <main className="max-w-full h-auto  text-white grid grid-cols-[auto,80%] gap-4">
      <aside className="bg-primary h-screen flex justify-center overflow-hidden sticky top-0 p-4">
        <article className="flex flex-col text-wrap text-center  ">
          <header className="py-4 ">
            <h1 className="font-bold text-3xl">MountainHaven</h1>
          </header>
          <section className="text-2xl text-left">
            <ul className="list-none cursor-pointer">
              <li className="hover:underline">Users</li>
              <li className="hover:underline">Owners</li>
              <li className="hover:underline">Lodgings</li>
            </ul>
          </section>
        </article>
      </aside>
      <section className="bg-blue-200 text-red-900 flex flex-col gap-4 mx-auto w-10/12 text-center my-5">
        <div className="Title">Dashboard</div>
        <div className="grid grid-cols-2  gap-4  justify-items-center">
          <Tables />
        
        </div>
      </section>
    </main>
  );
};
export default Dashboard;
