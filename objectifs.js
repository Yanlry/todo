document.addEventListener('DOMContentLoaded', () => {
    const goalForm = document.getElementById('goal-form');
    const goalList = document.getElementById('goal-list');
    const completedGoalList = document.getElementById('completed-goal-list');
    const progressBar = document.getElementById('progress');
    const progressText = document.getElementById('progress-text');

    // Get the clear button and add event listener
    const clearButton = document.getElementById('clear-completed-goals');
    
    clearButton.addEventListener('click', () => {
        // Get goals from localStorage
        let goals = JSON.parse(localStorage.getItem('goals')) || [];
        
        // Filter out completed goals
        goals = goals.filter(goal => !goal.completedDate); // Only keep goals that are not completed
        
        // Save the remaining goals back to localStorage
        localStorage.setItem('goals', JSON.stringify(goals));
        
        // Clear the list of completed goals in the UI
        document.getElementById('completed-goal-list').innerHTML = '';
        
        // Optionally, show a confirmation or notification that the list was cleared
        alert('Tous les objectifs terminés ont été supprimés.');
        
        // Reload the goals to update the UI
        loadGoals();
    });

    // Fonction pour formater la date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', options);
    };

    // Charger les objectifs depuis le localStorage
    const loadGoals = () => {
        let goals = JSON.parse(localStorage.getItem('goals')) || [];
        console.log("Loading goals from localStorage:", goals); // Debugging

        // Trier les objectifs
        const thresholdDate = new Date('2000-01-01');
        goals.sort((a, b) => {
            const dateA = new Date(a.endDate);
            const dateB = new Date(b.endDate);
            if (dateA < thresholdDate && dateB >= thresholdDate) {
                return -1;
            } else if (dateA >= thresholdDate && dateB < thresholdDate) {
                return 1;
            }
            return dateA - dateB;
        });

        goalList.innerHTML = '';
        completedGoalList.innerHTML = '';

        goals.forEach((goal, index) => {
            if (isGoalCompleted(goal)) {
                addCompletedGoalToList(goal, index);
            } else {
                addGoalToList(goal, index);
            }
        });

        updateProgress();
        updateAverageCompletionPercentage();
    };

   const addGoalToList = (goal, index) => {
    const li = document.createElement('li');
    li.className = 'goal-item';
    li.innerHTML = `
        <h3>${goal.name}</h3>
        <p>Validé chaque jour où vous contribuez à votre objectif - Se termine le ${formatDate(goal.endDate)}</p>
        <div class="checkbox-container">
            ${goal.dates.map(date => `
                <label>
                    <input type="checkbox" data-date="${date}" ${goal.completedDates.includes(date) ? 'checked' : ''}>
                    ${formatDate(date)}
                </label>
            `).join('')}
        </div>
        <div class="button-container">
            <button class="complete-button">Terminer l'objectif</button>
            <button class="delete-button">Supprimer</button>
        </div>
    `;
    goalList.appendChild(li);

    li.querySelector('.delete-button').addEventListener('click', () => {
        deleteGoal(index);
    });

    li.querySelector('.complete-button').addEventListener('click', () => {
        markGoalAsCompleted(index);
    });

    li.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            handleCheckboxChange(index, checkbox);
        });
    });
};


    const addCompletedGoalToList = (goal, index) => {
        const li = document.createElement('li');
        li.className = 'goal-item';
    
        const completedPercentage = goal.initialCompletionPercentage !== undefined
            ? goal.initialCompletionPercentage
            : calculateCompletionPercentage(goal);
    
        // Ensure the completedDate is properly formatted and set
        const completedDate = goal.completedDate ? formatDate(goal.completedDate) : "Date inconnue";
    
        li.innerHTML = `
            <div class="goal-header">
                <h3>${goal.name}</h3>
                <p class="goal-date">- Terminé le ${completedDate}</p>
            </div>
            <div class="goal-progress">
                <p>Progression: ${completedPercentage}%</p>
            </div>
            <div class="goal-actions">
                <button class="delete-button">Supprimer</button>
            </div>
        `;
        completedGoalList.appendChild(li);
    
        li.querySelector('.delete-button').addEventListener('click', () => {
            deleteGoal(index);
        });
    };
    

    const calculateAverageCompletionPercentage = () => {
        const goals = JSON.parse(localStorage.getItem('goals')) || [];
        let totalPercentage = 0;
        let completedGoalCount = 0;
    
        goals.forEach(goal => {
            if (goal.completedDate) {  // Check if the goal is completed
                const completedPercentage = goal.initialCompletionPercentage !== undefined
                    ? goal.initialCompletionPercentage
                    : calculateCompletionPercentage(goal);
    
                totalPercentage += completedPercentage;
                completedGoalCount++;
            }
        });
    
        return completedGoalCount > 0 ? (totalPercentage / completedGoalCount).toFixed(2) : 0;
    };
    

    const updateAverageCompletionPercentage = () => {
        const averagePercentage = calculateAverageCompletionPercentage();
        const averagePercentageElement = document.getElementById('average-percentage');
        averagePercentageElement.textContent = `${averagePercentage}%`;
    };

    goalForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('goal-name').value;
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;

        if (new Date(startDate) > new Date(endDate)) {
            alert('La date de début doit être antérieure à la date de fin.');
            return;
        }

        const dates = [];
        let currentDate = new Date(startDate);
        while (currentDate <= new Date(endDate)) {
            dates.push(currentDate.toISOString().split('T')[0]); // Format YYYY-MM-DD
            currentDate.setDate(currentDate.getDate() + 1);
        }

        const goal = {
            name,
            startDate,
            endDate,
            dates,
            completedDates: [],
            completedDate: null
        };

        const goals = JSON.parse(localStorage.getItem('goals')) || [];
        goals.push(goal);

        console.log("Saving goals:", goals);
        localStorage.setItem('goals', JSON.stringify(goals));
        console.log("Stored in localStorage:", localStorage.getItem('goals'));

        addGoalToList(goal, goals.length - 1);
        goalForm.reset();
        updateProgress();
        updateAverageCompletionPercentage();
    });

    const deleteGoal = (index) => {
        const goals = JSON.parse(localStorage.getItem('goals')) || [];
        goals.splice(index, 1);
        localStorage.setItem('goals', JSON.stringify(goals));
        loadGoals();
    };

    const markGoalAsCompleted = (index) => {
        const goals = JSON.parse(localStorage.getItem('goals')) || [];
        const goal = goals[index];
        if (!goal) return;
    
        // Calculate the percentage of completion
        const completionPercentage = calculateCompletionPercentage(goal);
    
        // Set the completedDate to the current date when the goal is completed
        const currentDate = new Date();
        goal.completedDate = currentDate.toISOString().split('T')[0]; // Saving the current date
    
        // Store the initial percentage at the time of completion
        goal.initialCompletionPercentage = completionPercentage;
    
        localStorage.setItem('goals', JSON.stringify(goals));
        
        // Update goals and average after marking as complete
        loadGoals();
        updateAverageCompletionPercentage(); // Ensure the average is updated
    };
    
    

    const handleCheckboxChange = (index, checkbox) => {
        const date = checkbox.getAttribute('data-date');
        const goals = JSON.parse(localStorage.getItem('goals'));
    
        if (!goals[index]) return;
    
        // Toggle the date's completion status
        if (checkbox.checked) {
            if (!goals[index].completedDates.includes(date)) {
                goals[index].completedDates.push(date);
            }
        } else {
            goals[index].completedDates = goals[index].completedDates.filter(d => d !== date);
        }
    
        // Save progress without completing the goal
        localStorage.setItem('goals', JSON.stringify(goals));
        loadGoals(); // This will update the UI accordingly
    };
    
    const isGoalCompleted = (goal) => {
        if (!goal || !goal.dates) {
            console.error("Goal or goal.dates is undefined", goal);
            return false;
        }
    
        // The goal is only marked as completed if it has a completedDate.
        return !!goal.completedDate;
    };
    
    const calculateCompletionPercentage = (goal) => {
        if (goal.dates.length === 0) return 0;
        return Math.floor((goal.completedDates.length / goal.dates.length) * 100);
    };

    const updateProgress = () => {
        const goals = JSON.parse(localStorage.getItem('goals')) || [];
        let totalCompleted = 0;
        let totalDays = 0;
    
        goals.forEach(goal => {
            if (!goal.completedDate) {  // Only consider ongoing goals
                totalDays += goal.dates.length;
                totalCompleted += goal.completedDates.length;
            }
        });
    
        const percentage = totalDays > 0 ? Math.floor((totalCompleted / totalDays) * 100) : 0;
        progressBar.style.width = `${percentage}%`;
        progressText.textContent = `${percentage}%`;
    };
    
    

    loadGoals();
});
