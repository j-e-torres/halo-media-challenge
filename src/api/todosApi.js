import axios from 'axios';
import { API_BASE_URL } from './config';

class TodosApi {
  getAllTodos = async (options) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/todos${options}`);

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

  toggleComplete = async ({ id, data }) => {
    try {
      const res = await axios.put(`${API_BASE_URL}/todos/${id}`, data);

      return res.data;
    } catch (error) {
      throw error;
    }
  };

  deleteTodo = async (id) => {
    try {
      const res = await axios.delete(`${API_BASE_URL}/todos/${id}`);

      return res.data;
    } catch (error) {
      throw error;
    }
  };

  toggleCompleteAll = async ({ todos, data }) => {
    try {
      const res = await Promise.all(
        todos.map(
          async (todo) =>
            await axios.put(`${API_BASE_URL}/todos/${todo.id}`, data)
        )
      );

      return res;
    } catch (error) {
      throw error;
    }
  };

  deleteAllCompleted = async ({ todos }) => {
    try {
      const res = await Promise.all(
        todos.map(
          async (todo) => await axios.delete(`${API_BASE_URL}/todos/${todo.id}`)
        )
      );

      return res;
    } catch (error) {
      throw error;
    }
  };
}

export default TodosApi = new TodosApi();
