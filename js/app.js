let todoArr = [];
let localTodoLists = localStorage.getItem('jqueryTodos');

$(document).ready(function () {
  // ----------- Get Local Todos & Show --------------
  if (localTodoLists) {
    todoArr = JSON.parse(localTodoLists);

    todoArr.forEach(todo => {
      const taskElement = buildTask(todo.task).data('id', todo.id);
      if (todo.done) {
        taskElement.prependTo('#done');
        taskElement.addClass('text-decoration-line-through');
        $('input', taskElement).attr('checked', 'checked');
      } else {
        taskElement.appendTo('#tasks');
        taskElement.removeClass('text-decoration-line-through');
        $('input', taskElement).removeAttr('checked');
      }
    });

    $('h1 span').html($('#tasks li').length);
  }

  // ----------- New Task Click Event ---------------
  $('#new-task button').on('click', function() {
    const task = $('#new-task input').val();

    if(!task.trim()){
      $('#new-task input').addClass('is-invalid');
      return false;
    };
    $('#new-task input').removeClass('is-invalid');

    const id = todoArr.length > 0
      ? todoArr[todoArr.length - 1].id + 1
      : 0;
    
    buildTask(task).data('id', id).hide(function () {
      $(this).appendTo('#tasks').show('slow');
      $('h1 span').html($('#tasks li').length);
    });     
    
    $('#new-task input').val('').focus();
    
    // ------------ Save to Local Storage --------------
    todoArr.push({
      id,
      task,
      done: false,
    });
    localStorage.setItem('jqueryTodos', JSON.stringify(todoArr));
  });

  $('#new-task input').on('keydown', function(e) {
    if(e.which === 13) {
      $('#new-task button').click();
    }
  });  
});

// ----------- Build Checkbox + Task + Button ------------
function buildTask(arg_task) {
  const checkbox = $('<input>', {
    type: 'checkbox'
  }).click(function () {
    const id = $(this).parent().data('id');

    if($(this).is(':checked')) {
      $(this).parent().fadeOut(function () {
        $(this)
          .prependTo('#done')
          .fadeIn()
          .addClass('text-decoration-line-through');

        $('h1 span').html($('#tasks li').length);
      });

      todoArr.forEach(todo => {
        if (todo.id == id) {
          todo.done = true;
        }
      });
    } else {
      $(this).parent().fadeOut(function () {
        $(this)
          .appendTo('#tasks')
          .fadeIn()
          .removeClass('text-decoration-line-through');

        $('h1 span').html($('#tasks li').length);
      });

      todoArr.forEach(todo => {
        if (todo.id == id) {
          todo.done = false;
        }
      });
    }

    localStorage.setItem('jqueryTodos', JSON.stringify(todoArr));
  });

  const task = $('<span>')
    .html(arg_task)
    .addClass('ms-2 fs-5');

  const trashIcon = '<i class="fa-solid fa-trash-can"></i>';

  const deleteButton = $('<button>')
    .html(trashIcon)
    .addClass('btn btn-sm btn-danger ms-auto')
    .click(function() {
      // ------------ Update in Local Storage ---------------
      const id = $(this).parent().data('id');
      todoArr = todoArr.filter(todo => todo.id != id);

      localStorage.setItem('jqueryTodos', JSON.stringify(todoArr));

      // -------------- Remove list ------------------
      $(this).parent().fadeOut(function () {
        $(this).remove();
        $('h1 span').html($('#tasks li').length);
      });
    });

  return $('<li>')
    .append(checkbox)
    .append(task)
    .append(deleteButton)
    .addClass('mb-2 d-flex align-items-baseline');
}