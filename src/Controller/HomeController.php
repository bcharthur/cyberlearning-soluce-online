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
//    #[Route('/', name: 'app_home')]
//    public function index(LoggerInterface $logger): Response
//    {
//        $logPath = $this->getParameter('kernel.project_dir') . '/templates/home/logs/script.log';
//        $scriptDir = $this->getParameter('kernel.project_dir') . '/templates/home/scripts';
//        $filesystem = new Filesystem();
//
//        // Liste des scripts Python dans le répertoire "scripts"
//        $scripts = array_diff(scandir($scriptDir), ['.', '..']);
//
//        // Vérification si le fichier de logs existe, sinon on le crée
//        if (!$filesystem->exists($logPath)) {
//            $filesystem->touch($logPath); // Créer le fichier s'il n'existe pas
//            $logContent = 'Le fichier de logs a été créé, mais est encore vide.';
//        } else {
//            // Lire le contenu du fichier de logs
//            $logContent = file_get_contents($logPath);
//        }
//
//        return $this->render('home/index.html.twig', [
//            'controller_name' => 'HomeController',
//            'log_content' => $logContent,
//            'scripts' => $scripts  // Passer les scripts à la vue
//        ]);
//    }
}
