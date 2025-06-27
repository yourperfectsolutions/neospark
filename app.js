// NeoSpark Genie Application JavaScript
class NeoSparkApp {
    constructor() {
        this.currentTheme = 'light';
        this.currentPage = 'home';
        this.isAuthenticated = false;
        this.sideNavOpen = false;
        
        // Application data from provided JSON
        this.appData = {
            users: [
                {"id": 1, "name": "John Smith", "role": "Project Manager", "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", "email": "john.smith@yps.com", "company": "Your Perfect Solutions", "skills": ["Project Management", "Strategy", "Leadership"]},
                {"id": 2, "name": "Sarah Johnson", "role": "Designer", "avatar": "https://images.unsplash.com/photo-1494790108755-2616b67d4fa7?w=40&h=40&fit=crop&crop=face", "email": "sarah.johnson@yps.com", "skills": ["UI/UX", "Graphics", "Branding"], "workload": 75},
                {"id": 3, "name": "Mike Chen", "role": "Developer", "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face", "email": "mike.chen@yps.com", "skills": ["Web Development", "Backend", "API Integration"], "workload": 60},
                {"id": 4, "name": "Lisa Wang", "role": "Content Specialist", "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face", "email": "lisa.wang@yps.com", "skills": ["Copywriting", "Content Strategy", "SEO"], "workload": 45}
            ],
            tasks: [
                {"id": 1, "title": "Website Redesign Project", "status": "In Progress", "priority": "High", "assignee": "Sarah Johnson", "dueDate": "2025-07-15", "description": "Complete redesign of client website with new branding", "progress": 65},
                {"id": 2, "title": "API Integration", "status": "Pending", "priority": "Medium", "assignee": "Mike Chen", "dueDate": "2025-07-10", "description": "Integrate third-party payment gateway", "progress": 0},
                {"id": 3, "title": "Content Audit", "status": "Completed", "priority": "Low", "assignee": "Lisa Wang", "dueDate": "2025-06-25", "description": "Review and update all website content", "progress": 100},
                {"id": 4, "title": "Mobile App Prototype", "status": "In Progress", "priority": "High", "assignee": "Sarah Johnson", "dueDate": "2025-07-20", "description": "Create interactive prototype for mobile application", "progress": 40}
            ],
            metrics: {
                "pendingTasks": 8,
                "completedThisWeek": 12,
                "avgTurnaround": 24,
                "clientSatisfaction": 4.8
            },
            notifications: [
                {"id": 1, "type": "task", "title": "New task assigned", "message": "Website Redesign Project has been assigned to you", "timestamp": "2 hours ago", "read": false},
                {"id": 2, "type": "mention", "title": "You were mentioned", "message": "Sarah mentioned you in API Integration discussion", "timestamp": "4 hours ago", "read": false},
                {"id": 3, "type": "system", "title": "System update", "message": "NeoSpark has been updated to version 2.1", "timestamp": "1 day ago", "read": true}
            ],
            recentActivity: [
                {"id": 1, "title": "Website Redesign Project", "action": "updated", "user": "Sarah Johnson", "timestamp": "2 hours ago", "status": "In Progress"},
                {"id": 2, "title": "API Integration", "action": "assigned", "user": "Mike Chen", "timestamp": "3 hours ago", "status": "Pending"},
                {"id": 3, "title": "Content Audit", "action": "completed", "user": "Lisa Wang", "timestamp": "5 hours ago", "status": "Completed"}
            ]
        };
        
        this.init();
    }
    
