let model = []; 
    let nextId = 1;


    function render_tasks(model) {
      const mytask = document.getElementById("mytask");
      mytask.innerHTML = "";
      let li_elements = [];

      for (let id = 0; id < model.length; id++) {
        const task = model[id];
        const li = document.createElement("li");
        li.textContent = `${task["task-name"]} (${task["task-priority"]}) - ${task["status"]}`;

        // If completed, change to "completed"
        if (task["status"] === "completed") {
          li.classList.add("completed");
        }

        // Click to toggle completion
        li.addEventListener("click", () => {
          for (let idx = 0; idx < model.length; idx++) {
            if (model[idx]["task-id"] === task["task-id"]) {
              model[idx]["status"] = 
                model[idx]["status"] === "pending" ? "completed" : "pending";
            }
          }
          render_tasks(model);
        });

        li_elements.push(li);
      }

      // Append all li elements
      li_elements.forEach(li => mytask.append(li));
    }

    
    function addTask() {
      const task_name = document.getElementById("taskInput").value.trim();
      const priority = document.getElementById("priorityInput").value;

      if (task_name === "") {
        alert("Please enter a task name.");
        return;
      }

      
      for (let id = nextId; id < nextId + 1; id++) {
        let new_task = {
          "task-id": id,
          "task-name": task_name,
          "task-priority": priority,
          "status": "pending"
        };
        model.push(new_task);
      }

      nextId++; 
      document.getElementById("taskInput").value = ""; 

      render_tasks(model); 
    }
