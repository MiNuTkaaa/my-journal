// Local Storage Manager for Athlete Journal
class StorageManager {
    constructor() {
        this.STORAGE_KEYS = {
            CATEGORIES: 'athlete_journal_categories',
            POINTS: 'athlete_journal_points',
            RATINGS: 'athlete_journal_ratings',
            DELETED_POINTS: 'athlete_journal_deleted_points'
        };
        
        // Initialize storage if first time
        this.initializeStorage();
    }

    initializeStorage() {
        if (!this.getCategories()) {
            this.saveData(this.STORAGE_KEYS.CATEGORIES, []);
        }
        if (!this.getPoints()) {
            this.saveData(this.STORAGE_KEYS.POINTS, []);
        }
        if (!this.getRatings()) {
            this.saveData(this.STORAGE_KEYS.RATINGS, []);
        }
        if (!this.getDeletedPoints()) {
            this.saveData(this.STORAGE_KEYS.DELETED_POINTS, []);
        }
    }

    // Generic storage methods
    saveData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving data:', error);
            return false;
        }
    }

    getData(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading data:', error);
            return null;
        }
    }

    // Category methods
    getCategories() {
        return this.getData(this.STORAGE_KEYS.CATEGORIES) || [];
    }

    addCategory(category) {
        const categories = this.getCategories();
        category.id = this.generateId();
        category.createdAt = new Date().toISOString();
        categories.push(category);
        return this.saveData(this.STORAGE_KEYS.CATEGORIES, categories);
    }

    updateCategory(categoryId, updatedData) {
        const categories = this.getCategories();
        const index = categories.findIndex(cat => cat.id === categoryId);
        if (index !== -1) {
            categories[index] = { ...categories[index], ...updatedData };
            return this.saveData(this.STORAGE_KEYS.CATEGORIES, categories);
        }
        return false;
    }

    deleteCategory(categoryId) {
        const categories = this.getCategories();
        const filteredCategories = categories.filter(cat => cat.id !== categoryId);
        
        // Also delete all points in this category
        const points = this.getPoints();
        const filteredPoints = points.filter(point => point.categoryId !== categoryId);
        
        this.saveData(this.STORAGE_KEYS.CATEGORIES, filteredCategories);
        this.saveData(this.STORAGE_KEYS.POINTS, filteredPoints);
        
        return true;
    }

    getCategoryById(categoryId) {
        const categories = this.getCategories();
        return categories.find(cat => cat.id === categoryId);
    }

    // Point methods
    getPoints() {
        return this.getData(this.STORAGE_KEYS.POINTS) || [];
    }

    addPoint(point) {
        const points = this.getPoints();
        point.id = this.generateId();
        point.createdAt = new Date().toISOString();
        points.push(point);
        return this.saveData(this.STORAGE_KEYS.POINTS, points);
    }

    updatePoint(pointId, updatedData) {
        const points = this.getPoints();
        const index = points.findIndex(point => point.id === pointId);
        if (index !== -1) {
            points[index] = { ...points[index], ...updatedData };
            return this.saveData(this.STORAGE_KEYS.POINTS, points);
        }
        return false;
    }

    deletePoint(pointId) {
        const points = this.getPoints();
        const pointToDelete = points.find(point => point.id === pointId);
        
        if (pointToDelete) {
            // Move to deleted points
            const deletedPoints = this.getDeletedPoints();
            pointToDelete.deletedAt = new Date().toISOString();
            deletedPoints.push(pointToDelete);
            this.saveData(this.STORAGE_KEYS.DELETED_POINTS, deletedPoints);
            
            // Remove from points
            const filteredPoints = points.filter(point => point.id !== pointId);
            return this.saveData(this.STORAGE_KEYS.POINTS, filteredPoints);
        }
        
        return false;
    }

    getPointById(pointId) {
        const points = this.getPoints();
        return points.find(point => point.id === pointId);
    }

    getPointsByCategory(categoryId) {
        const points = this.getPoints();
        return points.filter(point => point.categoryId === categoryId);
    }

    // Deleted points methods
    getDeletedPoints() {
        return this.getData(this.STORAGE_KEYS.DELETED_POINTS) || [];
    }

    restorePoint(pointId) {
        const deletedPoints = this.getDeletedPoints();
        const pointToRestore = deletedPoints.find(point => point.id === pointId);
        
        if (pointToRestore) {
            // Remove from deleted points
            const filteredDeleted = deletedPoints.filter(point => point.id !== pointId);
            this.saveData(this.STORAGE_KEYS.DELETED_POINTS, filteredDeleted);
            
            // Add back to points
            const points = this.getPoints();
            delete pointToRestore.deletedAt;
            points.push(pointToRestore);
            return this.saveData(this.STORAGE_KEYS.POINTS, points);
        }
        
        return false;
    }

    permanentlyDeletePoint(pointId) {
        const deletedPoints = this.getDeletedPoints();
        const filteredDeleted = deletedPoints.filter(point => point.id !== pointId);
        return this.saveData(this.STORAGE_KEYS.DELETED_POINTS, filteredDeleted);
    }

    // Rating methods
    getRatings() {
        return this.getData(this.STORAGE_KEYS.RATINGS) || [];
    }

    addRating(rating) {
        const ratings = this.getRatings();
        rating.id = this.generateId();
        rating.createdAt = new Date().toISOString();
        ratings.push(rating);
        return this.saveData(this.STORAGE_KEYS.RATINGS, ratings);
    }

    deleteRating(ratingId) {
        const ratings = this.getRatings();
        const filteredRatings = ratings.filter(rating => rating.id !== ratingId);
        return this.saveData(this.STORAGE_KEYS.RATINGS, filteredRatings);
    }

    deleteRatingsByDate(date) {
        const ratings = this.getRatings();
        const targetDate = new Date(date).toDateString();
        const filteredRatings = ratings.filter(rating => {
            const ratingDate = new Date(rating.date).toDateString();
            return ratingDate !== targetDate;
        });
        return this.saveData(this.STORAGE_KEYS.RATINGS, filteredRatings);
    }

    getRatingsByDateRange(startDate, endDate) {
        const ratings = this.getRatings();
        return ratings.filter(rating => {
            const ratingDate = new Date(rating.date);
            return ratingDate >= startDate && ratingDate <= endDate;
        });
    }

    getRatingsByDate(date) {
        const ratings = this.getRatings();
        const targetDate = new Date(date).toDateString();
        return ratings.filter(rating => {
            const ratingDate = new Date(rating.date).toDateString();
            return ratingDate === targetDate;
        });
    }

    getLatestRatings(limit = 10) {
        const ratings = this.getRatings();
        return ratings
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, limit);
    }

    // Analytics methods
    getAverageRatingsByCategory(startDate, endDate) {
        const ratings = this.getRatingsByDateRange(startDate, endDate);
        const categories = this.getCategories();
        const points = this.getPoints();
        
        const categoryAverages = {};
        
        categories.forEach(category => {
            const categoryPoints = points.filter(point => point.categoryId === category.id);
            let totalScore = 0;
            let totalRatings = 0;
            
            ratings.forEach(rating => {
                rating.scores.forEach(score => {
                    if (categoryPoints.find(point => point.id === score.pointId)) {
                        totalScore += score.value;
                        totalRatings++;
                    }
                });
            });
            
            categoryAverages[category.id] = {
                category: category,
                average: totalRatings > 0 ? totalScore / totalRatings : 0,
                count: totalRatings
            };
        });
        
        return categoryAverages;
    }

    getAverageRatingsByPoint(startDate, endDate) {
        const ratings = this.getRatingsByDateRange(startDate, endDate);
        const points = this.getPoints();
        const deletedPoints = this.getDeletedPoints();
        
        // Combine active and deleted points for calculations
        const allPoints = [...points, ...deletedPoints];
        
        const pointAverages = {};
        
        allPoints.forEach(point => {
            let totalScore = 0;
            let totalRatings = 0;
            
            ratings.forEach(rating => {
                const score = rating.scores.find(s => s.pointId === point.id);
                if (score) {
                    totalScore += score.value;
                    totalRatings++;
                }
            });
            
            pointAverages[point.id] = {
                point: point,
                average: totalRatings > 0 ? totalScore / totalRatings : 0,
                count: totalRatings
            };
        });
        
        return pointAverages;
    }

    // Date utility methods
    getDateRange(period) {
        const now = new Date();
        let startDate, endDate;
        
        switch (period) {
            case 'week':
                startDate = new Date(now);
                startDate.setDate(now.getDate() - 7);
                endDate = now;
                break;
            case 'month':
                startDate = new Date(now);
                startDate.setMonth(now.getMonth() - 1);
                endDate = now;
                break;
            case 'year':
                startDate = new Date(now);
                startDate.setFullYear(now.getFullYear() - 1);
                endDate = now;
                break;
            default:
                startDate = new Date(0);
                endDate = now;
        }
        
        return { startDate, endDate };
    }

    // Utility methods
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    exportData() {
        return {
            categories: this.getCategories(),
            points: this.getPoints(),
            ratings: this.getRatings(),
            deletedPoints: this.getDeletedPoints(),
            exportedAt: new Date().toISOString()
        };
    }

    importData(data) {
        try {
            if (data.categories) {
                this.saveData(this.STORAGE_KEYS.CATEGORIES, data.categories);
            }
            if (data.points) {
                this.saveData(this.STORAGE_KEYS.POINTS, data.points);
            }
            if (data.ratings) {
                this.saveData(this.STORAGE_KEYS.RATINGS, data.ratings);
            }
            if (data.deletedPoints) {
                this.saveData(this.STORAGE_KEYS.DELETED_POINTS, data.deletedPoints);
            }
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }

    clearAllData() {
        const keys = Object.values(this.STORAGE_KEYS);
        keys.forEach(key => {
            localStorage.removeItem(key);
        });
        this.initializeStorage();
    }
}

// Create global instance
window.storageManager = new StorageManager();
