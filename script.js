// Initialisation de Supabase avec vos clés d'API
const supabaseUrl = 'https://tyjbimuyxvmenhaadfwq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5amJpbXV5eHZtZW5oYWFkZndxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEwNjY2NTIsImV4cCI6MjAzNjY0MjY1Mn0.qGJHPUHnDRRtcZEMAMysX2m81mtXsqGBQSJ3VcP5jag';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener("DOMContentLoaded", () => {
    const ideaForm = document.getElementById('ideaForm');
    const ideasCardContainer = document.getElementById('ideasCardContainer');
    const messageContainer = document.getElementById('messageContainer');

    let ideas = JSON.parse(localStorage.getItem('ideas')) || [];

    // Fonction pour afficher les idées
    const displayIdeas = () => {
        ideasCardContainer.innerHTML = '';
        ideas.forEach((idea, index) => {
            const card = document.createElement('div');
            card.className = `card ${idea.approved ? 'approved' : idea.approved === false ? 'disapproved' : ''}`;
            card.innerHTML = `
                <h3>${idea.libelle}</h3>
                <p>${idea.categorie}</p>
                <p>${idea.message}</p>
                <div class="card-actions">
                    <button onclick="approveIdea(${index}, true)" title="Approuver">
                        <i class="fas fa-check"></i>
                    </button>
                    <button onclick="approveIdea(${index}, false)" title="Désapprouver">
                        <i class="fas fa-times"></i>
                    </button>
                    <button onclick="deleteIdea(${index})" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            ideasCardContainer.appendChild(card);
        });
    };

    // Fonction pour afficher un message
    const showMessage = (message, isError = false) => {
        messageContainer.textContent = message;
        messageContainer.style.color = isError ? 'red' : 'green';
        setTimeout(() => {
            messageContainer.textContent = '';
        }, 2000);
    };

    // Fonction pour afficher un message d'erreur pour un champ spécifique
    const displayErrorMessage = (fieldId, message) => {
        const field = document.getElementById(fieldId);
        field.style.borderColor = 'red'; // Marque le champ en rouge
        showMessage(message, true);
    };

    // Fonction pour approuver/désapprouver une idée
    window.approveIdea = (index, isApproved) => {
        ideas[index].approved = isApproved;
        localStorage.setItem('ideas', JSON.stringify(ideas));
        displayIdeas();
    };

    // Fonction pour supprimer une idée
    window.deleteIdea = (index) => {
        ideas.splice(index, 1);
        localStorage.setItem('ideas', JSON.stringify(ideas));
        displayIdeas();
    };

    // Validation du formulaire et soumission
    ideaForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const libelle = document.getElementById('libelle').value.trim();
        const categorie = document.getElementById('categorie').value;
        const message = document.getElementById('message').value.trim();

        let isValid = true;

        // Validation du libellé (3 à 15 caractères, uniquement des lettres)
        if (!libelle.match(/^[a-zA-ZÀ-ÿ\s]+$/)) {
            displayErrorMessage('libelle', 'Le libellé ne doit contenir que des lettres.');
            isValid = false;
        } else if (libelle.length < 3 || libelle.length > 15) {
            displayErrorMessage('libelle', 'Le libellé doit avoir entre 3 et 15 caractères.');
            isValid = false;
        }

        // Validation du message (1 à 255 caractères, uniquement des lettres)
        if (!message.match(/^[a-zA-ZÀ-ÿ-.\s]+$/)) {
            displayErrorMessage('message', 'Le message ne doit contenir que des lettres.');
            isValid = false;
        } else if (message.length < 1 || message.length > 255) {
            displayErrorMessage('message', 'Le message doit avoir entre 1 et 150 caractères.');
            isValid = false;
        }

        if (!isValid) return;

        const newIdea = { libelle, categorie, message, approved: null };
        ideas.push(newIdea);
        localStorage.setItem('ideas', JSON.stringify(ideas));
        displayIdeas();

        // Sauvegarde dans Supabase
        const { data, error } = await supabaseClient
            .from('idee') 
            .insert([newIdea]);

        if (error) {
            showMessage('Erreur lors de la sauvegarde dans Supabase', true);
            console.error(error);
        } else {
            showMessage('Idée ajoutée avec succès');
        }

        ideaForm.reset();
    });

    // Charger les idées depuis Supabase
    const loadIdeas = async () => {
        let { data, error } = await supabaseClient
            .from('idee')
            .select('*');

        if (error) {
            showMessage('Erreur lors du chargement des idées.', true);
            console.error(error);
        } else {
            if (data && data.length > 0) {
                // Filtrer les idées pour éviter les doublons
                const existingIdeas = new Set(ideas.map(idea => idea.libelle));
                data.forEach(idea => {
                    if (!existingIdeas.has(idea.libelle)) {
                        ideas.push(idea);
                    }
                });
                localStorage.setItem('ideas', JSON.stringify(ideas));
                displayIdeas();
            } else {
                console.log('Aucune idée trouvée.');
            }
        }
    };

    loadIdeas(); // Charger les idées au chargement de la page
});
