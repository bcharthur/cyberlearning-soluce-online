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

class DefaultController extends AbstractController
{
    #[Route('/run-script-default', name: 'run_script_default', methods: ['POST'])]
    public function runScript(Request $request, LoggerInterface $logger): Response
    {
        // Chemin vers Python
        $pythonPath = $this->getParameter('kernel.project_dir') . '/.venv/Scripts/python.exe';
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

    #[Route('/get-script-default', name: 'get_script_default')]
    public function getScript(Request $request): Response
    {
        $scriptName = $request->query->get('script_name');
        $scriptPath = $this->getParameter('kernel.project_dir') . '/templates/home/scripts/' . $scriptName;
        $scriptContent = file_get_contents($scriptPath);

        return new Response($scriptContent);
    }

    #[Route('/save-script-default', name: 'save_script_default', methods: ['POST'])]
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
