// Application State
const AppState = {
    isAuthenticated: false,
    currentUser: null,
    currentPage: 'dashboard',
    tasks: [],
    theme: 'light'
};

// Theme Management
class ThemeManager {
    constructor() {
        this.init();
    }

    init() {
        // Check for saved theme preference or default to 'light'
        const savedTheme = localStorage.getItem('neospark-theme');
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        
        AppState.theme = savedTheme || systemTheme;
        this.applyTheme(AppState.theme);
        this.updateToggleStates();
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        AppState.theme = theme;
        localStorage.setItem('neospark-theme', theme);
    }

    toggleTheme() {
        const newTheme = AppState.theme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        this.updateToggleStates();
    }

    updateToggleStates() {
        // Update fixed theme toggle (lower left)
        const fixedToggle = document.getElementById('theme-toggle');
        const fixedSunIcon = document.getElementById('fixed-sun-icon');
        const fixedMoonIcon = document.getElementById('fixed-moon-icon');
        
        if (fixedToggle) {
            if (AppState.theme === 'dark') {
                fixedToggle.classList.add('active');
                fixedSunIcon.classList.remove('active');
                fixedMoonIcon.classList.add('active');
            } else {
                fixedToggle.classList.remove('active');
                fixedSunIcon.classList.add('active');
                fixedMoonIcon.classList.remove('active');
            }
        }

        // Update settings page toggle
        const settingsToggle = document.getElementById('settings-theme-toggle');
        const settingsSunIcon = document.getElementById('settings-sun-icon');
        const settingsMoonIcon = document.getElementById('settings-moon-icon');
        
        if (settingsToggle) {
            if (AppState.theme === 'dark') {
                settingsToggle.classList.add('active');
                settingsSunIcon.classList.remove('active');
                settingsMoonIcon.classList.add('active');
            } else {
                settingsToggle.classList.remove('active');
                settingsSunIcon.classList.add('active');
                settingsMoonIcon.classList.remove('active');
            }
        }
    }

    showFixedToggle() {
        const fixedToggle = document.getElementById('fixed-theme-toggle');
        if (fixedToggle) {
            fixedToggle.classList.remove('hidden');
        }
    }

    hideFixedToggle() {
        const fixedToggle = document.getElementById('fixed-theme-toggle');
        if (fixedToggle) {
            fixedToggle.classList.add('hidden');
        }
    }
}

