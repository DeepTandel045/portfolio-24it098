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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                        <label style={{ margin: 0, fontWeight: 'bold' }}>Title</label>
                        <button
                            type="button"
                            className="ai-btn"
                            onClick={handleGenerateAI}
                            disabled={aiLoading || !title.trim()}
                            title={title.trim() ? "Click to generate description using AI" : "Enter a title first"}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: aiLoading || !title.trim() ? '#94a3b8' : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '8px 16px',
                                fontSize: '0.88rem',
                                fontWeight: '600',
                                cursor: aiLoading || !title.trim() ? 'not-allowed' : 'pointer',
                                boxShadow: aiLoading || !title.trim() ? 'none' : '0 4px 12px rgba(124, 58, 237, 0.35)',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            {aiLoading ? "⏳ Generating..." : description ? "✨ Re-Generate (AI)" : "✨ Auto-Generate (AI)"}
                        </button>
                    </div>

                    <input
                        type="text"
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                            setAiNotice("");
                            setIsAiFallback(false);
                        }}
                        placeholder="Enter task title (e.g. Study React, Fix bug, Buy groceries, Deploy app)"
                    />

                    {/* AI Prompt Pop-up Helper: Always appears whenever title has >= 2 characters */}
                    {title.trim().length >= 2 && (
                        <div
                            style={{
                                marginTop: '6px',
                                padding: '8px 12px',
                                background: 'linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%)',
                                border: '1px solid #bae6fd',
                                borderRadius: '6px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                fontSize: '0.85rem',
                                color: '#0369a1',
                            }}
                        >
                            <span>💡 <strong>AI Assistant:</strong> Ready to craft description & priority for <em>"{title.trim().length > 25 ? title.trim().slice(0, 25) + '...' : title.trim()}"</em></span>
                            <button
                                type="button"
                                onClick={handleGenerateAI}
                                disabled={aiLoading}
                                style={{
                                    background: '#0284c7',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    padding: '5px 12px',
                                    fontSize: '0.8rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    marginLeft: '8px',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {description ? "Re-Generate" : "Generate Description"}
                            </button>
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label style={{ fontWeight: 'bold' }}>Description (AI Editable)</label>

                    <input
                        type="text"
                        value={description}
                        onChange={(e) => {
                            setDescription(e.target.value);
                        }}
                        placeholder="Enter task description or use Auto-Generate (AI)"
                    />

                    {/* AI Generated Status Notice & Responsible AI Disclaimer (Dismissible) */}
                    {aiNotice && (
                        <div
                            style={{
                                marginTop: '8px',
                                padding: '10px 14px',
                                borderRadius: '8px',
                                fontSize: '0.85rem',
                                lineHeight: '1.45',
                                backgroundColor: isAiFallback ? '#fffbeb' : '#f5f3ff',
                                color: isAiFallback ? '#92400e' : '#5b21b6',
                                border: isAiFallback ? '1px solid #fcd34d' : '1px solid #c4b5fd',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                position: 'relative',
                            }}
                        >
                            <button
                                type="button"
                                onClick={() => setAiNotice("")}
                                title="Dismiss notice"
                                style={{
                                    position: 'absolute',
                                    top: '6px',
                                    right: '8px',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    color: 'inherit',
                                    opacity: 0.7,
                                }}
                            >
                                ✕
                            </button>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', paddingRight: '20px' }}>
                                <span>{isAiFallback ? "⚠️ Notice:" : "✨ AI Suggestion Applied:"}</span>
                                <span>{aiNotice}</span>
                            </div>
                            <div style={{ marginTop: '4px', fontSize: '0.8rem', opacity: 0.9 }}>
                                <strong>Responsible AI Disclaimer:</strong> Content was generated by AI. You can freely edit or refine this description before saving to ensure accuracy.
                            </div>
                        </div>
                    )}
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