<?php
require_once 'config.php';

try {
    $data = [];
    
    // Get SiteSettings
    $stmt = $pdo->query("SELECT * FROM SiteSettings WHERE id = 1");
    $settings = $stmt->fetch();
    if ($settings && isset($settings['sponsorshipPackages'])) {
        $settings['sponsorshipPackages'] = json_decode($settings['sponsorshipPackages'], true);
    }
    $data['settings'] = $settings;
    
    // Get Events (limit 10)
    $stmt = $pdo->query("SELECT * FROM Event ORDER BY date DESC LIMIT 10");
    $data['events'] = $stmt->fetchAll();
    
    // Get Schedule Items
    $stmt = $pdo->query("SELECT * FROM ScheduleItem ORDER BY day ASC, timeRange ASC");
    $data['scheduleItems'] = $stmt->fetchAll();
    
    echo json_encode($data);
} catch (\PDOException $e) {
    // http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
