<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Process\Process;
use Symfony\Component\Routing\Annotation\Route;
use Psr\Log\LoggerInterface;

class RequestController extends AbstractController
{
    #[Route('/', name: 'app_home')]
    public function index(LoggerInterface $logger): Response
    {
        $logPath = $this->getParameter('kernel.project_dir') . '/templates/home/logs/script.log';
        $scriptDir = $this->getParameter('kernel.project_dir') . '/templates/home/fragments/programmation/request/script';
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

        return $this->render('home/index.html.twig', [
            'controller_name' => 'HomeController',
            'log_content' => $logContent,
            'scripts' => $scripts  // Passer les scripts à la vue
        ]);
    }

    #[Route('/run-script-request', name: 'run_script_request', methods: ['POST'])]
    public function runScript(Request $request, LoggerInterface $logger): Response
    {
        // Chemin vers Python
        $pythonPath = $this->getParameter('kernel.project_dir') . '/.venv/Scripts/python.exe';

        // Récupérer le nom du script et le jeton
        $scriptName = $request->request->get('script_name');
        $token = $request->request->get('token');  // Récupérer le jeton
        $scriptPath = $this->getParameter('kernel.project_dir') . '/templates/home/fragments/programmation/request/script/' . $scriptName;

        // Créer le processus pour exécuter le script Python avec le jeton
        $process = new Process([$pythonPath, $scriptPath, $token]);

        try {
            // Exécuter le processus sans lever d'exception en cas d'erreur
            $process->run();

            // Récupérer la sortie
            $output = $process->getOutput();

            // Décoder le JSON
            $decodedOutput = json_decode($output, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                // Si la sortie n'est pas un JSON valide, renvoyer un message générique
                $responseContent = [
                    'status' => 'error',
                    'message' => 'Réponse invalide du script Python.'
                ];

                // Log l'erreur sans données sensibles
                $logger->error('Réponse invalide du script Python.', [
                    'output' => $output
                ]);
            } else {
                // Vérifier le statut dans la réponse JSON
                if (isset($decodedOutput['status']) && $decodedOutput['status'] === 'success') {
                    $responseContent = $decodedOutput;

                    // Log le succès avec le code_obtenu
                    $logger->info('Script Python exécuté avec succès.', [
                        'code_obtenu' => $decodedOutput['data']['code_obtenu'],
                        'message' => $decodedOutput['message']
                    ]);
                } elseif (isset($decodedOutput['status']) && $decodedOutput['status'] === 'error') {
                    // Erreur renvoyée par le script Python
                    $responseContent = $decodedOutput;

                    // Log l'erreur sans les données sensibles
                    $logger->error('Erreur lors de l\'exécution du script Python.', [
                        'message' => $decodedOutput['message']
                    ]);
                } else {
                    // Structure JSON inattendue
                    $responseContent = [
                        'status' => 'error',
                        'message' => 'Structure de réponse inattendue du script Python.'
                    ];

                    // Log l'erreur sans données sensibles
                    $logger->error('Structure de réponse inattendue du script Python.', [
                        'output' => $decodedOutput
                    ]);
                }
            }
        } catch (\Exception $exception) {
            // Erreur inattendue lors de l'exécution du script Python
            $logger->error('Erreur inattendue lors de l\'exécution du script Python.', [
                'error' => $exception->getMessage()
            ]);
            $responseContent = [
                'status' => 'error',
                'message' => 'Erreur inattendue lors de l\'exécution du script Python.'
            ];
        }

        // Retourne la réponse JSON à la page
        return $this->json($responseContent);
    }

    #[Route('/get-script-request', name: 'get_script_request')]
    public function getScript(Request $request): Response
    {
        $scriptName = $request->query->get('script_name');
        $scriptPath = $this->getParameter('kernel.project_dir') . '/templates/home/fragments/programmation/request/script/' . $scriptName;
        $scriptContent = file_get_contents($scriptPath);

        return new Response($scriptContent);
    }

    #[Route('/save-script-request', name: 'save_script_request', methods: ['POST'])]
    public function saveScript(Request $request): Response
    {
        $newContent = $request->request->get('script_content');
        $scriptName = $request->request->get('script_name');
        $scriptPath = $this->getParameter('kernel.project_dir') . '/templates/home/fragments/programmation/request/script/' . $scriptName;

        // Sauvegarde le nouveau contenu du script
        file_put_contents($scriptPath, $newContent);

        return new Response('Script mis à jour avec succès.');
    }
}
