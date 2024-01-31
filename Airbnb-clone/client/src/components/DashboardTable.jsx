export const DashboardTable = ({columns,data}) => {
    return (
        <div className="bg-white px-4 pt-3 pb-4 rounded-sm border border-x-gray-200 flex-1">
            <div className="mt-3 "></div>
                <table className="w-full h-full text-gray-700  ">
                    <thead >
                        <tr >
                        {columns.map((column, index) => (
                            <th key={index} >{column}</th>
                        ))}
                            
                        </tr>
                    </thead>
                    <tbody >
                        {data.map((row, index) => (
                        <tr key={index}>
                            {row.map((data, i) => (
                                <td key={i}>{data}</td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
        </div>
    )
}