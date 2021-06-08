import React, { Component } from 'react';
import TodosApi from '../../../api/todosApi';

import './styles.scss';
import { ReactComponent as Arrow } from './assets/arrow.svg';

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
            <button className="content__button">
              {/* <svg class="content__arrowIcon">
                <use xlink:href="assets/arrow.svg"></use>
              </svg> */}
              <Arrow />
            </button>

            <input type="text" placeholder="What needs to be done?" />
          </div>
        </div>
      </div>
    );
  }
}

export default Todos;
