<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Process;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Filesystem\Filesystem;
use Psr\Log\LoggerInterface;

class HomeController extends AbstractController
{
    #[Route('/', name: 'app_home')]
    public function index(LoggerInterface $logger): Response
    {
        $logPath = $this->getParameter('kernel.project_dir') . '/templates/home/logs/script.log';
        $scriptDir = $this->getParameter('kernel.project_dir') . '/templates/home/scripts';
        $filesystem = new Filesystem();

        // Liste des scripts Python dans le répertoire "scripts"
        $scripts = array_diff(scandir($scriptDir), ['.', '..']);

        // Vérification si le fichier de logs existe, sinon on le crée
        if (!$filesystem->exists($logPath)) {
            $filesystem->touch($logPath); // Créer le fichier s'il n'existe pas
            $logContent = 'Le fichier de logs a été créé, mais est encore vide.';
        } else {
            // Lire le contenu du fichier de logs
            $logContent = file_get_contents($logPath);
        }

        // Démarrage du serveur SMTP si ce n'est pas déjà fait
        $this->startSmtpServer($logger);

        return $this->render('home/index.html.twig', [
            'controller_name' => 'HomeController',
            'log_content' => $logContent,
            'scripts' => $scripts  // Passer les scripts à la vue
        ]);
    }

    private function startSmtpServer(LoggerInterface $logger)
    {
        $pythonPath = $this->getParameter('kernel.project_dir') . '/env/Scripts/python.exe';
        $smtpScript = $this->getParameter('kernel.project_dir') . '/templates/home/scripts/smtp_server.py';
        $port = 1025;  // Port SMTP par défaut

        // Vérifier si le serveur SMTP est déjà en marche
        $process = new Process(['lsof', '-i', ":$port"]);
        $process->run();

        if ($process->getOutput() === '') {
            // Si aucune sortie, cela signifie que le port n'est pas utilisé, démarrer le serveur
            $smtpProcess = new Process([$pythonPath, $smtpScript, $port]);
            $smtpProcess->start();
            $logger->info("Serveur SMTP démarré sur le port $port.");
        } else {
            $logger->info("Le serveur SMTP est déjà en marche sur le port $port.");
        }
    }

    #[Route('/run-script', name: 'run_script', methods: ['POST'])]
    public function runScript(Request $request, LoggerInterface $logger): Response
    {
        // Chemin vers Python
        $pythonPath = $this->getParameter('kernel.project_dir') . '/env/Scripts/python.exe';
        $scriptName = $request->request->get('script_name');  // Récupérer le nom du script sélectionné
        $scriptPath = $this->getParameter('kernel.project_dir') . '/templates/home/scripts/' . $scriptName;

        // Créer le processus pour exécuter le script Python sélectionné
        $process = new Process([$pythonPath, $scriptPath]);

        try {
            $process->mustRun();
            $output = $process->getOutput();

            // Log en cas de succès
            $logger->info('Script Python exécuté avec succès.', ['output' => $output]);
        } catch (ProcessFailedException $exception) {
            $logger->error('Erreur lors de l\'exécution du script Python.', ['error' => $exception->getMessage()]);
            $output = 'Erreur : ' . $exception->getMessage();
        }

        // Retourne la réponse à la page (optionnel, on peut l'utiliser pour afficher la sortie)
        return new Response($output);
    }

    #[Route('/get-script', name: 'get_script')]
    public function getScript(Request $request): Response
    {
        $scriptName = $request->query->get('script_name');
        $scriptPath = $this->getParameter('kernel.project_dir') . '/templates/home/scripts/' . $scriptName;
        $scriptContent = file_get_contents($scriptPath);

        return new Response($scriptContent);
    }

    #[Route('/save-script', name: 'save_script', methods: ['POST'])]
    public function saveScript(Request $request): Response
    {
        $newContent = $request->request->get('script_content');
        $scriptName = $request->request->get('script_name');
        $scriptPath = $this->getParameter('kernel.project_dir') . '/templates/home/scripts/' . $scriptName;

        // Sauvegarde le nouveau contenu du script
        file_put_contents($scriptPath, $newContent);

        return new Response('Script mis à jour avec succès.');
    }
}
