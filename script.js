// Initialisation de Supabase avec vos clés d'API
const supabaseUrl = 'https://tyjbimuyxvmenhaadfwq.supabase.co'; // URL de Supabase
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5amJpbXV5eHZtZW5oYWFkZndxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEwNjY2NTIsImV4cCI6MjAzNjY0MjY1Mn0.qGJHPUHnDRRtcZEMAMysX2m81mtXsqGBQSJ3VcP5jag'; // Clé API de Supabase
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey); // Création du client Supabase

// Ajouter un gestionnaire d'événements pour la soumission du formulaire
document.getElementById('ideaForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Empêche la soumission du formulaire

    var libelle = document.getElementById('libelle').value; // Récupérer la valeur du champ "libelle"
    var categorie = document.getElementById('categorie').value; // Récupérer la valeur du champ "categorie"
    var message = document.getElementById('message').value; // Récupérer la valeur du champ "message"

    var isValid = true; // Initialiser la variable de validation
    // Réinitialiser les messages d'erreur
    document.getElementById('libelleError').textContent = ''; // Réinitialiser le message d'erreur pour "libelle"
    document.getElementById('messageError').textContent = ''; // Réinitialiser le message d'erreur pour "message"
    document.getElementById('messageContainer').textContent = ''; // Réinitialiser le conteneur de messages

     // Vérifier si le libellé contient entre 1 et 10 mots
     var libelleWords = libelle.trim().split(/\s+/); // Séparer le libelle en mots
     if (libelleWords.length < 1 || libelleWords.length > 10) { // Vérifier le nombre de mots
         displayMessage('Le libellé doit contenir entre 1 et 10 mots.', 'error'); // Afficher un message d'erreur
         document.getElementById('libelleError').textContent = 'Le libellé doit contenir entre 1 et 10 mots.'; // Afficher un message d'erreur pour "libelle"
         isValid = false; // Définir la variable de validation sur false
     } 
 
     // Vérifier si le message contient entre 10 et 225 mots
     var messageWords = message.trim().split(/\s+/); // Séparer le message en mots
     if (messageWords.length < 1 || messageWords.length > 225) { // Vérifier le nombre de mots
         displayMessage('Le message descriptif doit contenir entre 10 et 225 mots.', 'error'); // Afficher un message d'erreur
         document.getElementById('messageError').textContent = 'Le message descriptif doit contenir entre 10 et 225 mots.'; // Afficher un message d'erreur pour "message"
         isValid = false; // Définir la variable de validation sur false
     }
 
     // Vérifier si le libellé ou le message contient des balises HTML
     var htmlTagPattern = /<\/?[^>]+(>|$)/g; // Définir le motif de recherche des balises HTML
     if (htmlTagPattern.test(libelle) || htmlTagPattern.test(message)) { // Vérifier si des balises HTML sont présentes
         displayMessage('Les balises HTML ne sont pas autorisées.', 'error'); // Afficher un message d'erreur
         if (htmlTagPattern.test(libelle)) { // Si des balises HTML sont présentes dans le libelle
             document.getElementById('libelleError').textContent = 'Les balises HTML ne sont pas autorisées dans le libellé.'; // Afficher un message d'erreur pour "libelle"
         }
         if (htmlTagPattern.test(message)) { // Si des balises HTML sont présentes dans le message
             document.getElementById('messageError').textContent = 'Les balises HTML ne sont pas autorisées dans le message descriptif.'; // Afficher un message d'erreur pour "message"
         }
         isValid = false; // Définir la variable de validation sur false
     }
 
     // Si tout est valide, soumettre le formulaire ou faire autre chose
     if (isValid) {
         var newIdea = {
             libelle: libelle, // Définir le libelle de la nouvelle idée
             categorie: categorie, // Définir la catégorie de la nouvelle idée
             message: message, // Définir le message de la nouvelle idée
             approuvee: true // Définir chaque idée comme approuvée par défaut
         };

         // Ajouter la nouvelle idée à Supabase
        let { data, error } = await supabaseClient
        .from('idee') // Spécifier la table "idee"
        .insert([newIdea]); // Insérer la nouvelle idée

    if (error) { // Si une erreur se produit
        displayMessage('Erreur lors de la soumission de votre idée.', 'error'); // Afficher un message d'erreur
        console.error(error); // Afficher l'erreur dans la console
    } else {
        // Afficher la nouvelle idée
        displayIdea(data[0]); // Appeler la fonction pour afficher la nouvelle idée

        // Réinitialiser le formulaire
        document.getElementById('ideaForm').reset(); // Réinitialiser le formulaire

        // Afficher un message de succès
        displayMessage('Votre idée a été soumise avec succès.', 'success'); // Afficher un message de succès
    }
}
});

// Fonction pour afficher un message
function displayMessage(message, type) {
    var messageContainer = document.getElementById('messageContainer'); // Récupérer le conteneur de messages
    messageContainer.innerHTML = `<p class="${type}">${message}</p>`; // Afficher le message avec le type spécifié
    setTimeout(() => {
        messageContainer.innerHTML = ''; // Effacer le message après 2 secondes
    }, 2000); // Message disparaît après 2 secondes
}

// Fonction pour afficher une idée
function displayIdea(idea) {
    var card = createIdeaCard(idea); // Créer une carte pour l'idée
    document.getElementById('ideasCardContainer').appendChild(card); // Ajouter la carte au conteneur
}


// Fonction pour créer une carte d'idée
function createIdeaCard(idea) {
    var card = document.createElement('div'); // Créer un div pour la carte
    card.classList.add('card'); // Ajouter la classe 'card'

    var cardTitle = document.createElement('h3'); // Créer un élément h3 pour le titre
    cardTitle.textContent = idea.libelle; // Définir le texte du titre

    var cardCategory = document.createElement('p'); // Créer un élément p pour la catégorie
    cardCategory.textContent = `Catégorie: ${idea.categorie}`; // Définir le texte de la catégorie

    var cardMessage = document.createElement('p'); // Créer un élément p pour le message
    cardMessage.textContent = idea.message; // Définir le texte du message
    
    var cardActions = document.createElement('div'); // Créer un div pour les actions
    cardActions.classList.add('card-actions'); // Ajouter la classe 'card-actions'

    var approveButton = document.createElement('button'); // Créer un bouton pour l'approbation
    approveButton.textContent = idea.approuvee ? 'Approuver' : 'Désapprouver'; // Définir le texte du bouton
    approveButton.addEventListener('click', async () => { // Ajouter un gestionnaire d'événements pour le bouton
        idea.approuvee = !idea.approuvee; // Inverser l'état d'approbation de l'idée
        approveButton.textContent = idea.approuvee ? 'Approuver' : 'Désapprouver'; // Mettre à jour le texte du bouton