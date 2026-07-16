<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Simple .env parser since Namecheap doesn't auto-load it
$envFile = __DIR__ . '/../.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        list($name, $value) = explode('=', $line, 2);
        putenv(trim($name) . '=' . trim($value));
        $_ENV[trim($name)] = trim($value);
    }
}

// Function to parse DATABASE_URL
// Format: mysql://USER:PASSWORD@HOST:PORT/DATABASE
function parseDatabaseUrl($url) {
    if (!$url) return null;
    $parsed = parse_url($url);
    if (!$parsed) return null;
    
    return [
        'host' => $parsed['host'] ?? 'localhost',
        'port' => $parsed['port'] ?? '3306',
        'user' => $parsed['user'] ?? 'root',
        'pass' => $parsed['pass'] ?? '',
        'db'   => ltrim($parsed['path'], '/')
    ];
}

// Hardcoded for production so it works without .env
$dbHost = 'fhbc9r.h.filess.io';
$dbUser = 'electricity_workshop_pigmeetago';
$dbPass = '59692ec2711c9977d8656c7a190f8e6eda2d3ae3';
$dbName = 'electricity_workshop_pigmeetago';
$dbPort = '3307';

if ($dbHost && $dbUser && $dbName) {
    $dbConfig = [
        'host' => $dbHost,
        'port' => $dbPort,
        'user' => $dbUser,
        'pass' => $dbPass ?? '',
        'db'   => ltrim($dbName, '/')
    ];
} else {
    // Fallback if somehow not hardcoded
    $dbConfig = [
        'host' => 'localhost',
        'port' => '3306',
        'user' => 'root',
        'pass' => '',
        'db'   => ''
    ];
}

$dsn = "mysql:host={$dbConfig['host']};port={$dbConfig['port']};dbname={$dbConfig['db']};charset=utf8mb4";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $dbConfig['user'], $dbConfig['pass'], $options);
} catch (\PDOException $e) {
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}
