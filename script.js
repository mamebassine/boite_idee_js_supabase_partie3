// Initialisation de Supabase avec vos clés d'API
const supabaseUrl = 'https://tyjbimuyxvmenhaadfwq.supabase.co'; // URL de Supabase
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5amJpbXV5eHZtZW5oYWFkZndxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEwNjY2NTIsImV4cCI6MjAzNjY0MjY1Mn0.qGJHPUHnDRRtcZEMAMysX2m81mtXsqGBQSJ3VcP5jag'; // Clé API de Supabase
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey); // Création du client Supabase