// Navigation Management
class NavigationManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Navigation toggle
        const navToggle = document.getElementById('nav-toggle');
        const navClose = document.getElementById('nav-close');
        const sideNav = document.getElementById('side-nav');

        navToggle?.addEventListener('click', () => {
            sideNav.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        navClose?.addEventListener('click', () => {
            sideNav.classList.remove('active');
            navToggle.classList.remove('active');
        });

        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                if (page) {
                    this.navigateToPage(page);
                }
            });
        });

        // Quick action buttons
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const page = btn.getAttribute('data-page');
                if (page) {
                    this.navigateToPage(page);
                }
            });
        });

        // FAB button
        const fab = document.getElementById('fab');
        fab?.addEventListener('click', (e) => {
            e.preventDefault();
            const page = fab.getAttribute('data-page');
            if (page) {
                this.navigateToPage(page);
            }
        });

        // Close mobile nav when clicking outside
        document.addEventListener('click', (e) => {
            if (!sideNav.contains(e.target) && !navToggle.contains(e.target)) {
                sideNav.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }

    navigateToPage(pageName) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Show target page
        const targetPage = document.getElementById(`${pageName}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Update navigation state
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`[data-page="${pageName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Update app state
        AppState.currentPage = pageName;

        // Close mobile navigation
        const sideNav = document.getElementById('side-nav');
        const navToggle = document.getElementById('nav-toggle');
        sideNav.classList.remove('active');
        navToggle.classList.remove('active');

        // Show/hide FAB based on current page
        const fab = document.getElementById('fab');
        if (pageName === 'submit-task') {
            fab.classList.add('hidden');
        } else {
            fab.classList.remove('hidden');
        }
    }
}

// Task Management
class TaskManager {
    constructor() {
        this.init();
    }

    init() {
        this.loadTasks();
        this.bindEvents();
        this.renderTasks();
    }

    bindEvents() {
        // Task form submission
        const taskForm = document.getElementById('task-form');
        taskForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitTask();
        });

        // Task filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.filterTasks(btn.getAttribute('data-filter'));
                
                // Update active filter
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Set deadline input to today's date by default
        const deadlineInput = document.getElementById('task-deadline');
        if (deadlineInput) {
            // Set today's date as default
            const today = new Date();
            const todayString = today.toISOString().split('T')[0];
            deadlineInput.value = todayString;
            deadlineInput.min = todayString;
        }
    }

    submitTask() {
        const title = document.getElementById('task-title').value;
        const description = document.getElementById('task-description').value;
        const priority = document.getElementById('task-priority').value;
        const deadline = document.getElementById('task-deadline').value;
        const resource = document.getElementById('task-resource').value;

        if (!title || !description || !deadline) {
            alert('Please fill in all required fields');
            return;
        }

        const task = {
            id: Date.now().toString(),
            title,
            description,
            priority,
            deadline,
            resource,
            createdAt: new Date().toISOString(),
            status: 'pending'
        };

        AppState.tasks.push(task);
        this.saveTasks();
        this.renderTasks();

        // Reset form
        document.getElementById('task-form').reset();
        
        // Reset deadline to today
        const deadlineInput = document.getElementById('task-deadline');
        if (deadlineInput) {
            const today = new Date().toISOString().split('T')[0];
            deadlineInput.value = today;
        }
        
        // Navigate to My Tasks
        navigationManager.navigateToPage('my-tasks');
        
        // Show success message
        this.showNotification('Task submitted successfully!', 'success');
    }

    loadTasks() {
        const savedTasks = localStorage.getItem('neospark-tasks');
        if (savedTasks) {
            AppState.tasks = JSON.parse(savedTasks);
        }
    }

    saveTasks() {
        localStorage.setItem('neospark-tasks', JSON.stringify(AppState.tasks));
    }

    renderTasks(filter = 'all') {
        const container = document.getElementById('tasks-container');
        if (!container) return;

        let filteredTasks = AppState.tasks;
        
        if (filter !== 'all') {
            filteredTasks = AppState.tasks.filter(task => task.priority === filter);
        }

        // Sort by priority (high -> medium -> low) then by deadline
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        filteredTasks.sort((a, b) => {
            if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            }
            return new Date(a.deadline) - new Date(b.deadline);
        });

        if (filteredTasks.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>No tasks found</h3>
                    <p>Submit your first task to get started!</p>
                    <button class="btn btn--primary" onclick="navigationManager.navigateToPage('submit-task')">
                        Submit Task
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredTasks.map(task => `
            <div class="task-card" data-priority="${task.priority}">
                <div class="task-header">
                    <div>
                        <h3 class="task-title">${task.title}</h3>
                        <span class="task-priority ${task.priority}">${task.priority}</span>
                    </div>
                </div>
                <p class="task-description">${task.description}</p>
                <div class="task-meta">
                    <span class="task-deadline">Due: ${this.formatDate(task.deadline)}</span>
                    <span class="task-resource">${task.resource}</span>
                </div>
            </div>
        `).join('');
    }

    filterTasks(filter) {
        this.renderTasks(filter);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: var(--royal-plum);
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Authentication Management
class AuthManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Auth tab switching
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchAuthTab(tab.getAttribute('data-tab'));
            });
        });

        // Login form
        const loginForm = document.getElementById('login-form');
        loginForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Register form
        const registerForm = document.getElementById('register-form');
        registerForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });

        // Logout
        const logoutBtn = document.getElementById('logout-btn');
        logoutBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleLogout();
        });
    }

    switchAuthTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update forms
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.add('hidden');
        });
        document.getElementById(`${tabName}-form`).classList.remove('hidden');
    }

    handleLogin() {
        // Simple auth simulation
        AppState.isAuthenticated = true;
        AppState.currentUser = {
            name: 'John Doe',
            email: 'john.doe@example.com'
        };
        
        this.showMainApp();
    }

    handleRegister() {
        // Simple auth simulation
        AppState.isAuthenticated = true;
        AppState.currentUser = {
            name: 'John Doe',
            email: 'john.doe@example.com'
        };
        
        this.showMainApp();
    }

    handleLogout() {
        AppState.isAuthenticated = false;
        AppState.currentUser = null;
        
        // Hide main app and show auth
        document.getElementById('main-app').classList.add('hidden');
        document.getElementById('auth-screen').classList.remove('hidden');
        
        // Hide FAB and theme toggle
        document.getElementById('fab').classList.add('hidden');
        themeManager.hideFixedToggle();
    }

    showMainApp() {
        // Hide auth screen
        document.getElementById('auth-screen').classList.add('hidden');
        
        // Show main app
        document.getElementById('main-app').classList.remove('hidden');
        
        // Show FAB and theme toggle
        document.getElementById('fab').classList.remove('hidden');
        themeManager.showFixedToggle();
        
        // Navigate to dashboard
        navigationManager.navigateToPage('dashboard');
    }
}

