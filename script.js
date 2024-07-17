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