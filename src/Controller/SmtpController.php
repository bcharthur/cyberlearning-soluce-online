<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Process\Process;
use Symfony\Component\Routing\Annotation\Route;
use Psr\Log\LoggerInterface;

class SmtpController extends AbstractController
{
    private static $smtpProcess = null;

    #[Route('/smtp/start', name: 'smtp_start', methods: ['POST'])]
    public function startSmtpServer(Request $request, LoggerInterface $logger): Response
    {
        if (self::$smtpProcess && self::$smtpProcess->isRunning()) {
            return new Response("Le serveur SMTP est déjà démarré.", 200);
        }

        $pythonPath = $this->getParameter('kernel.project_dir') . '/env/Scripts/python.exe';
        $smtpScript = $this->getParameter('kernel.project_dir') . '/templates/home/scripts/smtp_server.py';
        $port = $request->request->get('port', 1025);

        // Démarrer le serveur SMTP
        self::$smtpProcess = new Process([$pythonPath, $smtpScript, $port]);
        self::$smtpProcess->start();

        $logger->info("Serveur SMTP démarré sur le port $port.");
        return new Response("Serveur SMTP démarré sur le port $port.");
    }

    #[Route('/smtp/stop', name: 'smtp_stop', methods: ['POST'])]
    public function stopSmtpServer(LoggerInterface $logger): Response
    {
        if (self::$smtpProcess && self::$smtpProcess->isRunning()) {
            self::$smtpProcess->stop();
            $logger->info("Serveur SMTP arrêté.");
            return new Response("Serveur SMTP arrêté.");
        }

        return new Response("Aucun serveur SMTP en cours d'exécution.", 400);
    }

    #[Route('/smtp/restart', name: 'smtp_restart', methods: ['POST'])]
    public function restartSmtpServer(Request $request, LoggerInterface $logger): Response
    {
        $this->stopSmtpServer($logger);
        return $this->startSmtpServer($request, $logger);
    }

    #[Route('/smtp/status', name: 'smtp_status', methods: ['GET'])]
    public function smtpStatus(): Response
    {
        // Vérifier si le port 1025 est utilisé (cela signifie que le serveur est en cours d'exécution)
        $port = 1025;
        $process = new Process(['lsof', '-i', ":$port"]);
        $process->run();

        if ($process->getOutput() === '') {
            // Port libre, donc le serveur n'est pas en marche
            return new Response("stopped", 200);
        }

        // Le serveur est en marche
        return new Response("running", 200);
    }

    #[Route('/send-mail', name: 'send_mail', methods: ['POST'])]
    public function sendMail(Request $request): Response
    {
        $from = $request->request->get('from');
        $to = $request->request->get('to');
        $subject = $request->request->get('subject');
        $body = $request->request->get('body');

        $pythonPath = $this->getParameter('kernel.project_dir') . '/env/Scripts/python.exe';
        $sendMailScript = $this->getParameter('kernel.project_dir') . '/templates/home/scripts/send_mail.py';

        $process = new Process([$pythonPath, $sendMailScript, $from, $to, $subject, $body]);
        $process->run();

        if (!$process->isSuccessful()) {
            return new Response('Erreur lors de l\'envoi de l\'e-mail.', 500);
        }

        return new Response('E-mail envoyé avec succès.');
    }

    public function __destruct()
    {
        // S'assurer que le serveur SMTP est arrêté à la fermeture de Symfony
        if (self::$smtpProcess && self::$smtpProcess->isRunning()) {
            self::$smtpProcess->stop();
        }
    }
}