    init() {
        // Ensure DOM is ready before initializing
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupEventListeners();
                this.showSplashScreen();
            });
        } else {
            this.setupEventListeners();
            this.showSplashScreen();
        }
    }
    
    setupEventListeners() {
        // Authentication forms
        const loginForm = document.querySelector('#login-screen .auth-form');
        const signupForm = document.querySelector('#signup-screen .auth-form');
        const showSignupBtn = document.getElementById('show-signup');
        const showLoginBtn = document.getElementById('show-login');
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        }
        
        if (showSignupBtn) {
            showSignupBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSignup();
            });
        }
        
        if (showLoginBtn) {
            showLoginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showLogin();
            });
        }
        
        // Navigation elements
        const hamburgerBtn = document.getElementById('hamburger-btn');
        const sideNav = document.getElementById('side-nav');
        const navLinks = document.querySelectorAll('.nav-link[data-page]');
        const actionCards = document.querySelectorAll('.action-card[data-page]');
        const fab = document.querySelector('.fab[data-page]');
        const logoutBtn = document.getElementById('logout-btn');
        
        if (hamburgerBtn) {
            hamburgerBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleSideNav();
            });
        }
        
        // Close side nav when clicking outside
        document.addEventListener('click', (e) => {
            if (this.sideNavOpen && sideNav && !sideNav.contains(e.target) && hamburgerBtn && !hamburgerBtn.contains(e.target)) {
                this.closeSideNav();
            }
        });
        
        // Navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.navigateToPage(page);
                this.closeSideNav();
            });
        });
        
        // Action cards
        actionCards.forEach(card => {
            card.addEventListener('click', () => {
                const page = card.getAttribute('data-page');
                this.navigateToPage(page);
            });
        });
        
        // Floating Action Button
        if (fab) {
            fab.addEventListener('click', () => {
                const page = fab.getAttribute('data-page');
                this.navigateToPage(page);
            });
        }
        
        // Logout functionality
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }
        
        // Theme toggle buttons
        const themeBtns = document.querySelectorAll('.theme-btn');
        themeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const theme = btn.getAttribute('data-theme');
                this.setTheme(theme);
            });
        });
        
        // Notification tabs
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleNotificationTab(btn);
            });
        });
        
        // Form submissions - Fixed to handle properly
        const taskForm = document.querySelector('.task-form');
        if (taskForm) {
            taskForm.addEventListener('submit', (e) => this.handleTaskSubmission(e));
        }
        
        // Quick assign buttons
        const quickAssignBtns = document.querySelectorAll('.team-member-card .btn');
        quickAssignBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleQuickAssign(btn);
            });
        });
        
        // Notification items
        const notificationItems = document.querySelectorAll('.notification-item');
        notificationItems.forEach(item => {
            item.addEventListener('click', () => this.handleNotificationClick(item));
        });
    }
    
    showSplashScreen() {
        const splashScreen = document.getElementById('splash-screen');
        if (splashScreen) {
            // Force display and remove hidden class
            splashScreen.style.display = 'flex';
            splashScreen.classList.remove('hidden');
            
            // Add sparkle effects with random positioning
            this.createSparkleEffects();
            
            // Auto-transition after 2 seconds
            setTimeout(() => {
                this.hideSplashScreen();
            }, 2000);
        }
    }
    
    createSparkleEffects() {
        const splashContent = document.querySelector('.splash-content');
        if (!splashContent) return;
        
        // Create multiple sparkle effects
        const sparklePositions = [
            { top: '20%', left: '15%', delay: '0.3s' },
            { top: '70%', right: '20%', delay: '0.6s' },
            { bottom: '25%', left: '75%', delay: '0.9s' },
            { top: '40%', right: '10%', delay: '1.2s' }
        ];
        
        sparklePositions.forEach((pos, index) => {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle-effect';
            sparkle.style.cssText = `
                position: absolute;
                width: 16px;
                height: 16px;
                background: rgba(255, 255, 255, 0.85);
                border-radius: 50%;
                animation: sparkleFloat 2s ease-in-out infinite;
                animation-delay: ${pos.delay};
                ${pos.top ? `top: ${pos.top};` : ''}
                ${pos.bottom ? `bottom: ${pos.bottom};` : ''}
                ${pos.left ? `left: ${pos.left};` : ''}
                ${pos.right ? `right: ${pos.right};` : ''}
            `;
            splashContent.appendChild(sparkle);
        });
    }
    
    hideSplashScreen() {
        const splashScreen = document.getElementById('splash-screen');
        if (splashScreen) {
            splashScreen.classList.add('fade-out');
            setTimeout(() => {
                splashScreen.style.display = 'none';
                splashScreen.classList.add('hidden');
                this.showAuthScreen();
            }, 500);
        }
    }
    
    showAuthScreen() {
        const loginScreen = document.getElementById('login-screen');
        if (loginScreen) {
            loginScreen.classList.remove('hidden');
        }
    }
    
    showSignup() {
        const loginScreen = document.getElementById('login-screen');
        const signupScreen = document.getElementById('signup-screen');
        
        if (loginScreen) loginScreen.classList.add('hidden');
        if (signupScreen) signupScreen.classList.remove('hidden');
    }
    
    showLogin() {
        const loginScreen = document.getElementById('login-screen');
        const signupScreen = document.getElementById('signup-screen');
        
        if (signupScreen) signupScreen.classList.add('hidden');
        if (loginScreen) loginScreen.classList.remove('hidden');
    }
    
    handleLogin(e) {
        e.preventDefault();
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        if (!submitBtn) return;
        
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.textContent = 'Logging in...';
        submitBtn.disabled = true;
        
        const email = document.getElementById('login-email');
        const password = document.getElementById('login-password');
        
        if (!email || !password) {
            this.showMessage('Form fields not found', 'error');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            return;
        }
        
        setTimeout(() => {
            if (email.value.trim() && password.value.trim()) {
                this.isAuthenticated = true;
                this.showMainApp();
                this.showMessage('Welcome back to NeoSpark Genie!', 'success');
            } else {
                this.showMessage('Please fill in all fields', 'error');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        }, 800);
    }
    
    handleSignup(e) {
        e.preventDefault();
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        if (!submitBtn) return;
        
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.textContent = 'Creating account...';
        submitBtn.disabled = true;
        
        const name = document.getElementById('signup-name');
        const company = document.getElementById('signup-company');
        const role = document.getElementById('signup-role');
        
        if (!name || !company || !role) {
            this.showMessage('Form fields not found', 'error');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            return;
        }
        
        setTimeout(() => {
            if (name.value.trim() && company.value.trim() && role.value.trim()) {
                this.isAuthenticated = true;
                this.showMainApp();
                this.showMessage('Account created successfully! Welcome to NeoSpark Genie!', 'success');
            } else {
                this.showMessage('Please fill in all required fields', 'error');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        }, 800);
    }
    
    showMainApp() {
        const authScreens = document.querySelectorAll('.auth-screen');
        const mainApp = document.getElementById('main-app');
        
        authScreens.forEach(screen => screen.classList.add('hidden'));
        if (mainApp) {
            mainApp.classList.remove('hidden');
            this.navigateToPage('home');
        }
    }
    
    handleLogout() {
        this.isAuthenticated = false;
        const mainApp = document.getElementById('main-app');
        const loginScreen = document.getElementById('login-screen');
        
        if (mainApp) mainApp.classList.add('hidden');
        if (loginScreen) loginScreen.classList.remove('hidden');
        
        // Clear form fields
        const loginEmail = document.getElementById('login-email');
        const loginPassword = document.getElementById('login-password');
        if (loginEmail) loginEmail.value = '';
        if (loginPassword) loginPassword.value = '';
        
        this.closeSideNav();
        this.showMessage('Logged out successfully', 'success');
    }
    
    toggleSideNav() {
        if (this.sideNavOpen) {
            this.closeSideNav();
        } else {
            this.openSideNav();
        }
    }
    
    openSideNav() {
        const sideNav = document.getElementById('side-nav');
        if (sideNav) {
            sideNav.classList.add('open');
            this.sideNavOpen = true;
        }
    }
    
    closeSideNav() {
        const sideNav = document.getElementById('side-nav');
        if (sideNav) {
            sideNav.classList.remove('open');
            this.sideNavOpen = false;
        }
    }
    
    navigateToPage(pageName) {
        // Hide all pages
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => page.classList.remove('active'));
        
        // Show target page
        const targetPage = document.getElementById(`${pageName}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageName;
        }
        
        // Update navigation states
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => link.classList.remove('active'));
        
        const activeNavLink = document.querySelector(`.nav-link[data-page="${pageName}"]`);
        if (activeNavLink) {
            activeNavLink.classList.add('active');
        }
        
        // Load page-specific data if needed
        if (pageName === 'insights') {
            this.loadInsights();
        }
    }
    
    setTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        
        // Update theme buttons
        const themeBtns = document.querySelectorAll('.theme-btn');
        themeBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-theme') === theme) {
                btn.classList.add('active');
            }
        });
        
        this.showMessage(`Switched to ${theme} mode`, 'success');
    }
    
    handleNotificationTab(btn) {
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const tab = btn.getAttribute('data-tab');
        this.filterNotifications(tab);
    }
    
    filterNotifications(tab) {
        const notifications = document.querySelectorAll('.notification-item');
        
        notifications.forEach(notification => {
            const iconElement = notification.querySelector('.notification-icon');
            if (!iconElement) return;
            
            const type = iconElement.textContent.trim();
            let show = false;
            
            switch (tab) {
                case 'all':
                    show = true;
                    break;
                case 'mentions':
                    show = type === '@';
                    break;
                case 'tasks':
                    show = type === '📋';
                    break;
            }
            
            notification.style.display = show ? 'flex' : 'none';
        });
    }
    
    handleTaskSubmission(e) {
        e.preventDefault();
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        if (!submitBtn) {
            this.showMessage('Submit button not found', 'error');
            return;
        }
        
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;
        
        // Get form fields with better error handling
        const titleInput = e.target.querySelector('input[type="text"]');
        const descriptionInput = e.target.querySelector('textarea');
        const prioritySelect = e.target.querySelector('select');
        const resourceRadio = e.target.querySelector('input[name="resource"]:checked');
        
        // Validate fields exist
        if (!titleInput || !descriptionInput || !prioritySelect) {
            this.showMessage('Required form fields not found', 'error');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            return;
        }
        
        const title = titleInput.value.trim();
        const description = descriptionInput.value.trim();
        const priority = prioritySelect.value;
        const resourceType = resourceRadio ? resourceRadio.value : null;
        
        setTimeout(() => {
            // Validate all required fields are filled
            if (!title) {
                this.showMessage('Please enter a task title', 'error');
            } else if (!description) {
                this.showMessage('Please enter a task description', 'error');
            } else if (!priority) {
                this.showMessage('Please select a priority level', 'error');
            } else if (!resourceType) {
                this.showMessage('Please select a resource preference', 'error');
            } else {
                // All validation passed
                this.showMessage('Task submitted successfully! Your AI assistant will handle it.', 'success');
                e.target.reset();
                
                // Navigate back to tasks page after a short delay
                setTimeout(() => {
                    this.navigateToPage('tasks');
                }, 1500);
                return;
            }
            
            // Reset button if validation failed
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 800);
    }
    
    handleQuickAssign(btn) {
        const memberCard = btn.closest('.team-member-card');
        if (!memberCard) return;
        
        const memberNameElement = memberCard.querySelector('h3');
        if (!memberNameElement) return;
        
        const memberName = memberNameElement.textContent;
        
        this.showMessage(`Task assigned to ${memberName}`, 'success');
        
        // Simulate loading state
        const originalText = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Assigning...';
        
        setTimeout(() => {
            btn.disabled = false;
            btn.textContent = 'Assigned ✓';
            btn.style.background = '#FE8630';
            
            // Reset after 3 seconds
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
            }, 3000);
        }, 1000);
    }
    
    handleNotificationClick(item) {
        item.classList.remove('unread');
        const messageElement = item.querySelector('.notification-text');
        if (!messageElement) return;
        
        const message = messageElement.textContent;
        
        // Navigate to relevant page based on notification
        if (message.includes('task') || message.includes('Project')) {
            this.navigateToPage('tasks');
        } else if (message.includes('mentioned')) {
            this.navigateToPage('tasks');
        }
        
        this.closeSideNav();
    }
    
    loadInsights() {
        // Load analytics data - in a real app this would fetch from API
        console.log('Loading insights with metrics:', this.appData.metrics);
        
        // Update analytics cards with real data
        const analyticsCards = document.querySelectorAll('#insights-page .card-number');
        if (analyticsCards.length >= 4) {
            // These would be calculated from real metrics
            const insights = ['+23%', '2.4x', '$12K', '94%'];
            analyticsCards.forEach((card, index) => {
                if (insights[index]) {
                    card.textContent = insights[index];
                }
            });
        }
    }
    
    showMessage(message, type = 'info') {
        // Remove any existing messages
        const existingMessages = document.querySelectorAll('.app-message');
        existingMessages.forEach(msg => msg.remove());
        
        // Create and show new message
        const messageEl = document.createElement('div');
        messageEl.className = `app-message app-message--${type}`;
        messageEl.textContent = message;
        
        const colors = {
            error: '#FF413D',
            success: '#FE8630',
            info: '#491079'
        };
        
        messageEl.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
            max-width: 300px;
        `;
        
        document.body.appendChild(messageEl);
        
        // Remove after 4 seconds
        setTimeout(() => {
            messageEl.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 300);
        }, 4000);
    }
    
    // Utility methods
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
    
    getStatusColor(status) {
        const statusColors = {
            'In Progress': '#FE8630',
            'Completed': '#491079',
            'Pending': '#E31466',
            'On Hold': '#9B9B9B'
        };
        return statusColors[status] || '#9B9B9B';
    }
    
    getPriorityColor(priority) {
        const priorityColors = {
            'High': '#FF413D',
            'Medium': '#FE8630',
            'Low': '#FFCB13',
            'Urgent': '#E31466'
        };
        return priorityColors[priority] || '#9B9B9B';
    }
}

