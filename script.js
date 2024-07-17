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