<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Process\Process;
use Symfony\Component\Routing\Annotation\Route;
use Psr\Log\LoggerInterface;

class DeuxFoisDeSuiteController extends AbstractController
{
    #[Route('/deuxFoisDeSuite', name: 'app_deuxFoisDeSuite_home')]
    public function index(LoggerInterface $logger): Response
    {
        $logPath = $this->getParameter('kernel.project_dir') . '/templates/home/logs/script.log';
        $scriptDir = $this->getParameter('kernel.project_dir') . '/templates/home/fragments/programmation/deuxFoisDeSuite/script';
        $filesystem = new Filesystem();

        $scripts = array_filter(array_diff(scandir($scriptDir), ['.', '..']), function ($file) use ($scriptDir) {
            return pathinfo($scriptDir . '/' . $file, PATHINFO_EXTENSION) === 'py';
        });

        if (!$filesystem->exists($logPath)) {
            $filesystem->touch($logPath);
            $logContent = 'Le fichier de logs a été créé, mais est encore vide.';
        } else {
            $logContent = file_get_contents($logPath);
        }

        return $this->render('home/index.html.twig', [
            'controller_name' => 'DeuxFoisDeSuiteController',
            'log_content' => $logContent,
            'scripts' => $scripts
        ]);
    }

    #[Route('/run-script-deuxFoisDeSuite', name: 'run_script_deuxFoisDeSuite', methods: ['POST'])]
    public function runScript(Request $request, LoggerInterface $logger): Response
    {
        $pythonPath = $this->getParameter('kernel.project_dir') . '/.venv/Scripts/python.exe';
        $scriptName = $request->request->get('script_name');
        $token = $request->request->get('token');

        $scriptPath = $this->getParameter('kernel.project_dir') . '/templates/home/fragments/programmation/deuxFoisDeSuite/script/' . $scriptName;

        if (!file_exists($scriptPath)) {
            return $this->json([
                'status' => 'error',
                'message' => 'Le script demandé n\'existe pas.'
            ]);
        }

        $process = new Process([$pythonPath, $scriptPath, $token]);

        try {
            $process->mustRun();
            $output = $process->getOutput();

            // Log complet de la sortie brute
            $logger->info('Sortie brute du script Python:', ['output' => $output]);

            // Tentative de décodage JSON
            $decodedOutput = json_decode($output, true);

            // Si le décodage JSON échoue
            if (json_last_error() !== JSON_ERROR_NONE) {
                $logger->error('Échec du décodage du JSON.', ['json_error' => json_last_error_msg(), 'output' => $output]);
                return $this->json([
                    'status' => 'error',
                    'message' => 'Réponse invalide du script Python.',
                    'output' => $output  // Retourner la sortie brute pour analyse
                ]);
            }

            // Log des détails de la réponse JSON si elle est valide
            $logger->info('Réponse JSON du script Python:', ['json_output' => $decodedOutput]);

            // Traitement du JSON renvoyé
            if ($decodedOutput['status'] === 'success') {
                $logger->info('Script exécuté avec succès.', [
                    'code_obtenu' => $decodedOutput['data']['code_obtenu'] ?? 'Aucun code obtenu',
                    'message' => $decodedOutput['message']
                ]);
                return $this->json($decodedOutput);
            }

            // Si le script renvoie une erreur
            $logger->error('Erreur renvoyée par le script.', ['message' => $decodedOutput['message']]);
            return $this->json($decodedOutput);

        } catch (\Exception $e) {
            // Gestion des erreurs inattendues
            $logger->error('Erreur inattendue lors de l\'exécution du script Python.', ['error' => $e->getMessage()]);
            return $this->json([
                'status' => 'error',
                'message' => 'Erreur inattendue lors de l\'exécution du script Python.',
                'details' => $e->getMessage()  // Inclure le détail de l'exception
            ]);
        }
    }

    #[Route('/get-script-deuxFoisDeSuite', name: 'get_script_deuxFoisDeSuite')]
    public function getScript(Request $request): Response
    {
        $scriptName = $request->query->get('script_name');
        $scriptPath = $this->getParameter('kernel.project_dir') . '/templates/home/fragments/programmation/deuxFoisDeSuite/script/' . $scriptName;

        if (!file_exists($scriptPath)) {
            return new Response('Le script demandé n\'existe pas.', Response::HTTP_NOT_FOUND);
        }

        return new Response(file_get_contents($scriptPath));
    }

    #[Route('/save-script-deuxFoisDeSuite', name: 'save_script_deuxFoisDeSuite', methods: ['POST'])]
    public function saveScript(Request $request): Response
    {
        $newContent = $request->request->get('script_content');
        $scriptName = $request->request->get('script_name');
        $scriptPath = $this->getParameter('kernel.project_dir') . '/templates/home/fragments/programmation/deuxFoisDeSuite/script/' . $scriptName;

        file_put_contents($scriptPath, $newContent);

        return new Response('Script mis à jour avec succès.');
    }
}
