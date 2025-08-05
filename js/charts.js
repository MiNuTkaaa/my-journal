// Charts Manager for Athlete Journal
class ChartsManager {
    constructor() {
        this.charts = {};
        this.currentDateRange = { startDate: null, endDate: null };
        this.visiblePoints = new Set();
    }

    // Initialize all charts
    initializeCharts() {
        this.updateDateRange('week');
        this.createBarChart();
        this.createLifeWheelChart();
        this.createDeletedChart();
        this.updateAllCharts();
    }

    // Update date range
    updateDateRange(period, customStart = null, customEnd = null) {
        if (period === 'custom' && customStart && customEnd) {
            this.currentDateRange.startDate = new Date(customStart);
            this.currentDateRange.endDate = new Date(customEnd);
        } else {
            const range = storageManager.getDateRange(period);
            this.currentDateRange = range;
        }
        this.updateAllCharts();
    }

    // Create bar chart for performance overview
    createBarChart() {
        const ctx = document.getElementById('barChart');
        if (!ctx) return;

        if (this.charts.barChart) {
            this.charts.barChart.destroy();
        }

        this.charts.barChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Average Score',
                    data: [],
                    backgroundColor: [],
                    borderColor: [],
                    borderWidth: 1,
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            afterLabel: (context) => {
                                const pointId = context.parsed._custom || context.dataIndex;
                                const data = this.getPointAveragesData();
                                const pointData = data.find(d => d.pointId === pointId);
                                return pointData ? `Entries: ${pointData.count}` : '';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 10,
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#666'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#666'
                        }
                    }
                },
                onClick: (event, elements) => {
                    if (elements.length > 0) {
                        const index = elements[0].index;
                        this.togglePointVisibility(index);
                    }
                }
            }
        });
    }

    // Create life wheel chart
    createLifeWheelChart() {
        const ctx = document.getElementById('lifeWheelChart');
        if (!ctx) return;

        if (this.charts.lifeWheelChart) {
            this.charts.lifeWheelChart.destroy();
        }

        this.charts.lifeWheelChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    label: 'Life Balance',
                    data: [],
                    backgroundColor: [],
                    borderColor: '#fff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 15,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                return `${label}: ${value.toFixed(1)}/10`;
                            }
                        }
                    }
                },
                cutout: '50%'
            }
        });
    }

    // Create deleted points chart
    createDeletedChart() {
        const ctx = document.getElementById('deletedChart');
        if (!ctx) return;

        if (this.charts.deletedChart) {
            this.charts.deletedChart.destroy();
        }

        this.charts.deletedChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Deleted Points (Last Known Average)',
                    data: [],
                    backgroundColor: [],
                    borderColor: [],
                    borderWidth: 1,
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            afterLabel: (context) => {
                                const data = this.getDeletedPointsData();
                                const pointData = data[context.dataIndex];
                                return pointData ? `Entries: ${pointData.count}` : '';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 10,
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#666'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#666'
                        }
                    }
                }
            }
        });
    }

    // Update all charts with current data
    updateAllCharts() {
        this.updateBarChart();
        this.updateLifeWheelChart();
        this.updateDeletedChart();
    }

    // Update bar chart data
    updateBarChart() {
        if (!this.charts.barChart) return;

        const data = this.getPointAveragesData();
        const categories = storageManager.getCategories();
        
        // Create color map for categories
        const categoryColors = {};
        categories.forEach(cat => {
            categoryColors[cat.id] = cat.color;
        });

        const labels = data.map(d => d.point.name);
        const values = data.map(d => d.average);
        const colors = data.map(d => {
            const category = storageManager.getCategoryById(d.point.categoryId);
            return category ? category.color + '80' : '#2196F380';
        });
        const borderColors = data.map(d => {
            const category = storageManager.getCategoryById(d.point.categoryId);
            return category ? category.color : '#2196F3';
        });

        this.charts.barChart.data.labels = labels;
        this.charts.barChart.data.datasets[0].data = values;
        this.charts.barChart.data.datasets[0].backgroundColor = colors;
        this.charts.barChart.data.datasets[0].borderColor = borderColors;
        this.charts.barChart.update();
    }

    // Update life wheel chart data
    updateLifeWheelChart() {
        if (!this.charts.lifeWheelChart) return;

        const categoryAverages = storageManager.getAverageRatingsByCategory(
            this.currentDateRange.startDate,
            this.currentDateRange.endDate
        );

        const labels = [];
        const values = [];
        const colors = [];

        Object.values(categoryAverages).forEach(catData => {
            if (catData.count > 0) {
                labels.push(catData.category.name);
                values.push(catData.average);
                colors.push(catData.category.color);
            }
        });

        this.charts.lifeWheelChart.data.labels = labels;
        this.charts.lifeWheelChart.data.datasets[0].data = values;
        this.charts.lifeWheelChart.data.datasets[0].backgroundColor = colors;
        this.charts.lifeWheelChart.update();
    }

    // Update deleted chart data
    updateDeletedChart() {
        if (!this.charts.deletedChart) return;

        const data = this.getDeletedPointsData();
        const categories = storageManager.getCategories();
        const deletedPoints = storageManager.getDeletedPoints();
        const allRatings = storageManager.getRatings();
        
        console.log('=== DELETED CHART DEBUG ===');
        console.log('Deleted points:', deletedPoints);
        console.log('All ratings:', allRatings);
        console.log('Processed data:', data);
        
        const labels = data.map(d => d.point.name);
        const values = data.map(d => d.average);
        const colors = data.map(d => {
            const category = categories.find(c => c.id === d.point.categoryId);
            return category ? category.color + '80' : '#f4433680';
        });
        const borderColors = data.map(d => {
            const category = categories.find(c => c.id === d.point.categoryId);
            return category ? category.color : '#f44336';
        });

        console.log('Chart labels:', labels);
        console.log('Chart values:', values);
        console.log('===============================');

        this.charts.deletedChart.data.labels = labels;
        this.charts.deletedChart.data.datasets[0].data = values;
        this.charts.deletedChart.data.datasets[0].backgroundColor = colors;
        this.charts.deletedChart.data.datasets[0].borderColor = borderColors;
        this.charts.deletedChart.update();
    }

    // Get point averages data for current date range (ACTIVE POINTS ONLY)
    getPointAveragesData() {
        const pointAverages = storageManager.getAverageRatingsByPoint(
            this.currentDateRange.startDate,
            this.currentDateRange.endDate
        );
        
        // Get only active points (not deleted)
        const activePoints = storageManager.getPoints();
        const activePointIds = new Set(activePoints.map(p => p.id));
        
        // Get categories for sorting
        const categories = storageManager.getCategories();
        const categoryOrder = {};
        categories.forEach((cat, index) => {
            categoryOrder[cat.id] = index;
        });

        return Object.values(pointAverages)
            .filter(data => data.count > 0 && activePointIds.has(data.point.id)) // Only active points
            .map(data => ({
                pointId: data.point.id,
                point: data.point,
                average: data.average,
                count: data.count
            }))
            .sort((a, b) => {
                // First sort by category order
                const categoryA = categoryOrder[a.point.categoryId] || 999;
                const categoryB = categoryOrder[b.point.categoryId] || 999;
                if (categoryA !== categoryB) {
                    return categoryA - categoryB;
                }
                // Then sort by point name within category
                return a.point.name.localeCompare(b.point.name);
            });
    }

    // Get deleted points data with their historical averages
    getDeletedPointsData() {
        const deletedPoints = storageManager.getDeletedPoints();
        
        // Get ALL ratings ever recorded (not limited by current date range)
        const allRatings = storageManager.getRatings();
        
        // Get categories for sorting
        const categories = storageManager.getCategories();
        const categoryOrder = {};
        categories.forEach((cat, index) => {
            categoryOrder[cat.id] = index;
        });
        
        console.log('=== DELETED POINTS DATA DEBUG ===');
        console.log('Deleted points:', deletedPoints);
        console.log('All ratings ever:', allRatings);
        
        return deletedPoints
            .map(point => {
                let totalScore = 0;
                let totalRatings = 0;
                
                // Search through ALL ratings for this deleted point
                allRatings.forEach(rating => {
                    const score = rating.scores.find(s => s.pointId === point.id);
                    if (score) {
                        console.log(`Found historical score for deleted point ${point.name}: ${score.value} on ${rating.date}`);
                        totalScore += score.value;
                        totalRatings++;
                    }
                });
                
                if (totalRatings > 0) {
                    const average = totalScore / totalRatings;
                    console.log(`Deleted point ${point.name}: ${totalRatings} total ratings, average ${average}`);
                    return {
                        point: point,
                        average: average,
                        count: totalRatings
                    };
                }
                
                console.log(`No ratings found for deleted point ${point.name}`);
                return null;
            })
            .filter(data => data !== null)
            .sort((a, b) => {
                // First sort by category order
                const categoryA = categoryOrder[a.point.categoryId] || 999;
                const categoryB = categoryOrder[b.point.categoryId] || 999;
                if (categoryA !== categoryB) {
                    return categoryA - categoryB;
                }
                // Then sort by point name within category
                return a.point.name.localeCompare(b.point.name);
            });
    }

    // Toggle point visibility in bar chart
    togglePointVisibility(index) {
        if (!this.charts.barChart) return;

        const chart = this.charts.barChart;
        const meta = chart.getDatasetMeta(0);
        const element = meta.data[index];

        if (element) {
            element.hidden = !element.hidden;
            chart.update();
        }
    }

    // Destroy all charts
    destroyAllCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.destroy();
            }
        });
        this.charts = {};
    }

    // Export chart as image
    exportChart(chartName) {
        const chart = this.charts[chartName];
        if (chart) {
            const url = chart.toBase64Image();
            const link = document.createElement('a');
            link.download = `${chartName}_${new Date().toISOString().split('T')[0]}.png`;
            link.href = url;
            link.click();
        }
    }

    // Get chart statistics
    getChartStats() {
        const data = this.getPointAveragesData();
        const categoryAverages = storageManager.getAverageRatingsByCategory(
            this.currentDateRange.startDate,
            this.currentDateRange.endDate
        );

        const stats = {
            totalPoints: data.length,
            totalEntries: data.reduce((sum, d) => sum + d.count, 0),
            overallAverage: data.length > 0 ? 
                data.reduce((sum, d) => sum + d.average, 0) / data.length : 0,
            highestPoint: data.length > 0 ? 
                data.reduce((max, d) => d.average > max.average ? d : max) : null,
            lowestPoint: data.length > 0 ? 
                data.reduce((min, d) => d.average < min.average ? d : min) : null,
            categories: Object.keys(categoryAverages).length,
            dateRange: {
                start: this.currentDateRange.startDate.toLocaleDateString(),
                end: this.currentDateRange.endDate.toLocaleDateString()
            }
        };

        return stats;
    }

    // Update chart colors based on theme
    updateChartTheme(isDark = false) {
        const textColor = isDark ? '#e0e0e0' : '#333';
        const gridColor = isDark ? '#404040' : '#f0f0f0';

        Object.values(this.charts).forEach(chart => {
            if (chart.options.plugins && chart.options.plugins.legend) {
                chart.options.plugins.legend.labels.color = textColor;
            }
            
            if (chart.options.scales) {
                Object.values(chart.options.scales).forEach(scale => {
                    if (scale.ticks) {
                        scale.ticks.color = textColor;
                    }
                    if (scale.grid) {
                        scale.grid.color = gridColor;
                    }
                    if (scale.pointLabels) {
                        scale.pointLabels.color = textColor;
                    }
                });
            }
            
            chart.update();
        });
    }

    // Create mini charts for dashboard
    createMiniChart(canvasId, type, data, options = {}) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    display: false
                },
                y: {
                    display: false
                }
            },
            elements: {
                point: {
                    radius: 2
                }
            }
        };

        const mergedOptions = { ...defaultOptions, ...options };

        return new Chart(ctx, {
            type: type,
            data: data,
            options: mergedOptions
        });
    }

    // Get trending data
    getTrendingData() {
        const ratings = storageManager.getRatings();
        const last30Days = new Date();
        last30Days.setDate(last30Days.getDate() - 30);

        const recentRatings = ratings.filter(rating => 
            new Date(rating.date) >= last30Days
        );

        // Group by week
        const weeklyData = {};
        recentRatings.forEach(rating => {
            const week = this.getWeekNumber(new Date(rating.date));
            if (!weeklyData[week]) {
                weeklyData[week] = { total: 0, count: 0 };
            }
            
            const dayAverage = rating.scores.reduce((sum, score) => sum + score.value, 0) / rating.scores.length;
            weeklyData[week].total += dayAverage;
            weeklyData[week].count++;
        });

        const trendData = Object.keys(weeklyData).map(week => ({
            week: parseInt(week),
            average: weeklyData[week].total / weeklyData[week].count
        })).sort((a, b) => a.week - b.week);

        return trendData;
    }

    // Helper function to get week number
    getWeekNumber(date) {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    }
}

// Create global instance
window.chartsManager = new ChartsManager();
