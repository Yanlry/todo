document.addEventListener('DOMContentLoaded', () => {
    const quotes = [
        { text: "La vie est ce qui arrive quand vous êtes occupé à faire d'autres projets.", author: "John Lennon" },
        { text: "Le bonheur est parfois caché dans l'inconnu.", author: "Victor Hugo" },
        { text: "La meilleure façon de prédire l'avenir est de l'inventer.", author: "Alan Kay" },
        { text: "Il n'y a qu'une façon d'échouer, c'est de ne pas essayer.", author: "Georges Clémenceau" },
        { text: "Rien n'est impossible à celui qui essaie.", author: "Alexandre Dumas" },
        { text: "Le seul moyen de faire du bon travail est d'aimer ce que vous faites.", author: "Steve Jobs" },
        { text: "Le plus grand obstacle à la réussite est la peur de l'échec.", author: "Sven Goran Eriksson" },
        { text: "Chaque jour est une nouvelle chance de changer votre vie.", author: "Inconnu" },
        { text: "Les seuls rêves qui se réalisent sont ceux que vous osez poursuivre.", author: "Inconnu" },
        { text: "Le succès est d'aller d'échec en échec sans perdre son enthousiasme.", author: "Winston Churchill" },
        { text: "Le bonheur n'est pas quelque chose de prêt à l'emploi. Il vient de vos propres actions.", author: "Dalai Lama" },
        { text: "Ce qui ne nous tue pas nous rend plus fort.", author: "Friedrich Nietzsche" },
        { text: "La vie est un défi, relève-le !", author: "Mère Teresa" },
        { text: "Tout ce que vous avez toujours voulu est de l'autre côté de la peur.", author: "George Addair" },
        { text: "L'avenir appartient à ceux qui croient à la beauté de leurs rêves.", author: "Eleanor Roosevelt" },
        { text: "La persévérance est la clé du succès.", author: "Inconnu" },
        { text: "Le plus grand risque est de ne prendre aucun risque.", author: "Mark Zuckerberg" },
        { text: "Faites de chaque jour votre chef-d'œuvre.", author: "John Wooden" },
        { text: "Il n'y a pas de chemin vers le bonheur, le bonheur est le chemin.", author: "Bouddha" },
        { text: "Nous devenons ce que nous croyons.", author: "Eleanor Roosevelt" },
        { text: "Les seules limites de nos réalisations de demain sont nos doutes d'aujourd'hui.", author: "Franklin D. Roosevelt" },
        { text: "Le bonheur est une direction, pas une destination.", author: "Inconnu" },
        { text: "Ce que vous faites aujourd'hui peut améliorer tous vos lendemains.", author: "Ralph Marston" },
        { text: "Tout ce dont vous avez besoin est déjà en vous.", author: "Inconnu" },
        { text: "Les défis sont ce qui rend la vie intéressante; les surmonter est ce qui lui donne un sens.", author: "Joshua J. Marine" },
        { text: "La vie est 10 % ce qui nous arrive et 90 % comment nous y réagissons.", author: "Charles R. Swindoll" },
        { text: "Votre temps est limité, ne le perdez pas à vivre la vie de quelqu'un d'autre.", author: "Steve Jobs" },
        { text: "La seule personne qui peut vous empêcher de réussir, c'est vous-même.", author: "Inconnu" },
        { text: "Le bonheur est une chaleur intérieure.", author: "Inconnu" },
        { text: "Chaque jour est une occasion d'apprendre et de grandir.", author: "Inconnu" },
        { text: "Rien n'est impossible pour celui qui ose.", author: "Inconnu" },
        { text: "Ce n'est pas la montagne que nous conquérons, mais nous-mêmes.", author: "Edmund Hillary" },
        { text: "Le succès ne consiste pas à gagner, mais à se relever après chaque échec.", author: "Inconnu" },
        { text: "La vie commence là où commence ta zone de confort.", author: "Neale Donald Walsch" },
        { text: "Il est toujours trop tôt pour abandonner.", author: "Inconnu" },
        { text: "Le vrai bonheur ne dépend pas de ce que vous avez ou de qui vous êtes, il dépend uniquement de ce que vous pensez.", author: "Dale Carnegie" },
        { text: "La patience est amère, mais son fruit est doux.", author: "Jean-Jacques Rousseau" },
        { text: "La simplicité est la sophistication suprême.", author: "Léonard de Vinci" },
        { text: "Les petites choses ne sont pas petites.", author: "Inconnu" },
        { text: "Le plus grand cadeau que vous pouvez offrir est votre temps.", author: "Inconnu" },
        { text: "Ayez la foi en vous-même et tout devient possible.", author: "Inconnu" },
        { text: "Le changement est le résultat final de tout vrai apprentissage.", author: "Leo Buscaglia" },
        { text: "L'amour est la seule chose qui croît quand on la partage.", author: "Antoine de Saint-Exupéry" },
        { text: "La créativité est l'intelligence qui s'amuse.", author: "Albert Einstein" },
        { text: "Le bonheur est fait maison.", author: "Inconnu" },
        { text: "Ce que vous pensez de vous-même est beaucoup plus important que ce que les autres pensent de vous.", author: "Inconnu" },
        { text: "La vie est un écho. Ce que vous envoyez revient.", author: "Inconnu" },
        { text: "Le vrai courage est de regarder la réalité en face sans avoir peur.", author: "Inconnu" },
        { text: "Le plus grand défi est de se connaître soi-même.", author: "Inconnu" }
    ];

    let currentQuote = {};
    let score = 0;
    let highScore = parseInt(localStorage.getItem('highScore'), 10) || 0; // Récupère le meilleur score enregistré

    const getRandomQuote = () => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        return quotes[randomIndex];
    };

    const displayQuote = () => {
        const quote = getRandomQuote();
        currentQuote = quote;
        const quoteElement = document.getElementById('quote');
        const authorElement = document.getElementById('author');
        const incompleteQuoteElement = document.getElementById('incomplete-quote');

        const words = quote.text.split(' ');
        const missingWordIndex = Math.floor(Math.random() * words.length);
        const missingWord = words[missingWordIndex];
        words[missingWordIndex] = '____';
        const incompleteQuote = words.join(' ');

        authorElement.textContent = `— ${quote.author}`;
        incompleteQuoteElement.textContent = incompleteQuote;
        document.getElementById('feedback').textContent = '';
        document.getElementById('user-input').value = '';
        document.getElementById('submit-answer').dataset.correctAnswer = missingWord.toLowerCase();
        document.getElementById('continue').style.display = 'none';
        document.getElementById('give-up').style.display = 'inline';
        document.getElementById('restart').style.display = 'none';
    };

    const checkAnswer = () => {
        const userInput = document.getElementById('user-input').value.trim().toLowerCase();
        const correctAnswer = document.getElementById('submit-answer').dataset.correctAnswer;
        const feedbackElement = document.getElementById('feedback');

        if (userInput === correctAnswer) {
            feedbackElement.textContent = 'Félicitations ! Vous avez trouvé le bon mot !';
            feedbackElement.style.color = 'green';
            updateScore();
            displayCompleteQuote();
            document.getElementById('continue').style.display = 'inline';
            document.getElementById('give-up').style.display = 'none';
            document.getElementById('restart').style.display = 'none';
        } else {
            feedbackElement.textContent = 'Désolé, ce n\'est pas la bonne réponse. Essayez encore !';
            feedbackElement.style.color = 'red';
        }
    };

    const displayCompleteQuote = () => {
        const incompleteQuoteElement = document.getElementById('incomplete-quote');
        incompleteQuoteElement.textContent = currentQuote.text;
    };

    const updateScore = () => {
        score += 1;
        document.getElementById('score').textContent = score;

        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore); // Enregistre le meilleur score
            document.getElementById('high-score').textContent = highScore; // Met à jour l'affichage du meilleur score
        }
    };

    const continueGame = () => {
        displayQuote();
    };

    const giveUp = () => {
        displayCompleteQuote();
        document.getElementById('score').textContent = '0';
        document.getElementById('continue').style.display = 'none';
        document.getElementById('give-up').style.display = 'none';
        document.getElementById('restart').style.display = 'inline';
    };

    const restartGame = () => {
        score = 0;
        document.getElementById('score').textContent = score;
        displayQuote();
    };

    const submitButton = document.getElementById('submit-answer');
    if (submitButton) {
        submitButton.addEventListener('click', checkAnswer);
    }

    const continueButton = document.getElementById('continue');
    if (continueButton) {
        continueButton.addEventListener('click', continueGame);
    }

    const giveUpButton = document.getElementById('give-up');
    if (giveUpButton) {
        giveUpButton.addEventListener('click', giveUp);
    }

    const restartButton = document.getElementById('restart');
    if (restartButton) {
        restartButton.addEventListener('click', restartGame);
    }

    // Affiche la citation initiale et le meilleur score au chargement de la page
    displayQuote();
    document.getElementById('high-score').textContent = highScore;
});
