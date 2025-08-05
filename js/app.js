// Main Application Manager for Athlete Journal
class AppManager {
    constructor() {
        this.currentScreen = 'progressScreen';
        this.currentEditingPoint = null;
        this.initializeApp();
    }

    // Initialize the application
    initializeApp() {
        this.cacheElements();
        this.bindEvents();
        this.renderGradingScreen();
        this.renderPastRatings();
        this.renderTrashBin();
        chartsManager.initializeCharts();
    }

    // Cache DOM elements for better performance
    cacheElements() {
        // Navigation elements
        this.tabs = {
            progressTab: document.getElementById('progressTab'),
            gradingTab: document.getElementById('gradingTab')
        };
        this.screens = {
            progressScreen: document.getElementById('progressScreen'),
            gradingScreen: document.getElementById('gradingScreen')
        };
        
        // Filter elements
        this.dateFilter = document.getElementById('dateFilter');
        this.customDateRange = document.getElementById('customDateRange');
        this.applyDateRangeButton = document.getElementById('applyDateRange');
        
        // Toggle buttons
        this.toggleDeletedBtn = document.getElementById('toggleDeletedBtn');
        this.togglePastRatingsBtn = document.getElementById('togglePastRatingsBtn');
        this.deletedChartContainer = document.getElementById('deletedChartContainer');
        this.pastRatingsContainer = document.getElementById('pastRatingsContainer');
        
        // Record day elements
        this.recordDayBtn = document.getElementById('recordDayBtn');
        this.recordDayModal = document.getElementById('recordDayModal');
        this.recordingForm = document.getElementById('recordingForm');
        this.saveRecordBtn = document.getElementById('saveRecordBtn');
        this.cancelRecordBtn = document.getElementById('cancelRecordBtn');
        this.closeRecordModal = document.getElementById('closeRecordModal');
        
        // Category management elements
        this.createCategoryBtn = document.getElementById('createCategoryBtn');
        this.createCategoryModal = document.getElementById('createCategoryModal');
        this.categoriesContainer = document.getElementById('categoriesContainer');
        this.saveCategoryBtn = document.getElementById('saveCategoryBtn');
        this.cancelCategoryBtn = document.getElementById('cancelCategoryBtn');
        this.closeCategoryModal = document.getElementById('closeCategoryModal');
        
        // Edit category elements
        this.editCategoryModal = document.getElementById('editCategoryModal');
        this.saveEditCategoryBtn = document.getElementById('saveEditCategoryBtn');
        this.cancelEditCategoryBtn = document.getElementById('cancelEditCategoryBtn');
        this.closeEditCategoryModal = document.getElementById('closeEditCategoryModal');
        this.currentEditingCategory = null;
        
        // Point management elements
        this.createPointModal = document.getElementById('createPointModal');
        this.savePointBtn = document.getElementById('savePointBtn');
        this.cancelPointBtn = document.getElementById('cancelPointBtn');
        this.closePointModal = document.getElementById('closePointModal');
        
        // Edit point elements
        this.editPointModal = document.getElementById('editPointModal');
        this.saveEditPointBtn = document.getElementById('saveEditPointBtn');
        this.cancelEditPointBtn = document.getElementById('cancelEditPointBtn');
        this.closeEditPointModal = document.getElementById('closeEditPointModal');
        
        // Past ratings list
        this.pastRatingsList = document.getElementById('pastRatingsList');
    }

