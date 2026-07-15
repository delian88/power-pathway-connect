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
    
    echo json_encode(['success' => true]);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
