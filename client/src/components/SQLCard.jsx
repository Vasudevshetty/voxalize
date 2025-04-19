import AnsiToHtml from "ansi-to-html";
import ResultTable from "./ResultTable";

const ansiConverter = new AnsiToHtml();

const SQLCard = ({ data }) => {
  const { user_query, sql_query, summary, agent_thought_process, sql_result } =
    data;

  const renderedThoughtProcess = ansiConverter.toHtml(
    agent_thought_process || ""
  );

  return (
    <div className="bg-[#1a2a2a] text-white p-4 rounded-xl border border-gray-700 space-y-3">
      <div>
        <p className="text-sm text-gray-400">User Query:</p>
        <p className="text-lg font-semibold">{user_query}</p>
      </div>

      <div>
        <p className="text-sm text-gray-400">SQL Query:</p>
        <pre className="bg-[#111] text-green-400 p-2 rounded-lg overflow-x-auto">
          {sql_query}
        </pre>
      </div>

      {summary && (
        <div>
          <p className="text-sm text-gray-400">Summary:</p>
          <p>{summary}</p>
        </div>
      )}

      {agent_thought_process && (
        <div>
          <p className="text-sm text-gray-400 mb-1">Thought Process:</p>
          <div
            className="bg-black text-white text-sm p-2 rounded-lg overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: renderedThoughtProcess }}
          />
        </div>
      )}

      {sql_result && sql_result.length > 0 && (
        <div>
          <p className="text-sm text-gray-400 mb-1">Results:</p>
          <ResultTable rows={sql_result} />
        </div>
      )}
    </div>
  );
};

export default SQLCard;
