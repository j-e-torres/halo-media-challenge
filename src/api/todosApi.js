import axios from 'axios';
import { API_BASE_URL } from './config';

class TodosApi {
  getAllTodos = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/todos`);

      return res.data;
    } catch (error) {
      throw error;
    }
  };

  createTodo = async (data) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/todos`, data);

      return res.data;
    } catch (error) {
      throw error;
    }
  };
}

export default TodosApi = new TodosApi();
