import React, { Component } from 'react';
import TodosApi from '../../../api/todosApi';

import './styles.scss';

class Todos extends Component {
  constructor(props) {
    super(props);

    this.state = {
      todos: [],
      todo: '',
    };
  }

  async componentDidMount() {
    const { todos } = this.state;
    const res = await TodosApi.getAllTodos();

    this.setState({ todos: res });
  }

  render() {
    const { todos } = this.state;
    console.log('todos', todos);

    return (
      <div className="container">
        <h1 className="heading-primary">todos</h1>

        <div className="content">
          <div className="content__input">
            <input type="text" placeholder="What needs to be done?" />
          </div>
        </div>
      </div>
    );
  }
}

export default Todos;
