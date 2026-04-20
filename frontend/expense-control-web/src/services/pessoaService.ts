import axios from "axios";
import type { Pessoa } from "../types/Pessoa";

const api = axios.create({
  baseURL: "http://localhost:5015/api",
});

export const listarPessoa = async (): Promise<Pessoa[]> => {
  const response = await api.get("/Pessoa");
  return response.data;
};

export const criarPessoa = async (pessoa: Omit<Pessoa, "id">) => {
  const response = await api.post("/Pessoa", pessoa);
  return response.data;
};