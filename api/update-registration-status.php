<?php
require_once 'config.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['id']) || !isset($input['status'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON or missing id/status']);
    exit;
}

try {
    $stmt = $pdo->prepare("UPDATE Registration SET status = :status, updatedAt = NOW(3) WHERE id = :id");
    $stmt->execute([
        ':status' => $input['status'],
        ':id' => $input['id']
    ]);
    
    echo json_encode(['success' => true]);
} catch (\PDOException $e) {
    // http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