// Enhanced animations and interactive styles
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    /* Interactive enhancements */
    .action-card:hover {
        transform: translateY(-6px) scale(1.02);
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
    }
    
    .overview-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }
    
    .task-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
    }
    
    .team-member-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
        transition: all 0.3s ease;
    }
    
    .notification-item:hover {
        transform: translateX(6px);
        background: rgba(73, 16, 121, 0.05);
        transition: all 0.2s ease;
    }
    
    .nav-link:hover {
        transform: translateX(4px);
        transition: all 0.2s ease;
    }
    
    .btn:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
        transition: all 0.2s ease;
    }
    
    .btn:active:not(:disabled) {
        transform: translateY(0);
    }
    
    .form-control:focus {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(73, 16, 121, 0.15);
        transition: all 0.2s ease;
    }
    
    /* Loading states */
    .btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        transform: none !important;
    }
    
    /* Accessibility improvements */
    .btn:focus-visible,
    .nav-link:focus-visible,
    .action-card:focus-visible {
        outline: 2px solid #FFCB13;
        outline-offset: 2px;
    }
    
    /* Enhanced progress bars */
    .progress-fill {
        background: linear-gradient(90deg, #FE8630 0%, #FFCB13 100%);
        transition: width 0.5s ease;
    }
    
    .load-fill {
        background: linear-gradient(90deg, #FE8630 0%, #FFCB13 100%);
        transition: width 0.5s ease;
    }
    
    /* Resource cards enhanced animations */
    .resource-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
        transition: all 0.2s ease;
    }
    
    .resource-option input[type="radio"]:checked + .resource-card {
        animation: cardSelect 0.3s ease-out;
    }
    
    @keyframes cardSelect {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1.02) translateY(-2px); }
    }
    
    /* Settings section enhancements */
    .settings-section:hover {
        transform: translateY(-2px);
        transition: all 0.3s ease;
    }
    
    .toggle-switch:hover .toggle-slider {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }
    
    /* Enhanced spacing animations for page transitions */
    .page {
        transition: all 0.3s ease;
    }
    
    .page.active {
        animation: pageSlideIn 0.4s ease-out;
    }
    
    @keyframes pageSlideIn {
        from { 
            opacity: 0; 
            transform: translateY(20px); 
        }
        to { 
            opacity: 1; 
            transform: translateY(0); 
        }
    }
    
    /* Form section hover effects */
    .form-section:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
        transition: all 0.3s ease;
    }
    
    /* Activity item enhanced hover */
    .activity-item:hover .activity-icon {
        transform: scale(1.1);
        transition: transform 0.2s ease;
    }
    
    /* Notification enhanced animations */
    .notification-item.unread {
        animation: notificationPulse 2s ease-in-out infinite;
    }
    
    @keyframes notificationPulse {
        0%, 100% { 
            border-left-color: #FFCB13; 
        }
        50% { 
            border-left-color: #FE8630; 
        }
    }
    
    /* Tab button enhanced animations */
    .tab-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: all 0.2s ease;
    }
    
    .theme-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: all 0.2s ease;
    }
