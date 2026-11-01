const BASE_URL = "http://localhost:5000";

// ==============================
// AUTHENTICATION HELPER
// ==============================

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
};

// ==============================
// REGISTER
// ==============================

export const registerUser = async (email, password) => {
    const response = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Registration failed");
    }

    return data;
};

// ==============================
// LOGIN
// ==============================

export const loginUser = async (email, password) => {
    const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Login failed");
    }

    // Save JWT token
    localStorage.setItem("token", data.token);

    return data;
};

// ==============================
// LOGOUT
// ==============================

export const logoutUser = () => {
    localStorage.removeItem("token");
};

// ==============================
// GET CURRENT USER
// ==============================

export const getCurrentUser = async () => {
    const response = await fetch(`${BASE_URL}/me`, {
        headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (response.status === 401) {
        localStorage.removeItem("token");
        throw new Error("Session expired. Please login again.");
    }

    if (!response.ok) {
        throw new Error(data.message || "Failed to get user");
    }

    return data;
};

// ==============================
// GET ALL TASKS
// ==============================

export const getTasks = async () => {
    const response = await fetch(`${BASE_URL}/tasks`, {
        headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (response.status === 401) {
        localStorage.removeItem("token");
        throw new Error("Session expired. Please login again.");
    }

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch tasks");
    }

    return data;
};

// ==============================
// CREATE TASK
// ==============================

export const createTask = async (task) => {
    const response = await fetch(`${BASE_URL}/tasks`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(task),
    });

    const data = await response.json();

    if (response.status === 401) {
        localStorage.removeItem("token");
        throw new Error("Session expired. Please login again.");
    }

    if (!response.ok) {
        throw new Error(data.message || "Failed to create task");
    }

    return data;
};

// ==============================
// UPDATE TASK
// ==============================

export const updateTask = async (id, task) => {
    const response = await fetch(`${BASE_URL}/tasks/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(task),
    });

    const data = await response.json();

    if (response.status === 401) {
        localStorage.removeItem("token");
        throw new Error("Session expired. Please login again.");
    }

    if (!response.ok) {
        throw new Error(data.message || "Failed to update task");
    }

    return data;
};

// ==============================
// DELETE TASK
// ==============================

export const deleteTask = async (id) => {
    const response = await fetch(`${BASE_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (response.status === 401) {
        localStorage.removeItem("token");
        throw new Error("Session expired. Please login again.");
    }

    if (!response.ok) {
        throw new Error(data.message || "Failed to delete task");
    }

    return data;
};


// ==============================
// AI GENERATE DESCRIPTION - PRACTICAL 13
// ==============================

export const generateTaskDescription = async (title) => {
    const response = await fetch(`${BASE_URL}/api/ai/generate-description`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ title }),
    });

    const data = await response.json();

    if (response.status === 401) {
        localStorage.removeItem("token");
        throw new Error("Session expired. Please login again.");
    }

    if (response.status === 429) {
        throw new Error(data.message || "Rate limit reached. Please wait a moment.");
    }

    if (!response.ok) {
        throw new Error(data.message || "Failed to generate AI description");
    }

    return data;
};
