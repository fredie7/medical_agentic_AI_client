// lib/api.ts
import axios from "axios";

const BASE_URL = "http://localhost:8000"; // Adjust if hosted differently

export const initProfile = async (profile: {
  age: number;
  gender: string;
  known_conditions: string[];
}) => {
  return await axios.post(`${BASE_URL}/init_profile`, profile);
};

export const sendQuestion = async (question: string) => {
  const res = await axios.post(`${BASE_URL}/ask`, { question });
  return res.data.response;
};