    // Bind all event listeners
    bindEvents() {
        // Navigation events
        Object.keys(this.tabs).forEach(tabKey => {
            this.tabs[tabKey].addEventListener('click', () => this.changeScreen(tabKey));
        });

        // Filter events
        this.dateFilter.addEventListener('change', (e) => this.handleDateFilterChange(e));
        this.applyDateRangeButton.addEventListener('click', () => this.applyCustomDateRange());
        
        // Toggle events
        this.toggleDeletedBtn.addEventListener('click', () => this.toggleDeletedChart());
        this.togglePastRatingsBtn.addEventListener('click', () => this.togglePastRatings());
        
        // Record day events
        this.recordDayBtn.addEventListener('click', () => this.openRecordDayModal());
        this.saveRecordBtn.addEventListener('click', () => this.saveRecord());
        this.cancelRecordBtn.addEventListener('click', () => this.closeModal(this.recordDayModal));
        this.closeRecordModal.addEventListener('click', () => this.closeModal(this.recordDayModal));
        
        // Category management events
        this.createCategoryBtn.addEventListener('click', () => this.openCreateCategoryModal());
        this.saveCategoryBtn.addEventListener('click', () => this.saveCategory());
        this.cancelCategoryBtn.addEventListener('click', () => this.closeModal(this.createCategoryModal));
        this.closeCategoryModal.addEventListener('click', () => this.closeModal(this.createCategoryModal));
        
        // Edit category events
        this.saveEditCategoryBtn.addEventListener('click', () => this.saveEditCategory());
        this.cancelEditCategoryBtn.addEventListener('click', () => this.closeModal(this.editCategoryModal));
        this.closeEditCategoryModal.addEventListener('click', () => this.closeModal(this.editCategoryModal));
        
        // Point management events
        this.savePointBtn.addEventListener('click', () => this.savePoint());
        this.cancelPointBtn.addEventListener('click', () => this.closeModal(this.createPointModal));
        this.closePointModal.addEventListener('click', () => this.closeModal(this.createPointModal));
        
        // Edit point events
        this.saveEditPointBtn.addEventListener('click', () => this.saveEditPoint());
        this.cancelEditPointBtn.addEventListener('click', () => this.closeModal(this.editPointModal));
        this.closeEditPointModal.addEventListener('click', () => this.closeModal(this.editPointModal));

        // Global events
        document.addEventListener('keydown', (e) => {
            if (e.key === "Escape") {
                this.closeAllModals();
            }
        });
        
        // Modal backdrop click events
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });
    }

    // Navigation methods
    changeScreen(tabKey) {
        this.currentScreen = this.tabs[tabKey].dataset.screen;
        Object.values(this.screens).forEach(screen => screen.classList.remove('active'));
        this.screens[this.currentScreen].classList.add('active');

        Object.values(this.tabs).forEach(tab => tab.classList.remove('active'));
        this.tabs[tabKey].classList.add('active');
        
        if (this.currentScreen === 'gradingScreen') {
            this.renderGradingScreen();
        }
    }

    // Filter methods
    handleDateFilterChange(e) {
        const value = e.target.value;
        if (value === 'custom') {
            this.customDateRange.classList.remove('hidden');
        } else {
            this.customDateRange.classList.add('hidden');
            chartsManager.updateDateRange(value);
            this.renderPastRatings();
        }
    }

    applyCustomDateRange() {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        
        if (startDate && endDate) {
            chartsManager.updateDateRange('custom', startDate, endDate);
            this.renderPastRatings();
        }
        
        this.customDateRange.classList.add('hidden');
    }

    // Toggle methods
    toggleDeletedChart() {
        this.deletedChartContainer.classList.toggle('hidden');
        const isVisible = !this.deletedChartContainer.classList.contains('hidden');
        this.toggleDeletedBtn.textContent = isVisible ? 'Hide Deleted Points' : 'Show Deleted Points';
        
        if (isVisible) {
            chartsManager.updateDeletedChart();
            this.renderTrashBin();
        }
    }

    togglePastRatings() {
        this.pastRatingsContainer.classList.toggle('hidden');
        const isVisible = !this.pastRatingsContainer.classList.contains('hidden');
        this.togglePastRatingsBtn.textContent = isVisible ? 'Hide Past Ratings' : 'Show Past Ratings';
        
        // Render past ratings when showing them
        if (isVisible) {
            this.renderPastRatings();
        }
    }

    // Modal methods
    openModal(modal) {
        modal.classList.remove('hidden');
    }

    closeModal(modal) {
        modal.classList.add('hidden');
        this.clearModalForms();
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.add('hidden');
        });
        this.clearModalForms();
    }

    clearModalForms() {
        document.querySelectorAll('.modal input, .modal select').forEach(input => {
            if (input.type !== 'color') {
                input.value = '';
            }
        });
        this.currentEditingPoint = null;
        this.currentEditingCategory = null;
    }

    // Record day methods
    openRecordDayModal() {
        const categories = storageManager.getCategories();
        const points = storageManager.getPoints();
        
        if (points.length === 0) {
            alert('Please create some categories and points first before recording a day.');
            return;
        }
        
        this.renderRecordingForm();
        this.openModal(this.recordDayModal);
    }

    renderRecordingForm() {
        const categories = storageManager.getCategories();
        const points = storageManager.getPoints();
        
        let html = '';
        
        categories.forEach(category => {
            const categoryPoints = points.filter(point => point.categoryId === category.id);
            
            if (categoryPoints.length > 0) {
                html += `
                    <div class="recording-category" style="border-left-color: ${category.color}">
                        <h3>${category.name}</h3>
                        ${categoryPoints.map(point => `
                            <div class="recording-point">
                                <div class="point-label">${point.name}</div>
                                <div class="rating-scale">
                                    <span>1</span>
                                    <input type="range" min="1" max="10" value="5" 
                                           data-point-id="${point.id}" class="rating-slider">
                                    <span>10</span>
                                    <div class="rating-value">5</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
            }
        });
        
        this.recordingForm.innerHTML = html;
        
        // Add event listeners for sliders
        this.recordingForm.querySelectorAll('.rating-slider').forEach(slider => {
            const valueDisplay = slider.parentElement.querySelector('.rating-value');
            slider.addEventListener('input', (e) => {
                valueDisplay.textContent = e.target.value;
            });
        });
    }

    saveRecord() {
        const sliders = this.recordingForm.querySelectorAll('.rating-slider');
        const scores = [];
        
        sliders.forEach(slider => {
            scores.push({
                pointId: slider.dataset.pointId,
                value: parseInt(slider.value)
            });
        });
        
        const rating = {
            date: new Date().toISOString().split('T')[0],
            scores: scores
        };
        
        if (storageManager.addRating(rating)) {
            this.closeModal(this.recordDayModal);
            chartsManager.updateAllCharts();
            this.renderPastRatings();
            this.showNotification('Day recorded successfully!');
        } else {
            alert('Error saving record. Please try again.');
        }
    }

    // Category management methods
    openCreateCategoryModal() {
        this.openModal(this.createCategoryModal);
    }

    saveCategory() {
        const name = document.getElementById('categoryName').value.trim();
        const color = document.getElementById('categoryColor').value;
        
        if (!name) {
            alert('Please enter a category name.');
            return;
        }
        
        const category = { name, color };
        
        if (storageManager.addCategory(category)) {
            this.closeModal(this.createCategoryModal);
            this.renderGradingScreen();
            this.showNotification('Category created successfully!');
        } else {
            alert('Error creating category. Please try again.');
        }
    }

    openEditCategoryModal(categoryId) {
        const category = storageManager.getCategoryById(categoryId);
        if (category) {
            this.currentEditingCategory = categoryId;
            document.getElementById('editCategoryName').value = category.name;
            document.getElementById('editCategoryColor').value = category.color;
            this.openModal(this.editCategoryModal);
        }
    }

    saveEditCategory() {
        const name = document.getElementById('editCategoryName').value.trim();
        const color = document.getElementById('editCategoryColor').value;
        
        if (!name) {
            alert('Please enter a category name.');
            return;
        }
        
        if (storageManager.updateCategory(this.currentEditingCategory, { name, color })) {
            this.closeModal(this.editCategoryModal);
            this.renderGradingScreen();
            this.showNotification('Category updated successfully!');
        } else {
            alert('Error updating category. Please try again.');
        }
    }

    deleteCategory(categoryId) {
        if (confirm('Are you sure you want to delete this category? This will remove all associated points.')) {
            if (storageManager.deleteCategory(categoryId)) {
                this.renderGradingScreen();
                this.showNotification('Category deleted successfully!');
            } else {
                alert('Error deleting category. Please try again.');
            }
        }
    }

    // Point management methods
    openCreatePointModal(categoryId) {
        const categorySelect = document.getElementById('pointCategory');
        const categories = storageManager.getCategories();
        
        categorySelect.innerHTML = '<option value="">Select a category</option>';
        categories.forEach(category => {
            const selected = category.id === categoryId ? 'selected' : '';
            categorySelect.innerHTML += `<option value="${category.id}" ${selected}>${category.name}</option>`;
        });
        
        this.openModal(this.createPointModal);
    }

    savePoint() {
        const name = document.getElementById('pointName').value.trim();
        const categoryId = document.getElementById('pointCategory').value;
        
        if (!name || !categoryId) {
            alert('Please enter a point name and select a category.');
            return;
        }
        
        const point = { name, categoryId };
        
        if (storageManager.addPoint(point)) {
            this.closeModal(this.createPointModal);
            this.renderGradingScreen();
            this.showNotification('Point created successfully!');
        } else {
            alert('Error creating point. Please try again.');
        }
    }

    openEditPointModal(pointId) {
        const point = storageManager.getPointById(pointId);
        if (point) {
            this.currentEditingPoint = pointId;
            document.getElementById('editPointName').value = point.name;
            this.openModal(this.editPointModal);
        }
    }

    saveEditPoint() {
        const name = document.getElementById('editPointName').value.trim();
        
        if (!name) {
            alert('Please enter a point name.');
            return;
        }
        
        if (storageManager.updatePoint(this.currentEditingPoint, { name })) {
            this.closeModal(this.editPointModal);
            this.renderGradingScreen();
            this.showNotification('Point updated successfully!');
        } else {
            alert('Error updating point. Please try again.');
        }
    }

    deletePoint(pointId) {
        if (confirm('Are you sure you want to delete this point? It will be moved to trash.')) {
            if (storageManager.deletePoint(pointId)) {
                this.renderGradingScreen();
                this.renderTrashBin();
                chartsManager.updateAllCharts();
                this.showNotification('Point moved to trash.');
            }
        }
    }

    // Grading screen rendering
    renderGradingScreen() {
        const categories = storageManager.getCategories();
        const points = storageManager.getPoints();
        
        let html = '';
        
        categories.forEach(category => {
            const categoryPoints = points.filter(point => point.categoryId === category.id);
            
            html += `
                <div class="category-card">
                    <div class="category-header" style="border-left-color: ${category.color}">
                        <div class="category-name" onclick="app.toggleCategory('${category.id}')">${category.name}</div>
                        <div class="category-header-actions">
                            <button class="edit-btn" onclick="app.openEditCategoryModal('${category.id}')" title="Edit Category">
                                ✏️
                            </button>
                            <button class="delete-btn" onclick="app.deleteCategory('${category.id}')" title="Delete Category">
                                🗑️
                            </button>
                            <div class="category-toggle" onclick="app.toggleCategory('${category.id}')" id="toggle-${category.id}">▼</div>
                        </div>
                    </div>
                    <div class="category-content" id="content-${category.id}">
                        <div class="points-list">
                            ${categoryPoints.map(point => `
                                <div class="point-item">
                                    <div class="point-name">${point.name}</div>
                                    <div class="point-actions">
                                        <button class="edit-btn" onclick="app.openEditPointModal('${point.id}')" title="Edit">
                                            ✏️
                                        </button>
                                        <button class="delete-btn" onclick="app.deletePoint('${point.id}')" title="Delete">
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <button class="btn btn-secondary" onclick="app.openCreatePointModal('${category.id}')">
                            + Create Point
                        </button>
                    </div>
                </div>
            `;
        });
        
        this.categoriesContainer.innerHTML = html;
    }

    toggleCategory(categoryId) {
        const content = document.getElementById(`content-${categoryId}`);
        const toggle = document.getElementById(`toggle-${categoryId}`);
        
        content.classList.toggle('collapsed');
        toggle.classList.toggle('expanded');
    }

    // Past ratings rendering
    renderPastRatings() {
        const { startDate, endDate } = chartsManager.currentDateRange;
        const ratings = storageManager.getRatingsByDateRange(startDate, endDate);
        const categories = storageManager.getCategories();
        const points = storageManager.getPoints();
        
        let html = '';
        
        // Group ratings by date to handle multiple ratings per day
        const ratingsByDate = {};
        ratings.forEach(rating => {
            const dateKey = new Date(rating.date).toDateString();
            if (!ratingsByDate[dateKey]) {
                ratingsByDate[dateKey] = [];
            }
            ratingsByDate[dateKey].push(rating);
        });
        
        // Sort dates in descending order
        const sortedDates = Object.keys(ratingsByDate).sort((a, b) => new Date(b) - new Date(a));
        
        sortedDates.forEach(dateKey => {
            const dayRatings = ratingsByDate[dateKey];
            const date = new Date(dateKey).toLocaleDateString();
            
            // Calculate average for the day
            let totalScore = 0;
            let totalCount = 0;
            const categoryScores = {};
            
            dayRatings.forEach(rating => {
                rating.scores.forEach(score => {
                    totalScore += score.value;
                    totalCount++;
                    
                    const point = points.find(p => p.id === score.pointId);
                    if (point) {
                        const category = categories.find(c => c.id === point.categoryId);
                        if (category) {
                            if (!categoryScores[category.name]) {
                                categoryScores[category.name] = [];
                            }
                            categoryScores[category.name].push(`${point.name}: ${score.value}`);
                        }
                    }
                });
            });
            
            const averageScore = totalCount > 0 ? totalScore / totalCount : 0;
            const summaryText = Object.keys(categoryScores).map(catName => 
                `${catName}: ${categoryScores[catName].join(', ')}`
            ).join(' | ');
            
            html += `
                <div class="rating-item">
                    <div class="rating-header">
                        <div class="rating-date">${date}</div>
                        <button class="delete-day-btn" onclick="app.deleteRatingDay('${dateKey}')" title="Delete this day">
                            🗑️
                        </button>
                    </div>
                    <div class="rating-summary">
                        Average: ${averageScore.toFixed(1)}/10 (${dayRatings.length} entries)<br>
                        ${summaryText}
                    </div>
                </div>
            `;
        });
        
        if (!html) {
            html = '<div class="text-center">No ratings found for the selected period.</div>';
        }
        
        this.pastRatingsList.innerHTML = html;
    }

    // Trash bin rendering
    renderTrashBin() {
        const trashBinList = document.getElementById('trashBinList');
        if (!trashBinList) return;
        
        const deletedPoints = storageManager.getDeletedPoints();
        const categories = storageManager.getCategories();
        const pointAverages = storageManager.getAverageRatingsByPoint(
            new Date(0), // Get all historical data
            new Date()
        );
        
        let html = '';
        
        if (deletedPoints.length === 0) {
            html = '<div class="text-center">Trash bin is empty</div>';
        } else {
            deletedPoints.forEach(point => {
                const category = categories.find(c => c.id === point.categoryId);
                const avgData = pointAverages[point.id];
                const deletedDate = new Date(point.deletedAt).toLocaleDateString();
                
                html += `
                    <div class="trash-item" style="border-left-color: ${category ? category.color : '#f44336'}">
                        <div class="trash-item-info">
                            <div class="trash-item-name">${point.name}</div>
                            <div class="trash-item-details">
                                ${category ? `Category: ${category.name} | ` : ''}
                                ${avgData && avgData.count > 0 ? `Avg: ${avgData.average.toFixed(1)}/10 (${avgData.count} entries) | ` : ''}
                                Deleted: ${deletedDate}
                            </div>
                        </div>
                        <div class="trash-item-actions">
                            <button class="restore-btn" onclick="app.restorePoint('${point.id}')" title="Restore">
                                Restore
                            </button>
                            <button class="permanent-delete-btn" onclick="app.permanentlyDeletePoint('${point.id}')" title="Delete Forever">
                                Delete Forever
                            </button>
                        </div>
                    </div>
                `;
            });
        }
        
        trashBinList.innerHTML = html;
    }

    // Trash bin management methods
    restorePoint(pointId) {
        if (confirm('Are you sure you want to restore this point?')) {
            if (storageManager.restorePoint(pointId)) {
                this.renderTrashBin();
                this.renderGradingScreen();
                chartsManager.updateAllCharts();
                this.showNotification('Point restored successfully!');
            } else {
                alert('Error restoring point. Please try again.');
            }
        }
    }

    permanentlyDeletePoint(pointId) {
        if (confirm('Are you sure you want to permanently delete this point? This action cannot be undone and will remove all associated data.')) {
            if (storageManager.permanentlyDeletePoint(pointId)) {
                this.renderTrashBin();
                chartsManager.updateAllCharts();
                this.showNotification('Point permanently deleted.');
            } else {
                alert('Error deleting point. Please try again.');
            }
        }
    }

    // Rating day deletion method
    deleteRatingDay(dateKey) {
        const date = new Date(dateKey).toLocaleDateString();
        if (confirm(`Are you sure you want to delete all ratings for ${date}? This action cannot be undone.`)) {
            if (storageManager.deleteRatingsByDate(dateKey)) {
                this.renderPastRatings();
                chartsManager.updateAllCharts();
                this.showNotification(`Ratings for ${date} deleted successfully.`);
            } else {
                alert('Error deleting ratings. Please try again.');
            }
        }
    }

    // Utility methods
    showNotification(message) {
        // Create a simple notification
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 1rem;
            border-radius: 8px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Static method to initialize the app
    static run() {
        window.app = new AppManager();
    }
}

// Initialize the application when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', AppManager.run);
} else {
    AppManager.run();
}
