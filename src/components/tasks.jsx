import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    generateTaskDescription,
} from "../api";

function Tasks() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    // -----------------------------
    // State
    // -----------------------------
    const [tasks, setTasks] = useState([]);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("medium");

    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [error, setError] = useState("");
    const [toast, setToast] = useState("");

    // Practical 13 - AI State
    const [aiLoading, setAiLoading] = useState(false);
    const [aiNotice, setAiNotice] = useState("");
    const [isAiFallback, setIsAiFallback] = useState(false);

    // -----------------------------
    // GET - Load Tasks
    // -----------------------------
    useEffect(() => {
        const loadTasks = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getTasks();

                setTasks(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadTasks();
    }, []);

    // -----------------------------
    // Toast
    // -----------------------------
    const showToast = (message) => {
        setToast(message);

        setTimeout(() => {
            setToast("");
        }, 3000);
    };

    // -----------------------------
    // POST - Create Task
    // -----------------------------
    const handleCreateTask = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            setError("Task title is required");
            return;
        }

        try {
            setCreating(true);
            setError("");

            const newTask = await createTask({
                title: title.trim(),
                description,
                priority,
            });

            setTasks((currentTasks) => [
                ...currentTasks,
                newTask,
            ]);

            setTitle("");
            setDescription("");
            setPriority("medium");

            showToast("Task created successfully");
        } catch (err) {
            setError(err.message);
        } finally {
            setCreating(false);
        }
    };

    // -----------------------------
    // Start Editing
    // -----------------------------
    const handleEdit = (task) => {
        setEditingId(task._id);

        setTitle(task.title);
        setDescription(task.description || "");
        setPriority(task.priority || "medium");

        setError("");
    };

    // -----------------------------
    // PUT - Update Task
    // -----------------------------
    const handleUpdateTask = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            setError("Task title is required");
            return;
        }

        try {
            setUpdating(true);
            setError("");

            const updatedTask = await updateTask(editingId, {
                title: title.trim(),
                description,
                priority,
            });

            setTasks((currentTasks) =>
                currentTasks.map((task) =>
                    task._id === editingId
                        ? updatedTask
                        : task
                )
            );

            setEditingId(null);

            setTitle("");
            setDescription("");
            setPriority("medium");

            showToast("Task updated successfully");
        } catch (err) {
            setError(err.message);
        } finally {
            setUpdating(false);
        }
    };


    const handleToggleComplete = async (task) => {
    try {
        setUpdating(true);
        setError("");

        const updatedTask = await updateTask(task._id, {
            title: task.title,
            description: task.description,
            priority: task.priority,
            completed: !task.completed,
        });

        setTasks((currentTasks) =>
            currentTasks.map((currentTask) =>
                currentTask._id === task._id
                    ? updatedTask
                    : currentTask
            )
        );

        showToast(
            updatedTask.completed
                ? "Task marked as completed"
                : "Task marked as pending"
        );
    } catch (err) {
        setError(err.message);
    } finally {
        setUpdating(false);
    }
};

    // -----------------------------
    // DELETE - Delete Task
    // -----------------------------
    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this task?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleting(true);
            setError("");

            await deleteTask(id);

            setTasks((currentTasks) =>
                currentTasks.filter(
                    (task) => task._id !== id
                )
            );

            showToast("Task deleted successfully");
        } catch (err) {
            setError(err.message);
        } finally {
            setDeleting(false);
        }
    };

        // -----------------------------
    // AI Generate Description - Practical 13
    // -----------------------------
    const handleGenerateAI = async () => {
        if (!title.trim()) {
            setError("Please enter a task title first so AI can generate a relevant description.");
            return;
        }

        try {
            setAiLoading(true);
            setError("");
            setAiNotice("");

            const data = await generateTaskDescription(title.trim());

            if (data && data.description) {
                setDescription(data.description);
                if (data.suggestedPriority) {
                    setPriority(data.suggestedPriority);
                }
                setIsAiFallback(Boolean(data.fallback));
                setAiNotice(
                    data.fallback
                        ? "Fallback suggestion applied (AI API offline or key unconfigured)."
                        : "AI description generated successfully!"
                );
                showToast("AI suggestion applied to task form!");
            }
        } catch (err) {
            setError(`AI Service Notice: ${err.message}`);
        } finally {
            setAiLoading(false);
        }
    };

    // -----------------------------
    // Cancel Edit
    // -----------------------------
    const handleCancelEdit = () => {
        setEditingId(null);

        setTitle("");
        setDescription("");
        setPriority("medium");

        setError("");
    };

    // -----------------------------
    // Loading
    // -----------------------------
    if (loading) {
        return <h2>Loading tasks...</h2>;
    }

    // -----------------------------
    // UI
    // -----------------------------
    return (
        <section className="tasks-page">

            <div className="tasks-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ margin: 0 }}>Task Manager</h1>
                    <p style={{ margin: '0.25rem 0 0 0' }}>
                        Manage your tasks using the React, Express and MongoDB backend.
                    </p>
                </div>
                <button
                    className="secondary-button logout-btn"
                    type="button"
                    onClick={handleLogout}
                    style={{ padding: '8px 16px', cursor: 'pointer' }}
                >
                    Logout
                </button>
            </div>

            {/* Toast Notification */}
            {toast && (
                <div className="toast">
                    ✓ {toast}
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="task-error">
                    ✕ {error}
                </div>
            )}

            {/* Create / Update Form */}
            <form
                className="task-form"
                onSubmit={
                    editingId
                        ? handleUpdateTask
                        : handleCreateTask
                }
            >

                <div className="form-group">
                    <label>Title</label>

                    <input
                        type="text"
                        value={title}
                        onChange={(e) =>
                            setTitle(e.target.value)
                        }
                        placeholder="Enter task title"
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>

                    <input
                        type="text"
                        value={description}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                        placeholder="Enter task description"
                    />
                </div>

                <div className="form-group">
                    <label>Priority</label>

                    <select
                        value={priority}
                        onChange={(e) =>
                            setPriority(e.target.value)
                        }
                    >
                        <option value="low">
                            Low
                        </option>

                        <option value="medium">
                            Medium
                        </option>

                        <option value="high">
                            High
                        </option>
                    </select>
                </div>

                <div className="form-buttons">

                    <button
                        type="submit"
                        disabled={
                            creating || updating
                        }
                    >
                        {editingId
                            ? updating
                                ? "Updating..."
                                : "Update Task"
                            : creating
                                ? "Creating..."
                                : "Add Task"}
                    </button>

                    {editingId && (
                        <button
                            type="button"
                            onClick={handleCancelEdit}
                        >
                            Cancel
                        </button>
                    )}

                </div>
            </form>

            {/* Task List */}
            <div className="task-list">

                <h2>Your Tasks</h2>

                {tasks.length === 0 ? (
                    <p>No tasks available.</p>
                ) : (
                    tasks.map((task) => (

                        <div
                            className="task-card"
                            key={task._id}
                        >

                            <div>
                                <h3>
                                    {task.title}
                                </h3>

                                <p>
                                    {task.description}
                                </p>

                                <p>
                                    Priority:{" "}
                                    <strong>
                                        {task.priority}
                                    </strong>
                                </p>

                                <p>
    Status:{" "}
    <strong>
        {task.completed ? "Completed" : "Pending"}
    </strong>
</p>

<button
    type="button"
    onClick={() =>
        handleToggleComplete(task)
    }
    disabled={updating}
>
    {task.completed
        ? "Mark Pending"
        : "Mark Complete"}
</button>
                            </div>
<div className="task-actions">

    <button
        type="button"
        onClick={() => handleToggleComplete(task)}
        disabled={updating}
    >
        {task.completed
            ? "Mark Pending"
            : "Mark Complete"}
    </button>

    <button
        type="button"
        onClick={() => handleEdit(task)}
    >
        Edit
    </button>

    <button
        type="button"
        onClick={() => handleDelete(task._id)}
        disabled={deleting}
    >
        {deleting ? "Deleting..." : "Delete"}
    </button>

</div>

                        </div>
                    ))
                )}

            </div>

        </section>
    );
}

export default Tasks;