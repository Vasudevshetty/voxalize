import axios from "axios";

const BASE_URL = "https://studysyncs.xyz/services";

export const fetchSuggestions = async (databaseConfig) => {
  try {
    const res = await axios.post(`${BASE_URL}/recommend`, {
      database_config: databaseConfig,
    });
    // Ensure we return strings
    return res.data.recommended_queries.map((query) =>
      typeof query === "object" ? query.query : query
    );
  } catch (err) {
    console.error("Failed to fetch suggestions:", err);
    throw err;
  }
};

export const fetchCompletions = async (query, databaseConfig) => {
  try {
    const res = await axios.post(`${BASE_URL}/search-completions`, {
      term: query,
      database_config: databaseConfig,
    });
    // Ensure we return strings
    return res.data.completions.map((completion) =>
      typeof completion === "object" ? completion.query : completion
    );
  } catch (err) {
    console.error("Failed to fetch completions:", err);
    throw err;
  }
};

export const getGraphRecommendations = async (sqlResponse) => {
  try {
    const res = await axios.post(`${BASE_URL}/graphrecommender`, {
      sql_result_json: sqlResponse,
    });
    return res.data;
  } catch (err) {
    console.error("Failed to get graph recommendations:", err);
    throw err;
  }
};
