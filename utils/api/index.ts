import axios from 'axios';


const BASE_URL = "http://localhost:8000/"

const api = axios.create({
  baseURL: BASE_URL,
});


api.interceptors.request.use((config) => {
  console.log("config >> ", config);
  
  return config;
});


export const createRagContext = async (contextData : string) => {

  const { data } = await api.post('rag/context/', {
    data : contextData,
    type : 'text'
  },
  {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
      
    },
  })

  return data 
}

export const queryRagContext = async (query : string, contextId : string) => {

  const { data } = await api.post('rag/context/query/', {
    "query": query,
    "context_id":contextId
  },
  {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
      
    },
  })

  return data
}

 

