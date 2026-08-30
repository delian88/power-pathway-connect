<?php
require_once 'config.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

try {
    $stmt = $pdo->prepare("
        INSERT INTO Registration (id, firstName, lastName, email, phone, organization, jobTitle, ticketType, status, createdAt, updatedAt)
        VALUES (UUID(), :firstName, :lastName, :email, :phone, :organization, :jobTitle, :ticketType, 'PENDING', NOW(3), NOW(3))
    ");
    
    $stmt->execute([
        ':firstName' => $input['firstName'] ?? '',
        ':lastName' => $input['lastName'] ?? '',
        ':email' => $input['email'] ?? '',
        ':phone' => $input['phone'] ?? '',
        ':organization' => $input['organization'] ?? null,
        ':jobTitle' => $input['jobTitle'] ?? null,
        ':ticketType' => $input['ticketType'] ?? 'standard'
    ]);
    
    // Send Confirmation Emails
    require_once __DIR__ . '/PHPMailer/Exception.php';
    require_once __DIR__ . '/PHPMailer/PHPMailer.php';
    require_once __DIR__ . '/PHPMailer/SMTP.php';

    $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'nutech2025@gmail.com';
        $mail->Password   = 'owrh saib zyan sluf'; // App Password
        $mail->SMTPSecure = \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port       = 465;

        // Email to the user
        $mail->setFrom('nutech2025@gmail.com', 'National Electricity Workshop');
        $mail->addAddress($input['email'], $input['firstName'] . ' ' . $input['lastName']);
        $mail->isHTML(true);
        $mail->Subject = 'Registration Confirmation - National Electricity Workshop';
        $mail->Body    = "<h2>Dear {$input['firstName']},</h2>
                          <p>Thank you for registering for the 2-DAY NATIONAL WORKSHOP ON THE ELECTRICITY ACT 2023.</p>
                          <p>We have received your details and our team will be in touch with you shortly.</p>
                          <br>
                          <p>Best regards,<br>National Electricity Workshop Team</p>";
        $mail->send();

        // Clear recipients for the admin email
        $mail->clearAllRecipients();

        // Email to the admin
        $mail->addAddress('nutech2025@gmail.com', 'Admin');
        $mail->Subject = 'New Registration: ' . $input['firstName'] . ' ' . $input['lastName'];
        $mail->Body    = "<h2>New Registration Received</h2>
                          <p><strong>Name:</strong> {$input['firstName']} {$input['lastName']}</p>
                          <p><strong>Email:</strong> {$input['email']}</p>
                          <p><strong>Phone:</strong> {$input['phone']}</p>
                          <p><strong>Organization:</strong> {$input['organization']}</p>
                          <p><strong>Job Title:</strong> {$input['jobTitle']}</p>
                          <p><strong>Ticket Type:</strong> {$input['ticketType']}</p>";
        $mail->send();
    } catch (Exception $e) {
        // Log mailer error but don't fail the request since registration succeeded
        error_log("Message could not be sent. Mailer Error: {$mail->ErrorInfo}");
    }
    
    echo json_encode(['success' => true]);
} catch (\PDOException $e) {
    // http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
