<?php
require_once 'config.php';

try {
    $stmt = $pdo->query("SELECT * FROM SiteSettings WHERE id = 1");
    $settings = $stmt->fetch();
    
    if ($settings) {
        // Decode JSON fields if needed
        if (isset($settings['sponsorshipPackages']) && !empty($settings['sponsorshipPackages'])) {
            $settings['sponsorshipPackages'] = json_decode($settings['sponsorshipPackages'], true);
        }
        echo json_encode($settings);
    } else {
        echo json_encode(null);
    }
} catch (\PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
