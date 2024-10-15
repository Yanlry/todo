// Simuler les données pour l'exemple
const tasks = [
    { title: "Faire les courses", completed: false },
    { title: "Envoyer le rapport", completed: true },
    { title: "Préparer la présentation", completed: false },
    { title: "Répondre aux emails", completed: false }
];

const goals = [
    { title: "Apprendre une nouvelle langue", progress: "En cours" },
    { title: "Courir un marathon", progress: "Planifié" },
    { title: "Écrire un livre", progress: "En cours" }
];

const dailyMeditation = "Prenez un moment pour respirer profondément et vous concentrer sur le présent.";

const progressSummary = "Vous avez complété 45% de vos tâches pour ce mois-ci.";

const lifetimeGoals = [
    "Voyager dans 5 nouveaux pays",
    "Apprendre à jouer d'un instrument",
    "Créer une œuvre d'art"
];

function loadDashboard() {
    // Remplir la liste des tâches
    const taskList = document.getElementById('task-list');
    tasks.slice(0, 3).forEach(task => {
        const listItem = document.createElement('li');
        listItem.textContent = task.title;
        if (task.completed) listItem.classList.add('completed');
        taskList.appendChild(listItem);
    });

    // Remplir la liste des objectifs
    const goalList = document.getElementById('goal-list');
    goals.slice(0, 3).forEach(goal => {
        const listItem = document.createElement('li');
        listItem.textContent = `${goal.title} - ${goal.progress}`;
        goalList.appendChild(listItem);
    });

    // Remplir la méditation du jour
    const meditationElement = document.getElementById('daily-meditation');
    meditationElement.textContent = dailyMeditation;

   
}



// Charger les données au chargement de la page
window.onload = loadDashboard;
