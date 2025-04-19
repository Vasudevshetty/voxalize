const ResultTable = ({ rows }) => {
  if (!rows || rows.length === 0) return null;

  const headers = Object.keys(rows[0]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-700 text-sm">
        <thead className="bg-[#0f1f1f] text-white">
          <tr>
            {headers.map((header) => (
              <th key={header} className="p-2 border-b border-gray-600">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} className="text-gray-200">
              {headers.map((header) => (
                <td key={header} className="p-2 border-b border-gray-700">
                  {row[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultTable;
