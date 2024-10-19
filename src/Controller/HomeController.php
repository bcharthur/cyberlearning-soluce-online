<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class HomeController extends AbstractController
{
    #[Route('/', name: 'app_home')]
    public function index(): Response
    {
        $scriptBase64Dir = $this->getParameter('kernel.project_dir') . '/templates/home/fragments/programmation/base64/script';
        $scriptRequestDir = $this->getParameter('kernel.project_dir') . '/templates/home/fragments/programmation/request/script';
        $scriptsCalculMentalDir = $this->getParameter('kernel.project_dir') . '/templates/home/fragments/programmation/calculMental/script';
        $scriptsDeuxFoisDeSuiteDir = $this->getParameter('kernel.project_dir') . '/templates/home/fragments/programmation/deuxFoisDeSuite/script';

        $filesystem = new Filesystem();

        // Obtenir les scripts Base64
        $scriptsBase64 = array_filter(array_diff(scandir($scriptBase64Dir), ['.', '..']), function ($file) use ($scriptBase64Dir) {
            return pathinfo($scriptBase64Dir . '/' . $file, PATHINFO_EXTENSION) === 'py';
        });

        // Obtenir les scripts Request
        $scriptsRequest = array_filter(array_diff(scandir($scriptRequestDir), ['.', '..']), function ($file) use ($scriptRequestDir) {
            return pathinfo($scriptRequestDir . '/' . $file, PATHINFO_EXTENSION) === 'py';
        });

        // Obtenir les scripts Request
        $scriptsCalculMental = array_filter(array_diff(scandir($scriptsCalculMentalDir), ['.', '..']), function ($file) use ($scriptsCalculMentalDir) {
            return pathinfo($scriptsCalculMentalDir . '/' . $file, PATHINFO_EXTENSION) === 'py';
        });

        $scriptsDeuxFoisDeSuite = array_filter(array_diff(scandir($scriptsDeuxFoisDeSuiteDir), ['.', '..']), function ($file) use ($scriptsDeuxFoisDeSuiteDir) {
            return pathinfo($scriptsDeuxFoisDeSuiteDir . '/' . $file, PATHINFO_EXTENSION) === 'py';
        });

        return $this->render('home/index.html.twig', [
            'scripts_base64' => $scriptsBase64,
            'scripts_request' => $scriptsRequest,
            'scripts_calculMental' => $scriptsCalculMental,
            'scripts_deuxFoisDeSuite' => $scriptsDeuxFoisDeSuite,
        ]);
    }
}
