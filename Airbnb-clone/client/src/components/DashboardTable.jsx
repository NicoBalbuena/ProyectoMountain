export const DashboardTable = ({ columns, data, onDeleteRow }) => {
    return (
      <div className="bg-white px-4 pt-3 pb-4 rounded-sm border border-x-gray-200 flex-1">
        <div className="mt-3"></div>
        <table className=" w-full h-full text-gray-700  ">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index}>{column}</th>
              ))}
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="">
            {data.map((row, index) => (
              <tr className="" key={index}>
                {row.map((data, i) => (
                  <td className="px-3"  key={i}>{data}</td>
                ))}
                {index >= 0 && (
                  <td>
                    <button className="bg-red-500" onClick={() => onDeleteRow(index, row[0])}>Delete</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };