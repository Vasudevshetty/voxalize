import axios from "axios";

const BASE_URL = "https://studysyncs.xyz/services";

export const fetchSuggestions = async (databaseConfig) => {
  try {
    const res = await axios.post(`${BASE_URL}/recommend`, {
      database_config: databaseConfig,
    });
    return res.data.recommended_queries;
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
    return res.data.completions;
  } catch (err) {
    console.error("Failed to fetch completions:", err);
    throw err;
  }
};
