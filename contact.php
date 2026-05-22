<?php
// contact.php
header('Access-Control-Allow-Origin: http://localhost:5177');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode([
        'status' => 'online',
        'message' => 'PHP server is reachable and CORS is configured for port 5177.'
    ]);
    exit;
}

header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Only POST requests are allowed.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid JSON payload.']);
    exit;
}

$name = trim($input['name'] ?? '');
$email = trim($input['email'] ?? '');
$message = trim($input['message'] ?? '');

if ($name === '' || $email === '' || $message === '') {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Name, email, and message are all required.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Please provide a valid email address.']);
    exit;
}

// MySQL connection settings
// MySQL connection settings
$dbHost = '127.0.0.1';
$dbUser = 'root';             // XAMPP default user
$dbPass = '';                 // XAMPP default password is empty
$dbName = 'portfolio_db';
$dbPort = 3306;

$mysqli = new mysqli($dbHost, $dbUser, $dbPass, $dbName, $dbPort);
if ($mysqli->connect_errno) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed: ' . $mysqli->connect_error]);
    exit;
}

$mysqli->set_charset('utf8mb4');

$insertSql = 'INSERT INTO contact_messages (`name`, `email`, `message`, `created_at`) VALUES (?, ?, ?, NOW())';
$stmt = $mysqli->prepare($insertSql);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database prepare failed: ' . $mysqli->error]);
    exit;
}

$stmt->bind_param('sss', $name, $email, $message);
if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database save failed: ' . $stmt->error]);
    exit;
}

$stmt->close();
$mysqli->close();

require __DIR__ . '/phpmailer/src/Exception.php';
require __DIR__ . '/phpmailer/src/PHPMailer.php';
require __DIR__ . '/phpmailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);

try {
    $mail->CharSet = 'UTF-8';
    $mail->isSMTP();
    $mail->SMTPAuth = true;
    $mail->SMTPDebug = 0;
    $mail->Host = 'smtp.gmail.com';
    $mail->Username = 'alemusewnet210@gmail.com';
    $mail->Password = 'ohyg gfey julc hleo';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    $mail->setFrom('alemusewnet210@gmail.com', 'Portfolio Contact Form');
    $mail->addAddress('alemusewnet210@gmail.com', 'Alemu Sewnet');
    $mail->addReplyTo($email, $name);

    $mail->Subject = 'New portfolio contact message';
    $mail->Body = "You have a new message from your portfolio contact form:\n\n"
        . "Name: $name\n"
        . "Email: $email\n\n"
        . "Message:\n$message\n";
    $mail->AltBody = $mail->Body;

    $mail->send();

    echo json_encode(['status' => 'success', 'message' => 'Message saved and email sent successfully.']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Message saved, but email could not be sent. Mailer Error: ' . $mail->ErrorInfo]);
}
//hi alemu