`;

document.head.appendChild(dynamicStyles);

// Initialize the NeoSpark Genie application
const app = new NeoSparkApp();

// Enhanced keyboard shortcuts and accessibility
document.addEventListener('DOMContentLoaded', function() {
    // Keyboard shortcuts for authenticated users
    document.addEventListener('keydown', function(e) {
        if (!app.isAuthenticated) return;
        
        // Ctrl/Cmd + N for new task
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            app.navigateToPage('submit');
        }
        
        // Ctrl/Cmd + T for tasks
        if ((e.ctrlKey || e.metaKey) && e.key === 't') {
            e.preventDefault();
            app.navigateToPage('tasks');
        }
        
        // Ctrl/Cmd + D for dashboard
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            app.navigateToPage('home');
        }
        
        // Escape to close side navigation
        if (e.key === 'Escape' && app.sideNavOpen) {
            app.closeSideNav();
        }
    });
    
    // Touch gesture support for mobile devices
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipeGesture();
    });
    
    function handleSwipeGesture() {
        if (!app.isAuthenticated) return;
        
        const swipeThreshold = 80;
        const swipeDistance = touchEndX - touchStartX;
        
        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0 && !app.sideNavOpen) {
                app.openSideNav();
            } else if (swipeDistance < 0 && app.sideNavOpen) {
                app.closeSideNav();
            }
        }
    }
    
    // Enhanced accessibility and focus management
    const focusableElements = document.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid #FFCB13';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
    
    // Add loading indicators for better UX
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn && !submitBtn.disabled) {
                const spinner = document.createElement('span');
                spinner.innerHTML = '⚡';
                spinner.style.marginRight = '8px';
                submitBtn.insertBefore(spinner, submitBtn.firstChild);
            }
        });
    });
    
    // Enhanced scroll animations for better spacing experience
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out';
            }
        });
    }, observerOptions);
    
    // Observe sections for animation
    const sections = document.querySelectorAll('.overview-section, .quick-actions, .recent-activity, .form-section, .team-grid, .settings-sections');
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Add fade in up animation
    const fadeInUpStyles = document.createElement('style');
    fadeInUpStyles.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(fadeInUpStyles);
});

// Auto-save functionality for forms (simulated)
document.addEventListener('input', function(e) {
    if (e.target.matches('.form-control')) {
        // Simulate auto-save with a subtle indicator
        const indicator = document.createElement('span');
        indicator.textContent = '✓';
        indicator.style.cssText = 'color: #FE8630; font-size: 12px; margin-left: 8px; opacity: 0; transition: opacity 0.3s ease;';
        
        // Remove existing indicators
        const existing = e.target.parentNode.querySelector('.save-indicator');
        if (existing) existing.remove();
        
        indicator.className = 'save-indicator';
        e.target.parentNode.appendChild(indicator);
        
        setTimeout(() => {
            indicator.style.opacity = '1';
            setTimeout(() => {
                indicator.style.opacity = '0';
                setTimeout(() => indicator.remove(), 300);
            }, 1000);
        }, 10);
    }
});

// Enhanced spacing awareness - smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';

// Add resize observer for responsive spacing adjustments
const resizeObserver = new ResizeObserver(entries => {
    entries.forEach(entry => {
        const element = entry.target;
        const width = entry.contentRect.width;
        
        // Adjust spacing based on container width
        if (width < 768) {
            element.style.setProperty('--dynamic-spacing', '16px');
        } else if (width < 1024) {
            element.style.setProperty('--dynamic-spacing', '24px');
        } else {
            element.style.setProperty('--dynamic-spacing', '32px');
        }
    });
});

// Observe main content for responsive spacing
const mainContent = document.querySelector('.main-content');
if (mainContent) {
    resizeObserver.observe(mainContent);
}

console.log('✨ NeoSpark Genie initialized successfully with enhanced spacing!');