// Notification Management
class NotificationManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Notification filters
        document.querySelectorAll('#notifications-page .filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.filterNotifications(btn.getAttribute('data-filter'));
                
                // Update active filter
                document.querySelectorAll('#notifications-page .filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    filterNotifications(filter) {
        const notifications = document.querySelectorAll('.notification-item');
        
        notifications.forEach(notification => {
            if (filter === 'all') {
                notification.style.display = 'flex';
            } else {
                // Simple filter logic - in a real app, you'd have data attributes
                const content = notification.textContent.toLowerCase();
                const shouldShow = content.includes(filter.toLowerCase());
                notification.style.display = shouldShow ? 'flex' : 'none';
            }
        });
    }
}

// Application Initialization
class NeoSparkApp {
    constructor() {
        this.init();
    }

    init() {
        // Initialize managers
        this.themeManager = new ThemeManager();
        this.navigationManager = new NavigationManager();
        this.taskManager = new TaskManager();
        this.authManager = new AuthManager();
        this.notificationManager = new NotificationManager();

        // Handle splash screen
        this.handleSplashScreen();
        
        // Bind global events
        this.bindGlobalEvents();
        
        // Add sample tasks for demonstration
        this.addSampleTasks();
    }

    handleSplashScreen() {
        setTimeout(() => {
            document.getElementById('splash-screen').classList.add('hidden');
            document.getElementById('auth-screen').classList.remove('hidden');
        }, 3500);
    }

    bindGlobalEvents() {
        // Fixed theme toggle (lower left)
        const fixedThemeToggle = document.getElementById('theme-toggle');
        fixedThemeToggle?.addEventListener('click', () => {
            this.themeManager.toggleTheme();
        });

        // Settings page theme toggle
        const settingsThemeToggle = document.getElementById('settings-theme-toggle');
        settingsThemeToggle?.addEventListener('click', () => {
            this.themeManager.toggleTheme();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close mobile nav
                const sideNav = document.getElementById('side-nav');
                const navToggle = document.getElementById('nav-toggle');
                sideNav.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                const sideNav = document.getElementById('side-nav');
                const navToggle = document.getElementById('nav-toggle');
                sideNav.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }

    addSampleTasks() {
        // Add sample tasks if none exist
        if (AppState.tasks.length === 0) {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const nextWeek = new Date(today);
            nextWeek.setDate(nextWeek.getDate() + 7);

            const sampleTasks = [
                {
                    id: 'sample-1',
                    title: 'Website Redesign',
                    description: 'Complete the redesign of the company website with modern UI/UX principles',
                    priority: 'high',
                    deadline: tomorrow.toISOString().split('T')[0],
                    resource: 'Any',
                    createdAt: new Date().toISOString(),
                    status: 'pending'
                },
                {
                    id: 'sample-2',
                    title: 'Logo Design',
                    description: 'Create a new logo for the client presentation',
                    priority: 'medium',
                    deadline: nextWeek.toISOString().split('T')[0],
                    resource: 'Human',
                    createdAt: new Date().toISOString(),
                    status: 'pending'
                },
                {
                    id: 'sample-3',
                    title: 'Market Research',
                    description: 'Conduct market research for the new product launch',
                    priority: 'low',
                    deadline: nextWeek.toISOString().split('T')[0],
                    resource: 'AI',
                    createdAt: new Date().toISOString(),
                    status: 'pending'
                }
            ];

            AppState.tasks = sampleTasks;
            this.taskManager.saveTasks();
        }
    }
}

// Global instances
let themeManager;
let navigationManager;
let taskManager;
let authManager;
let notificationManager;

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new NeoSparkApp();
    
    // Make managers globally accessible
    themeManager = app.themeManager;
    navigationManager = app.navigationManager;
    taskManager = app.taskManager;
    authManager = app.authManager;
    notificationManager = app.notificationManager;
});

// CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .empty-state {
        text-align: center;
        padding: 3rem;
        color: var(--text-secondary);
    }
    
    .empty-state h3 {
        color: var(--text-primary);
        margin-bottom: 1rem;
    }
    
    .empty-state p {
        margin-bottom: 1.5rem;
    }
`;
document.head.appendChild(style);