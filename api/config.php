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

$dbUrl = getenv('DATABASE_URL') ?: $_ENV['DATABASE_URL'] ?? null;
$dbConfig = null;

// Allow using individual credentials if provided, otherwise fallback to URL parser
$dbHost = getenv('DB_HOST') ?: $_ENV['DB_HOST'] ?? null;
$dbUser = getenv('DB_USER') ?: $_ENV['DB_USER'] ?? null;
$dbPass = getenv('DB_PASS') ?: $_ENV['DB_PASS'] ?? null;
$dbName = getenv('DB_NAME') ?: $_ENV['DB_NAME'] ?? null;
$dbPort = getenv('DB_PORT') ?: $_ENV['DB_PORT'] ?? '3306';

if ($dbHost && $dbUser && $dbName) {
    $dbConfig = [
        'host' => $dbHost,
        'port' => $dbPort,
        'user' => $dbUser,
        'pass' => $dbPass ?? '',
        'db'   => ltrim($dbName, '/')
    ];
} else if ($dbUrl) {
    $dbConfig = parseDatabaseUrl($dbUrl);
}

if (!$dbConfig) {
    echo json_encode(['error' => 'Database credentials missing. Provide DB_HOST, DB_USER, DB_PASS, DB_NAME or DATABASE_URL in .env']);
    exit;
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
