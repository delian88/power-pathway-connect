<?php
require_once 'config.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

try {
    $email = $input['email'];
    $checkStmt = $pdo->prepare("SELECT COUNT(*) FROM Registration WHERE email = :email");
    $checkStmt->execute([':email' => $email]);
    $existingCount = $checkStmt->fetchColumn();

    if ($existingCount >= 2) {
        http_response_code(400);
        echo json_encode(['error' => 'You cannot use that email. It has already been registered the maximum number of times.']);
        exit;
    }

    $idStmt = $pdo->query("SELECT id FROM Registration WHERE id LIKE 'NEW2023-%' ORDER BY createdAt DESC LIMIT 1");
    $lastId = $idStmt->fetchColumn();
    $nextNumber = 1;
    if ($lastId) {
        $parts = explode('-', $lastId);
        if (count($parts) === 2) {
            $num = (int)$parts[1];
            if ($num > 0) {
                $nextNumber = $num + 1;
            }
        }
    }
    $registrationId = "NEW2023-" . str_pad($nextNumber, 3, "0", STR_PAD_LEFT);
    $stmt = $pdo->prepare("
        INSERT INTO Registration (id, firstName, lastName, email, phone, organization, jobTitle, ticketType, address, city, country, zipCode, gender, status, createdAt, updatedAt)
        VALUES (:id, :firstName, :lastName, :email, :phone, :organization, :jobTitle, :ticketType, :address, :city, :country, :zipCode, :gender, 'PENDING', NOW(3), NOW(3))
    ");
    
    $stmt->execute([
        ':id' => $registrationId,
        ':firstName' => $input['firstName'] ?? '',
        ':lastName' => $input['lastName'] ?? '',
        ':email' => $input['email'] ?? '',
        ':phone' => $input['phone'] ?? '',
        ':organization' => $input['organization'] ?? null,
        ':jobTitle' => $input['jobTitle'] ?? null,
        ':ticketType' => $input['ticketType'] ?? 'standard',
        ':address' => $input['address'] ?? null,
        ':city' => $input['city'] ?? null,
        ':country' => $input['country'] ?? null,
        ':zipCode' => $input['zipCode'] ?? null,
        ':gender' => $input['gender'] ?? null
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
        $mail->Password   = 'dzae szth wwmr xmba'; // Corrected App Password
        $mail->SMTPSecure = \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port       = 465;

        // Email to the user
        $mail->setFrom('nutech2025@gmail.com', 'National Electricity Workshop');
        $mail->addAddress($input['email'], $input['firstName'] . ' ' . $input['lastName']);
        $mail->isHTML(true);
        $mail->Subject = 'Registration Confirmation - National Electricity Workshop';
        
        $qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=NIES2023:{$registrationId}";
        
        $mail->Body    = "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='utf-8'>
            <title>Registration Confirmation</title>
        </head>
        <body style='font-family: Arial, sans-serif; background-color: #f8f9fa; color: #333; margin: 0; padding: 20px;'>
            <div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-top: 5px solid #008753;'>
                <h2 style='color: #0F1A1C; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px; margin-top: 0;'>Registration Confirmed</h2>
                <p style='font-size: 16px;'>Dear <strong>{$input['firstName']}</strong>,</p>
                <p style='font-size: 16px; line-height: 1.5;'>Thank you for registering for the <strong>2-DAY NATIONAL WORKSHOP ON THE ELECTRICITY ACT 2023</strong>.</p>
                <div style='background-color: #f1f8f5; border-left: 4px solid #008753; padding: 15px; margin: 20px 0;'>
                    <h3 style='margin-top: 0; color: #008753;'>Your Event Pass</h3>
                    <p style='margin: 5px 0;'><strong>Ticket Type:</strong> {$input['ticketType']}</p>
                    <p style='margin: 5px 0;'><strong>Name:</strong> {$input['firstName']} {$input['lastName']}</p>
                    <p style='margin: 5px 0;'><strong>Registration ID:</strong> {$registrationId}</p>
                </div>
                <div style='text-align: center; margin: 30px 0;'>
                    <p style='font-size: 14px; color: #666; margin-bottom: 10px;'>Please present this QR code at the event for check-in:</p>
                    <img src='{$qrCodeUrl}' alt='QR Code' style='border: 1px solid #ddd; padding: 10px; border-radius: 8px; background: #fff;' />
                </div>
                <p style='font-size: 16px; line-height: 1.5;'>We have received your details and our team will be in touch with you shortly with further updates.</p>
                <br>
                <p style='font-size: 14px; color: #777; border-top: 1px solid #f0f0f0; padding-top: 20px;'>
                    Best regards,<br>
                    <strong>National Electricity Workshop Team</strong>
                </p>
            </div>
        </body>
        </html>";
        $mail->send();

        // Clear recipients for the admin email
        $mail->clearAllRecipients();

        // Email to the admin
        $mail->addAddress('nutech2025@gmail.com', 'Admin');
        $mail->Subject = 'New Registration: ' . $input['firstName'] . ' ' . $input['lastName'];
        $mail->Body    = "
<div style='font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);'>
  <div style='background: #008753; color: #fff; padding: 20px; text-align: center;'>
    <h2 style='margin: 0; font-size: 24px;'>New Registration Alert</h2>
    <p style='margin: 5px 0 0; color: #D4AF37; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;'>National Electricity Workshop 2023</p>
  </div>
  <div style='padding: 30px; background: #fff;'>
    <p style='font-size: 16px; line-height: 1.5; margin-top: 0;'>A new attendee has just registered. Here are their details:</p>
    
    <table style='width: 100%; border-collapse: collapse; margin-top: 20px;'>
      <tr>
        <td style='padding: 12px 15px; background: #f9f9f9; border-bottom: 1px solid #eee; font-weight: bold; width: 35%; color: #0F1A1C;'>Registration ID</td>
        <td style='padding: 12px 15px; border-bottom: 1px solid #eee;'>{$registrationId}</td>
      </tr>
      <tr>
        <td style='padding: 12px 15px; background: #f9f9f9; border-bottom: 1px solid #eee; font-weight: bold; color: #0F1A1C;'>Name</td>
        <td style='padding: 12px 15px; border-bottom: 1px solid #eee;'>{$input['firstName']} {$input['lastName']}</td>
      </tr>
      <tr>
        <td style='padding: 12px 15px; background: #f9f9f9; border-bottom: 1px solid #eee; font-weight: bold; color: #0F1A1C;'>Email</td>
        <td style='padding: 12px 15px; border-bottom: 1px solid #eee;'><a href='mailto:{$input['email']}' style='color: #008753;'>{$input['email']}</a></td>
      </tr>
      <tr>
        <td style='padding: 12px 15px; background: #f9f9f9; border-bottom: 1px solid #eee; font-weight: bold; color: #0F1A1C;'>Phone</td>
        <td style='padding: 12px 15px; border-bottom: 1px solid #eee;'>{$input['phone']}</td>
      </tr>
      <tr>
        <td style='padding: 12px 15px; background: #f9f9f9; border-bottom: 1px solid #eee; font-weight: bold; color: #0F1A1C;'>Organization</td>
        <td style='padding: 12px 15px; border-bottom: 1px solid #eee;'>{$input['organization']}</td>
      </tr>
      <tr>
        <td style='padding: 12px 15px; background: #f9f9f9; border-bottom: 1px solid #eee; font-weight: bold; color: #0F1A1C;'>Job Title</td>
        <td style='padding: 12px 15px; border-bottom: 1px solid #eee;'>{$input['jobTitle']}</td>
      </tr>
      <tr>
        <td style='padding: 12px 15px; background: #f9f9f9; border-bottom: 1px solid #eee; font-weight: bold; color: #0F1A1C;'>Ticket Type</td>
        <td style='padding: 12px 15px; border-bottom: 1px solid #eee;'><span style='background: #e6f3ee; color: #008753; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 13px;'>{$input['ticketType']}</span></td>
      </tr>
      <tr>
        <td style='padding: 12px 15px; background: #f9f9f9; border-bottom: 1px solid #eee; font-weight: bold; color: #0F1A1C;'>Gender</td>
        <td style='padding: 12px 15px; border-bottom: 1px solid #eee;'>{$input['gender']}</td>
      </tr>
      <tr>
        <td style='padding: 12px 15px; background: #f9f9f9; border-bottom: 1px solid #eee; font-weight: bold; color: #0F1A1C;'>Address</td>
        <td style='padding: 12px 15px; border-bottom: 1px solid #eee;'>{$input['address']}<br>{$input['city']}, {$input['country']} {$input['zipCode']}</td>
      </tr>
    </table>
    
    <div style='margin-top: 30px; text-align: center; border-top: 1px solid #f0f0f0; padding-top: 20px;'>
      <p style='font-size: 13px; color: #888; margin: 0;'>Automated message from NIES 2023 System</p>
    </div>
  </div>
</div>";
        $mail->send();
    } catch (Exception $e) {
        // Log mailer error but don't fail the request since registration succeeded
        error_log("Message could not be sent. Mailer Error: {$mail->ErrorInfo}");
    }
    
    echo json_encode(['success' => true, 'id' => $registrationId]);
} catch (\PDOException $e) {
    // http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
