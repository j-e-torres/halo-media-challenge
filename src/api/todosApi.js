import axios from 'axios';
import { API_BASE_URL } from './config';

class TodosApi {
  constructor() {}

  getAllTodos = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/todos`);

      return res.data;
    } catch (error) {
      throw error;
    }
  };
}

export default TodosApi = new TodosApi();
