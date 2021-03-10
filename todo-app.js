(function () {
 function createAppTitle(title) {
    const appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

  function createTodoItemForm() {
    const form = document.createElement('form');
    const input = document.createElement('input');
    const buttonWrapper = document.createElement('div');
    const button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Type todo name';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.disabled = true;
    button.textContent = 'Add';

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    return {
      form,
      input,
      buttonWrapper,
      button
    };
  }

  function createTodoList() {
    const list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  function createTodoItem(task) {
    const item = document.createElement('li');

    const buttonGroup = document.createElement('div');
    const doneButton = document.createElement('button');
    const deleteButton = document.createElement('button');

    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'alignitems-center');
    item.textContent = task.name;

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Done';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Remove';

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    return {
      item,
      doneButton,
      deleteButton
    };
  };

  function createTodoApp(container, title = 'Список дел', storageKey, defaultTodos) {
    const todoAppTitle = createAppTitle(title);
    const todoItemForm = createTodoItemForm();
    const todoList = createTodoList();

    container.append(todoAppTitle);
    container.append(todoItemForm.form); 
    
    container.append(todoList);

    const todoArray = [];

    if (localStorage.getItem(storageKey) !== null) {
      const storedTasks = JSON.parse(localStorage.getItem(storageKey));
      addTodoList(storedTasks);
    } else {
      if (defaultTodos) {
        addTodoList(defaultTodos)
      };
    };

    function addTodoList(list) {
      for (let todoItem of list) {
        todoArray.push(todoItem);
        const todo = createTodoItem(todoItem);
        if (todoItem.done) {
          todo.item.classList.add('list-group-item-success')
        };

        todoList.append(todo.item);

        todo.doneButton.addEventListener('click', function () {
          todo.item.classList.toggle('list-group-item-success');
          if (todo.item.classList.contains('list-group-item-success')) {
            todoItem.done = true;
          } else {
            todoItem.done = false;
          }
          localStorage.removeItem(storageKey);
          localStorage.setItem(storageKey, JSON.stringify(todoArray));
        });

        todo.deleteButton.addEventListener('click', function () {
          if (confirm('Are you sure?')) {
            todo.item.remove();
            todoArray.splice(todoArray.indexOf(todoItem), 1);
            localStorage.removeItem(storageKey);
            localStorage.setItem(storageKey, JSON.stringify(todoArray));
          };
        });
      };
    };

    todoItemForm.input.addEventListener('input', function () {
      if (todoItemForm.input.value.trim() === "") {
        todoItemForm.button.disabled = true;
      } else {
        todoItemForm.button.disabled = false;
      };
    });

    todoItemForm.form.addEventListener('submit', function (e) {
      e.preventDefault();

      //create todo object 
      const inputTodo = {};
      inputTodo.name = todoItemForm.input.value;
      inputTodo.done = false;
      todoArray.push(inputTodo);

      const todoItem = createTodoItem(inputTodo);
      todoList.append(todoItem.item);

      localStorage.setItem(storageKey, JSON.stringify(todoArray));

      todoItem.doneButton.addEventListener('click', function () {
        todoItem.item.classList.toggle('list-group-item-success');
        if (todoItem.item.classList.contains('list-group-item-success')) {
          inputTodo.done = true;
        } else {
          inputTodo.done = false;
        }
        localStorage.removeItem(storageKey);
        localStorage.setItem(storageKey, JSON.stringify(todoArray));

      });
      todoItem.deleteButton.addEventListener('click', function () {
        if (confirm('Are you sure?')) {
          todoItem.item.remove();
          todoArray.splice(todoArray.indexOf(inputTodo), 1);
          localStorage.removeItem(storageKey);
          localStorage.setItem(storageKey, JSON.stringify(todoArray));
        }
      });

      todoItemForm.input.value = '';

      todoItemForm.button.disabled = true;
    });

  };
  window.createTodoApp = createTodoApp;
})();
